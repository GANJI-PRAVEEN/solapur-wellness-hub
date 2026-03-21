import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Shield, User, FileText, Settings, Database, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  details: string;
  ip: string;
}

const MOCK_AUDIT: AuditEntry[] = [
  { id: "au1", timestamp: "2026-03-21 14:32:18", user: "Dr. Rajesh Patil", role: "super_admin", action: "CREATE", resource: "Alert", details: "Published new dengue alert for Ward 3-5", ip: "192.168.1.45" },
  { id: "au2", timestamp: "2026-03-21 14:15:04", user: "Priya Deshmukh", role: "admin", action: "UPDATE", resource: "Hospital Beds", details: "Updated ICU bed count at Civil Hospital: 5→3", ip: "192.168.1.32" },
  { id: "au3", timestamp: "2026-03-21 13:48:22", user: "Dr. Anand Kulkarni", role: "doctor", action: "APPROVE", resource: "Appointment", details: "Approved appointment for Amit Sharma (10:00 AM)", ip: "192.168.2.10" },
  { id: "au4", timestamp: "2026-03-21 12:30:55", user: "Sunita Jadhav", role: "field_staff", action: "CREATE", resource: "Daily Report", details: "Submitted report: 8 dengue cases in Ward 3", ip: "10.0.0.15" },
  { id: "au5", timestamp: "2026-03-21 11:20:11", user: "System", role: "system", action: "ALERT", resource: "Outbreak AI", details: "Auto-generated critical alert: Dengue threshold exceeded in Ward 4", ip: "127.0.0.1" },
  { id: "au6", timestamp: "2026-03-21 10:45:33", user: "Priya Deshmukh", role: "admin", action: "UPDATE", resource: "Medicine Stock", details: "Updated Paracetamol 500mg stock: +500 tablets", ip: "192.168.1.32" },
  { id: "au7", timestamp: "2026-03-21 09:15:07", user: "Vijay Kale", role: "field_staff", action: "CREATE", resource: "Daily Report", details: "Submitted report: 3 gastroenteritis cases in Ward 8", ip: "10.0.0.22" },
  { id: "au8", timestamp: "2026-03-20 18:30:44", user: "Dr. Rajesh Patil", role: "super_admin", action: "CREATE", resource: "Campaign", details: "Created Pulse Polio Immunization Drive", ip: "192.168.1.45" },
  { id: "au9", timestamp: "2026-03-20 16:12:30", user: "Meena Gaikwad", role: "viewer", action: "EXPORT", resource: "Reports", details: "Exported CSV: All daily reports (March 2026)", ip: "192.168.3.8" },
  { id: "au10", timestamp: "2026-03-20 14:55:19", user: "Amit Sharma", role: "citizen", action: "CREATE", resource: "Appointment", details: "Booked appointment with Dr. Kulkarni for fever", ip: "49.36.128.100" },
  { id: "au11", timestamp: "2026-03-20 11:30:00", user: "System", role: "system", action: "CRON", resource: "Notifications", details: "Sent 245 vaccination reminders for Pulse Polio drive", ip: "127.0.0.1" },
  { id: "au12", timestamp: "2026-03-20 09:00:15", user: "Dr. Meena Patil", role: "doctor", action: "REJECT", resource: "Appointment", details: "Rejected appointment: schedule conflict on Mar 20", ip: "192.168.2.15" },
];

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-success/10 text-success",
  UPDATE: "bg-info/10 text-info",
  DELETE: "bg-destructive/10 text-destructive",
  APPROVE: "bg-success/10 text-success",
  REJECT: "bg-destructive/10 text-destructive",
  EXPORT: "bg-primary/10 text-primary",
  ALERT: "bg-warning/10 text-warning",
  CRON: "bg-muted text-muted-foreground",
};

const ACTION_ICONS: Record<string, typeof Shield> = {
  CREATE: FileText,
  UPDATE: Database,
  DELETE: Settings,
  APPROVE: Shield,
  REJECT: Shield,
  EXPORT: FileText,
  ALERT: Shield,
  CRON: Clock,
};

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filtered = MOCK_AUDIT.filter(e =>
    e.user.toLowerCase().includes(search.toLowerCase()) ||
    e.action.toLowerCase().includes(search.toLowerCase()) ||
    e.details.toLowerCase().includes(search.toLowerCase()) ||
    e.resource.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const header = "Timestamp,User,Role,Action,Resource,Details,IP\n";
    const rows = MOCK_AUDIT.map(e => `${e.timestamp},${e.user},${e.role},${e.action},${e.resource},"${e.details}",${e.ip}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "audit-log.csv";
    a.click();
    toast({ title: "Audit log exported" });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-in-up">
        <div>
          <h1 className="text-xl font-bold text-foreground">Audit Log</h1>
          <p className="text-sm text-muted-foreground">Complete activity trail for compliance and accountability</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
      </div>

      <div className="relative mb-5 animate-in-up">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by user, action, or details..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="space-y-2 animate-in-up">
        {filtered.map(entry => {
          const Icon = ACTION_ICONS[entry.action] || FileText;
          const colorClass = ACTION_COLORS[entry.action] || "bg-muted text-muted-foreground";
          return (
            <div key={entry.id} className="rounded-xl bg-card border p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`h-8 w-8 rounded-lg ${colorClass} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{entry.user}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{entry.role}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${colorClass}`}>{entry.action}</span>
                    <span className="text-xs text-muted-foreground">on <span className="font-medium text-foreground">{entry.resource}</span></span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{entry.details}</p>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="tabular-nums">{entry.timestamp}</span>
                    <span>IP: {entry.ip}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-muted-foreground animate-in-up">
        Showing {filtered.length} of {MOCK_AUDIT.length} entries • Logs retained for 365 days per SMC policy
      </div>
    </div>
  );
}
