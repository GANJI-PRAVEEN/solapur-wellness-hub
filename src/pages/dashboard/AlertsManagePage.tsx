import { useState } from "react";
import { SAFETY_ALERTS, WARDS } from "@/lib/mock-data";
import type { SafetyAlert } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Plus, Trash2, Bell, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AlertsManagePage() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>(SAFETY_ALERTS);
  const [showAdd, setShowAdd] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "", description: "", severity: "medium" as SafetyAlert["severity"],
    wards: [] as string[], precautions: "",
  });

  const handleAdd = () => {
    const newAlert: SafetyAlert = {
      id: `a_${Date.now()}`, title: form.title, description: form.description,
      severity: form.severity, wards: form.wards, date: new Date().toISOString().split("T")[0],
      precautions: form.precautions.split("\n").filter(Boolean),
    };
    setAlerts(prev => [newAlert, ...prev]);
    setShowAdd(false);
    setForm({ title: "", description: "", severity: "medium", wards: [], precautions: "" });
    toast({ title: "Alert published", description: "Citizens in affected wards will be notified." });
  };

  const handleDelete = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast({ title: "Alert removed", variant: "destructive" });
  };

  const toggleWard = (w: string) => {
    setForm(prev => ({
      ...prev,
      wards: prev.wards.includes(w) ? prev.wards.filter(x => x !== w) : [...prev.wards, w],
    }));
  };

  const SEVERITY_ICON = { high: AlertTriangle, medium: Shield, low: Info };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-in-up">
        <div>
          <h1 className="text-xl font-bold text-foreground">Alert Management</h1>
          <p className="text-sm text-muted-foreground">Create and manage public health alerts & advisories</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />New Alert</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Health Alert</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2 max-h-[60vh] overflow-y-auto pr-1">
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Dengue outbreak in Ward 3" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
              <div><Label>Severity</Label>
                <Select value={form.severity} onValueChange={v => setForm(p => ({ ...p, severity: v as SafetyAlert["severity"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">🔴 High</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="low">🔵 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Affected Wards</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {WARDS.map(w => (
                    <button key={w} onClick={() => toggleWard(w)}
                      className={`text-xs px-2 py-1 rounded-full border transition-colors ${form.wards.includes(w) ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                      {w.split(" - ")[0]}
                    </button>
                  ))}
                </div>
              </div>
              <div><Label>Precautions (one per line)</Label><Textarea value={form.precautions} onChange={e => setForm(p => ({ ...p, precautions: e.target.value }))} rows={4} placeholder="Use mosquito nets\nRemove stagnant water\n..." /></div>
              <Button onClick={handleAdd} disabled={!form.title || form.wards.length === 0} className="w-full">Publish Alert</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => {
          const Icon = SEVERITY_ICON[alert.severity];
          const colors = {
            high: "bg-destructive/5 border-destructive/20",
            medium: "bg-warning/5 border-warning/20",
            low: "bg-info/5 border-info/20",
          }[alert.severity];

          return (
            <div key={alert.id} className={`rounded-xl border ${colors} p-5 animate-in-up`}>
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${alert.severity === "high" ? "text-destructive" : alert.severity === "medium" ? "text-warning" : "text-info"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{alert.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      alert.severity === "high" ? "bg-destructive/10 text-destructive" :
                      alert.severity === "medium" ? "bg-warning/10 text-warning" :
                      "bg-info/10 text-info"
                    }`}>{alert.severity}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {alert.wards.map(w => <span key={w} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{w.split(" - ")[0]}</span>)}
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.date} • {alert.precautions.length} precautions listed</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(alert.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
