import { useState } from "react";
import { PublicNav } from "@/components/PublicNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DOCTORS, SPECIALTIES, WARDS } from "@/lib/mock-data";
import { Search, Star, Clock, MapPin, CalendarCheck, CheckCircle } from "lucide-react";

export default function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [ward, setWard] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [booked, setBooked] = useState(false);

  const filtered = DOCTORS.filter(d => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.specialty.toLowerCase().includes(search.toLowerCase())) return false;
    if (specialty !== "all" && d.specialty !== specialty) return false;
    if (ward !== "all" && d.ward !== ward) return false;
    return true;
  });

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="container py-6">
        <h1 className="text-xl font-bold text-foreground mb-1 animate-in-up">Book Appointment</h1>
        <p className="text-sm text-muted-foreground mb-6 animate-in-up">Find doctors by specialty, ward, or name</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-in-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by doctor name, symptom, disease..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Specialty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {SPECIALTIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={ward} onValueChange={setWard}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Ward" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards</SelectItem>
              {WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Success Banner */}
        {booked && (
          <div className="mb-4 rounded-lg bg-success/10 border border-success/20 p-4 flex items-center gap-3 animate-in-up">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Appointment Booked Successfully!</p>
              <p className="text-xs text-muted-foreground">You will receive a confirmation notification shortly.</p>
            </div>
          </div>
        )}

        {/* Doctor Cards */}
        <div className="space-y-3">
          {filtered.map((doc, i) => (
            <div key={doc.id} className={`card-hover rounded-xl bg-card border p-4 md:p-5 animate-in-up animate-in-up-delay-${i % 4}`}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{doc.name}</h3>
                    {!doc.available && <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">Unavailable</span>}
                  </div>
                  <p className="text-sm text-primary font-medium">{doc.specialty}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{doc.hospital}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning" />{doc.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{doc.experience} yrs exp</span>
                  </div>
                </div>

                {doc.available && (
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    {selectedDoctor === doc.id ? (
                      <>
                        <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="text-sm" />
                        <div className="flex flex-wrap gap-1.5">
                          {doc.slots.map(s => (
                            <button
                              key={s}
                              onClick={() => setSelectedSlot(s)}
                              className={`px-2 py-1 text-xs rounded-md border transition-colors ${selectedSlot === s ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleBook} disabled={!selectedSlot || !selectedDate} className="flex-1">
                            <CalendarCheck className="h-3.5 w-3.5 mr-1" /> Confirm
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setSelectedDoctor(null); setSelectedSlot(null); }}>Cancel</Button>
                        </div>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setSelectedDoctor(doc.id)}>
                        Book Slot
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-medium">No doctors found</p>
              <p className="text-sm mt-1">Try changing your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
