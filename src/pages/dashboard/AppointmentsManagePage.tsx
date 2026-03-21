import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CheckCircle, XCircle, Clock, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "rejected" | "completed";
  ward: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "ap1", patientName: "Amit Sharma", patientPhone: "9876543210", doctor: "Dr. Anand Kulkarni", specialty: "General Medicine", date: "2026-03-22", time: "10:00", status: "pending", ward: "Ward 5" },
  { id: "ap2", patientName: "Sunita Devi", patientPhone: "9876543211", doctor: "Dr. Meena Patil", specialty: "Pediatrics", date: "2026-03-22", time: "11:00", status: "pending", ward: "Ward 3" },
  { id: "ap3", patientName: "Ramesh Joshi", patientPhone: "9876543212", doctor: "Dr. Avinash Gaikwad", specialty: "Cardiology", date: "2026-03-21", time: "09:00", status: "approved", ward: "Ward 1" },
  { id: "ap4", patientName: "Lakshmi Pawar", patientPhone: "9876543213", doctor: "Dr. Sunita Deshpande", specialty: "Gynecology", date: "2026-03-21", time: "15:00", status: "completed", ward: "Ward 5" },
  { id: "ap5", patientName: "Vijay Kale", patientPhone: "9876543214", doctor: "Dr. Suresh Jagtap", specialty: "Orthopedics", date: "2026-03-23", time: "14:00", status: "pending", ward: "Ward 8" },
  { id: "ap6", patientName: "Meena Gaikwad", patientPhone: "9876543215", doctor: "Dr. Kavita Mane", specialty: "ENT", date: "2026-03-20", time: "10:00", status: "rejected", ward: "Ward 9" },
  { id: "ap7", patientName: "Pradeep Sonawane", patientPhone: "9876543216", doctor: "Dr. Priya Ingale", specialty: "General Medicine", date: "2026-03-23", time: "09:00", status: "pending", ward: "Ward 4" },
];

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-warning/10", text: "text-warning" },
  approved: { bg: "bg-success/10", text: "text-success" },
  rejected: { bg: "bg-destructive/10", text: "text-destructive" },
  completed: { bg: "bg-muted", text: "text-muted-foreground" },
};

export default function AppointmentsManagePage() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  const updateStatus = (id: string, status: Appointment["status"]) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast({ title: `Appointment ${status}`, description: status === "approved" ? "Patient will be notified." : undefined });
  };

  const filtered = appointments.filter(a => {
    if (filter !== "all" && a.status !== filter) return false;
    if (search && !a.patientName.toLowerCase().includes(search.toLowerCase()) && !a.doctor.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pending = appointments.filter(a => a.status === "pending").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-in-up">
        <div>
          <h1 className="text-xl font-bold text-foreground">Appointment Management</h1>
          <p className="text-sm text-muted-foreground">Review and approve citizen appointment requests</p>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium">
            <Clock className="h-3.5 w-3.5" /> {pending} pending
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5 animate-in-up">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search patient or doctor..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected", "completed"].map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(apt => {
          const ss = STATUS_STYLES[apt.status];
          return (
            <div key={apt.id} className="rounded-xl bg-card border p-5 card-hover animate-in-up">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{apt.patientName}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ss.bg} ${ss.text} font-medium capitalize`}>{apt.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>Doctor: <span className="text-foreground font-medium">{apt.doctor}</span></span>
                    <span>{apt.specialty}</span>
                    <span className="tabular-nums">{apt.date} at {apt.time}</span>
                    <span>{apt.ward}</span>
                    <span>📞 {apt.patientPhone}</span>
                  </div>
                </div>
                {apt.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => updateStatus(apt.id, "approved")} className="bg-success hover:bg-success/90 text-success-foreground">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "rejected")} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No appointments found</div>
        )}
      </div>
    </div>
  );
}
