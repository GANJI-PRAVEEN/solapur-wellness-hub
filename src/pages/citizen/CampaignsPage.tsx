import { useState } from "react";
import { PublicNav } from "@/components/PublicNav";
import { Button } from "@/components/ui/button";
import { CAMPAIGNS } from "@/lib/mock-data";
import { CalendarCheck, MapPin, Users, CheckCircle, Clock, Filter } from "lucide-react";

export default function CampaignsPage() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");
  const [registered, setRegistered] = useState<Set<string>>(new Set());

  const filtered = CAMPAIGNS.filter(c => filter === "all" || c.status === filter);

  const toggleRegister = (id: string) => {
    setRegistered(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="container py-6">
        <h1 className="text-xl font-bold text-foreground mb-1 animate-in-up">Health Campaigns & Vaccination Drives</h1>
        <p className="text-sm text-muted-foreground mb-6 animate-in-up">Register for free health programs near you</p>

        <div className="flex gap-2 mb-6 overflow-x-auto animate-in-up">
          {(["all", "upcoming", "ongoing", "completed"] as const).map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
              {f === "all" && <Filter className="h-3.5 w-3.5 mr-1" />}
              {f}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((c, i) => (
            <div key={c.id} className={`card-hover rounded-xl bg-card border p-5 animate-in-up animate-in-up-delay-${i % 4}`}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      c.status === "ongoing" ? "bg-success/10 text-success" :
                      c.status === "upcoming" ? "bg-info/10 text-info" :
                      "bg-muted text-muted-foreground"
                    }`}>{c.status}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c.type}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarCheck className="h-3 w-3" />{c.date} • {c.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.location}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{c.registrations}/{c.capacity} registered</span>
                  </div>
                  <p className="text-xs mt-2"><span className="font-medium text-foreground">Eligibility:</span> {c.eligibility}</p>
                </div>
                <div className="shrink-0">
                  {c.status !== "completed" ? (
                    registered.has(c.id) ? (
                      <Button variant="outline" size="sm" onClick={() => toggleRegister(c.id)} className="text-success border-success/30">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Registered
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => toggleRegister(c.id)}>Register Now</Button>
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Completed</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
