import { useState } from "react";
import { CAMPAIGNS, WARDS } from "@/lib/mock-data";
import type { Campaign } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, Plus, Edit, Users, MapPin, CalendarCheck, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function CampaignsManagePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS);
  const [showAdd, setShowAdd] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "", description: "", type: "vaccination" as Campaign["type"],
    date: "", time: "", location: "", ward: WARDS[0], eligibility: "", capacity: 500,
  });

  const handleAdd = () => {
    const newCampaign: Campaign = {
      id: `c_${Date.now()}`, ...form,
      status: "upcoming", registrations: 0,
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    setShowAdd(false);
    toast({ title: "Campaign created" });
  };

  const updateStatus = (id: string, status: Campaign["status"]) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    toast({ title: `Campaign marked as ${status}` });
  };

  const handleDelete = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    toast({ title: "Campaign deleted", variant: "destructive" });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-in-up">
        <div>
          <h1 className="text-xl font-bold text-foreground">Campaign Management</h1>
          <p className="text-sm text-muted-foreground">Create and manage health campaigns & vaccination drives</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />New Campaign</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Campaign</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2 max-h-[60vh] overflow-y-auto pr-1">
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as Campaign["type"] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="awareness">Awareness</SelectItem>
                      <SelectItem value="drive">Drive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: +e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
                <div><Label>Time</Label><Input value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} placeholder="09:00 AM - 04:00 PM" /></div>
              </div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></div>
              <div><Label>Ward</Label>
                <Select value={form.ward} onValueChange={v => setForm(p => ({ ...p, ward: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Eligibility</Label><Input value={form.eligibility} onChange={e => setForm(p => ({ ...p, eligibility: e.target.value }))} placeholder="e.g. Adults 18+" /></div>
              <Button onClick={handleAdd} disabled={!form.title || !form.date} className="w-full">Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {campaigns.map(c => {
          const pct = Math.round((c.registrations / c.capacity) * 100);
          return (
            <div key={c.id} className="rounded-xl bg-card border p-5 card-hover animate-in-up">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      c.status === "ongoing" ? "bg-success/10 text-success" :
                      c.status === "upcoming" ? "bg-info/10 text-info" :
                      "bg-muted text-muted-foreground"
                    }`}>{c.status}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{c.type}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><CalendarCheck className="h-3 w-3" />{c.date} • {c.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.location}</span>
                  </div>
                  <div className="max-w-xs">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />Registrations</span>
                      <span className="font-medium tabular-nums">{c.registrations}/{c.capacity}</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {c.status === "upcoming" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(c.id, "ongoing")}>Start Campaign</Button>
                  )}
                  {c.status === "ongoing" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(c.id, "completed")}>Mark Complete</Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
