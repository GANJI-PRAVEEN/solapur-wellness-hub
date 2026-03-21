import { useState } from "react";
import { DAILY_REPORTS, WARDS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Download, Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("all");
  const [diseaseFilter, setDiseaseFilter] = useState("all");
  const { toast } = useToast();

  const diseases = [...new Set(DAILY_REPORTS.map(r => r.disease))].sort();

  const filtered = DAILY_REPORTS.filter(r => {
    if (wardFilter !== "all" && r.ward !== wardFilter) return false;
    if (diseaseFilter !== "all" && r.disease !== diseaseFilter) return false;
    if (search && !r.disease.toLowerCase().includes(search.toLowerCase()) && !r.reportedBy.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const exportCSV = () => {
    const header = "Date,Ward,Disease,Cases,Deaths,Recovered,Reported By\n";
    const rows = filtered.map(r => `${r.date},${r.ward},${r.disease},${r.cases},${r.deaths},${r.recovered},${r.reportedBy}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smc-reports-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exported", description: `${filtered.length} reports exported successfully.` });
  };

  const totalCases = filtered.reduce((s, r) => s + r.cases, 0);
  const totalDeaths = filtered.reduce((s, r) => s + r.deaths, 0);
  const totalRecovered = filtered.reduce((s, r) => s + r.recovered, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-in-up">
        <div>
          <h1 className="text-xl font-bold text-foreground">Daily Health Reports</h1>
          <p className="text-sm text-muted-foreground">All field submissions from ASHA, ANM and data entry operators</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-3.5 w-3.5 mr-1.5" />Export CSV
          </Button>
          <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />New Report</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-in-up">
        <div className="rounded-xl bg-warning/5 border border-warning/15 p-4">
          <p className="text-2xl font-bold text-warning tabular-nums">{totalCases}</p>
          <p className="text-xs text-muted-foreground">Total Cases</p>
        </div>
        <div className="rounded-xl bg-destructive/5 border border-destructive/15 p-4">
          <p className="text-2xl font-bold text-destructive tabular-nums">{totalDeaths}</p>
          <p className="text-xs text-muted-foreground">Deaths</p>
        </div>
        <div className="rounded-xl bg-success/5 border border-success/15 p-4">
          <p className="text-2xl font-bold text-success tabular-nums">{totalRecovered}</p>
          <p className="text-xs text-muted-foreground">Recovered</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 animate-in-up">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search disease or reporter..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={wardFilter} onValueChange={setWardFilter}>
          <SelectTrigger className="w-full sm:w-52"><SelectValue placeholder="Ward" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            {WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Disease" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Diseases</SelectItem>
            {diseases.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border overflow-hidden animate-in-up">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Ward</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Disease</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Cases</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Deaths</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Recovered</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Reported By</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 tabular-nums">{r.date}</td>
                  <td className="p-3">{r.ward.split(" - ")[0]}</td>
                  <td className="p-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{r.disease}</span>
                  </td>
                  <td className="p-3 text-right font-semibold tabular-nums">{r.cases}</td>
                  <td className="p-3 text-right tabular-nums">{r.deaths > 0 ? <span className="text-destructive font-medium">{r.deaths}</span> : "0"}</td>
                  <td className="p-3 text-right tabular-nums text-success">{r.recovered}</td>
                  <td className="p-3 text-muted-foreground">{r.reportedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t p-3 text-xs text-muted-foreground bg-muted/30">
          Showing {filtered.length} of {DAILY_REPORTS.length} reports
        </div>
      </div>
    </div>
  );
}
