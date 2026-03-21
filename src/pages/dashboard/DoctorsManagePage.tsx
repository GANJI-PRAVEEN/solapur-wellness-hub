import { useState } from "react";
import { DOCTORS, SPECIALTIES, WARDS } from "@/lib/mock-data";
import type { Doctor } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Users, Plus, Search, Edit, Trash2, Star, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DoctorsManagePage() {
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS);
  const [search, setSearch] = useState("");
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { toast } = useToast();

  // Form state
  const [form, setForm] = useState({ name: "", specialty: "General Medicine", hospital: "", ward: WARDS[0], experience: 5, rating: 4.0 });

  const filtered = doctors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    const newDoc: Doctor = {
      id: `d_${Date.now()}`,
      ...form,
      available: true,
      slots: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    };
    setDoctors(prev => [...prev, newDoc]);
    setShowAdd(false);
    setForm({ name: "", specialty: "General Medicine", hospital: "", ward: WARDS[0], experience: 5, rating: 4.0 });
    toast({ title: "Doctor added", description: `${newDoc.name} has been added successfully.` });
  };

  const toggleAvailability = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, available: !d.available } : d));
  };

  const handleDelete = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    toast({ title: "Doctor removed", variant: "destructive" });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-in-up">
        <div>
          <h1 className="text-xl font-bold text-foreground">Manage Doctors</h1>
          <p className="text-sm text-muted-foreground">Add, edit, and manage doctor availability</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Add Doctor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Doctor</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. ..." /></div>
              <div><Label>Specialty</Label>
                <Select value={form.specialty} onValueChange={v => setForm(p => ({ ...p, specialty: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SPECIALTIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Hospital</Label><Input value={form.hospital} onChange={e => setForm(p => ({ ...p, hospital: e.target.value }))} /></div>
              <div><Label>Ward</Label>
                <Select value={form.ward} onValueChange={v => setForm(p => ({ ...p, ward: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Experience (yrs)</Label><Input type="number" value={form.experience} onChange={e => setForm(p => ({ ...p, experience: +e.target.value }))} /></div>
                <div><Label>Rating</Label><Input type="number" step="0.1" value={form.rating} onChange={e => setForm(p => ({ ...p, rating: +e.target.value }))} /></div>
              </div>
              <Button onClick={handleAdd} disabled={!form.name || !form.hospital} className="w-full">Add Doctor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-5 animate-in-up">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search doctors..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map((doc, i) => (
          <div key={doc.id} className={`rounded-xl bg-card border p-4 flex flex-col sm:flex-row sm:items-center gap-4 card-hover animate-in-up`}>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{doc.name}</h3>
                {!doc.available && <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">Unavailable</span>}
              </div>
              <p className="text-sm text-primary">{doc.specialty}</p>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{doc.hospital}</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning" />{doc.rating}</span>
                <span>{doc.experience} yrs</span>
                <span>{doc.ward.split(" - ")[0]}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Available</span>
                <Switch checked={doc.available} onCheckedChange={() => toggleAvailability(doc.id)} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-muted-foreground animate-in-up">{filtered.length} doctors total</div>
    </div>
  );
}
