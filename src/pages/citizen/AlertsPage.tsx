import { PublicNav } from "@/components/PublicNav";
import { useAuth } from "@/lib/auth";
import { SAFETY_ALERTS } from "@/lib/mock-data";
import { Shield, AlertTriangle, Info, ChevronDown } from "lucide-react";
import { useState } from "react";

const SEVERITY_STYLES = {
  high: { bg: "bg-destructive/5 border-destructive/20", icon: "text-destructive", badge: "bg-destructive/10 text-destructive" },
  medium: { bg: "bg-warning/5 border-warning/20", icon: "text-warning", badge: "bg-warning/10 text-warning" },
  low: { bg: "bg-info/5 border-info/20", icon: "text-info", badge: "bg-info/10 text-info" },
};

export default function AlertsPage() {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState<Set<string>>(new Set([SAFETY_ALERTS[0]?.id]));

  const toggle = (id: string) => setExpanded(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  // Show user-ward alerts first
  const sorted = [...SAFETY_ALERTS].sort((a, b) => {
    const aLocal = user?.ward && a.wards.some(w => w.includes(user.ward!.split(" - ")[0]));
    const bLocal = user?.ward && b.wards.some(w => w.includes(user.ward!.split(" - ")[0]));
    if (aLocal && !bLocal) return -1;
    if (!aLocal && bLocal) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="container py-6">
        <h1 className="text-xl font-bold text-foreground mb-1 animate-in-up">Safety Alerts</h1>
        <p className="text-sm text-muted-foreground mb-6 animate-in-up">Health alerts and advisories for Solapur</p>

        <div className="space-y-3">
          {sorted.map((alert, i) => {
            const s = SEVERITY_STYLES[alert.severity];
            const isExpanded = expanded.has(alert.id);
            const isLocal = user?.ward && alert.wards.some(w => w.includes(user.ward!.split(" - ")[0]));

            return (
              <div key={alert.id} className={`rounded-xl border ${s.bg} p-5 animate-in-up animate-in-up-delay-${i % 4}`}>
                <button className="w-full text-left" onClick={() => toggle(alert.id)}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {alert.severity === "high" ? <AlertTriangle className={`h-5 w-5 ${s.icon}`} /> :
                       alert.severity === "medium" ? <Shield className={`h-5 w-5 ${s.icon}`} /> :
                       <Info className={`h-5 w-5 ${s.icon}`} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.badge}`}>{alert.severity}</span>
                        {isLocal && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Your Area</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Affected: {alert.wards.join(", ")} • {alert.date}</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-4 ml-8 space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Precautions:</h4>
                    <ul className="space-y-1.5">
                      {alert.precautions.map((p, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
