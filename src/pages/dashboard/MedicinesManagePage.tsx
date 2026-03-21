import { useState } from "react";
import { MEDICINES } from "@/lib/mock-data";
import type { Medicine } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pill, Search, Plus, Edit, AlertTriangle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MedicinesManagePage() {
  const [medicines, setMedicines] = useState<Medicine[]>(MEDICINES);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [stockUpdate, setStockUpdate] = useState<number>(0);
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", dispensary: "", ward: "Ward 1", stock: 500, unit: "tablets" });

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  const lowStock = medicines.filter(m => m.stock < 200);

  const handleAdd = () => {
    setMedicines(prev => [...prev, { id: `m_${Date.now()}`, ...form }]);
    setShowAdd(false);
    setForm({ name: "", dispensary: "", ward: "Ward 1", stock: 500, unit: "tablets" });
    toast({ title: "Medicine added" });
  };

  const updateStock = (id: string) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, stock: Math.max(0, m.stock + stockUpdate) } : m));
    setEditId(null);
    setStockUpdate(0);
    toast({ title: "Stock updated" });
  };

  const exportCSV = () => {
    const header = "Name,Dispensary,Ward,Stock,Unit\n";
    const rows = medicines.map(m => `${m.name},${m.dispensary},${m.ward},${m.stock},${m.unit}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "medicine-stock.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-in-up">
        <div>
          <h1 className="text-xl font-bold text-foreground">Medicine Stock Management</h1>
          <p className="text-sm text-muted-foreground">Track and update medicine inventory across dispensaries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Add Medicine</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Medicine</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div><Label>Dispensary</Label><Input value={form.dispensary} onChange={e => setForm(p => ({ ...p, dispensary: e.target.value }))} /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Ward</Label><Input value={form.ward} onChange={e => setForm(p => ({ ...p, ward: e.target.value }))} /></div>
                  <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: +e.target.value }))} /></div>
                  <div><Label>Unit</Label><Input value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} /></div>
                </div>
                <Button onClick={handleAdd} disabled={!form.name} className="w-full">Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 mb-5 animate-in-up">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm font-semibold text-warning">{lowStock.length} medicines running low</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(m => (
              <span key={m.id} className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning">{m.name} ({m.stock})</span>
            ))}
          </div>
        </div>
      )}

      <div className="relative mb-5 animate-in-up">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search medicine..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="rounded-xl bg-card border overflow-hidden animate-in-up">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Medicine</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Dispensary</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Ward</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Stock</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Pill className="h-3.5 w-3.5 text-secondary" />
                    <span className="font-medium">{m.name}</span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{m.dispensary}</td>
                <td className="p-3 text-muted-foreground">{m.ward}</td>
                <td className="p-3 text-right">
                  {editId === m.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <Input type="number" value={stockUpdate} onChange={e => setStockUpdate(+e.target.value)} className="w-20 h-7 text-right" placeholder="+/-" />
                      <Button size="sm" variant="outline" className="h-7" onClick={() => updateStock(m.id)}>Update</Button>
                    </div>
                  ) : (
                    <span className={`font-semibold tabular-nums ${m.stock < 200 ? "text-destructive" : "text-success"}`}>
                      {m.stock.toLocaleString()} {m.unit}
                    </span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditId(editId === m.id ? null : m.id); setStockUpdate(0); }}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
