import { useState } from "react";
import { PublicNav } from "@/components/PublicNav";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HOSPITALS, MEDICINES } from "@/lib/mock-data";
import { Building2, Search, Pill, Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ResourcesPage() {
  const [medSearch, setMedSearch] = useState("");

  const filteredMeds = MEDICINES.filter(m =>
    m.name.toLowerCase().includes(medSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="container py-6">
        <h1 className="text-xl font-bold text-foreground mb-1 animate-in-up">Hospital Resources</h1>
        <p className="text-sm text-muted-foreground mb-6 animate-in-up">Real-time availability across SMC hospitals</p>

        <Tabs defaultValue="beds" className="animate-in-up">
          <TabsList className="mb-4">
            <TabsTrigger value="beds"><Building2 className="h-3.5 w-3.5 mr-1.5" />Beds</TabsTrigger>
            <TabsTrigger value="machinery"><Activity className="h-3.5 w-3.5 mr-1.5" />Machinery</TabsTrigger>
            <TabsTrigger value="medicines"><Pill className="h-3.5 w-3.5 mr-1.5" />Medicines</TabsTrigger>
          </TabsList>

          <TabsContent value="beds" className="space-y-4">
            {HOSPITALS.map(h => (
              <div key={h.id} className="card-hover rounded-xl bg-card border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground">{h.name}</h3>
                  <span className="text-xs text-muted-foreground ml-auto">{h.ward}</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {h.beds.map(b => {
                    const pct = Math.round((b.available / b.total) * 100);
                    return (
                      <div key={b.type} className="rounded-lg bg-muted/50 p-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{b.type}</span>
                          <span className={`text-xs font-semibold ${pct < 20 ? "text-destructive" : pct < 50 ? "text-warning" : "text-success"}`}>
                            {b.available}/{b.total}
                          </span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="machinery" className="space-y-4">
            {HOSPITALS.map(h => (
              <div key={h.id} className="card-hover rounded-xl bg-card border p-5">
                <h3 className="font-semibold text-foreground mb-3">{h.name}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {h.machinery.map(m => (
                    <div key={m.name} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                      {m.available ? (
                        <CheckCircle className="h-4 w-4 text-success shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        {m.waitTime && <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Wait: {m.waitTime}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="medicines">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search medicine name..." className="pl-9" value={medSearch} onChange={e => setMedSearch(e.target.value)} />
            </div>
            <div className="space-y-2">
              {filteredMeds.map(m => (
                <div key={m.id} className="card-hover flex items-center gap-4 rounded-xl bg-card border p-4">
                  <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Pill className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.dispensary}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${m.stock < 200 ? "text-destructive" : "text-success"}`}>
                      {m.stock.toLocaleString()} {m.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">{m.ward}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
