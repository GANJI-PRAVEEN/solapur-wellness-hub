import { useState } from "react";
import { HOSPITALS } from "@/lib/mock-data";
import type { Hospital } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Minus, Plus, CheckCircle, XCircle, Activity, BedDouble } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function HospitalsManagePage() {
  const [hospitals, setHospitals] = useState<Hospital[]>(JSON.parse(JSON.stringify(HOSPITALS)));
  const { toast } = useToast();

  const updateBed = (hId: string, bedType: string, delta: number) => {
    setHospitals(prev => prev.map(h => {
      if (h.id !== hId) return h;
      return {
        ...h,
        beds: h.beds.map(b => {
          if (b.type !== bedType) return b;
          const newAvail = Math.max(0, Math.min(b.total, b.available + delta));
          return { ...b, available: newAvail };
        }),
      };
    }));
    toast({ title: "Bed count updated" });
  };

  const toggleMachinery = (hId: string, machineName: string) => {
    setHospitals(prev => prev.map(h => {
      if (h.id !== hId) return h;
      return {
        ...h,
        machinery: h.machinery.map(m => m.name === machineName ? { ...m, available: !m.available } : m),
      };
    }));
  };

  const totalBeds = hospitals.reduce((s, h) => s + h.beds.reduce((bs, b) => bs + b.total, 0), 0);
  const availBeds = hospitals.reduce((s, h) => s + h.beds.reduce((bs, b) => bs + b.available, 0), 0);

  return (
    <div>
      <div className="mb-6 animate-in-up">
        <h1 className="text-xl font-bold text-foreground">Hospitals & Bed Management</h1>
        <p className="text-sm text-muted-foreground">Real-time bed and machinery status updates</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-in-up">
        <div className="rounded-xl bg-card border p-4">
          <p className="text-2xl font-bold text-foreground tabular-nums">{hospitals.length}</p>
          <p className="text-xs text-muted-foreground">Hospitals</p>
        </div>
        <div className="rounded-xl bg-card border p-4">
          <p className="text-2xl font-bold text-foreground tabular-nums">{totalBeds}</p>
          <p className="text-xs text-muted-foreground">Total Beds</p>
        </div>
        <div className="rounded-xl bg-success/5 border border-success/15 p-4">
          <p className="text-2xl font-bold text-success tabular-nums">{availBeds}</p>
          <p className="text-xs text-muted-foreground">Available Now</p>
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="space-y-5">
        {hospitals.map(h => (
          <div key={h.id} className="rounded-xl bg-card border p-5 animate-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{h.name}</h3>
                <p className="text-xs text-muted-foreground">{h.ward}</p>
              </div>
            </div>

            {/* Beds */}
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5" /> Bed Availability
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {h.beds.map(b => {
                const pct = Math.round((b.available / b.total) * 100);
                return (
                  <div key={b.type} className="rounded-lg bg-muted/50 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{b.type}</span>
                      <span className={`text-xs font-bold tabular-nums ${pct < 20 ? "text-destructive" : pct < 50 ? "text-warning" : "text-success"}`}>
                        {b.available}/{b.total}
                      </span>
                    </div>
                    <Progress value={pct} className="h-1.5 mb-2" />
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateBed(h.id, b.type, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs text-muted-foreground flex-1 text-center">Adjust</span>
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateBed(h.id, b.type, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Machinery */}
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" /> Machinery Status
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {h.machinery.map(m => (
                <button key={m.name} onClick={() => toggleMachinery(h.id, m.name)}
                  className={`flex items-center gap-3 rounded-lg p-3 text-left transition-colors ${m.available ? "bg-success/5 border border-success/15 hover:bg-success/10" : "bg-destructive/5 border border-destructive/15 hover:bg-destructive/10"}`}>
                  {m.available ? <CheckCircle className="h-4 w-4 text-success shrink-0" /> : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.available ? "Available" : "Unavailable"}{m.waitTime ? ` • Wait: ${m.waitTime}` : ""}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
