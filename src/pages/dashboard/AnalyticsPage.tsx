import { DAILY_REPORTS, WARDS, HOSPITALS } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { BarChart3, TrendingUp, MapPin, Activity, Map } from "lucide-react";
import SolapurMap from "@/components/SolapurMap";

const CHART_COLORS = [
  "hsl(210 78% 38%)", "hsl(152 48% 42%)", "hsl(38 92% 50%)",
  "hsl(0 72% 51%)", "hsl(200 80% 50%)", "hsl(270 60% 55%)",
  "hsl(330 65% 50%)", "hsl(180 50% 40%)"
];

export default function AnalyticsPage() {
  // Disease breakdown
  const diseaseMap = DAILY_REPORTS.reduce<Record<string, number>>((acc, r) => {
    acc[r.disease] = (acc[r.disease] || 0) + r.cases;
    return acc;
  }, {});
  const diseaseData = Object.entries(diseaseMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Ward-wise cases
  const wardMap = DAILY_REPORTS.reduce<Record<string, number>>((acc, r) => {
    const short = r.ward.split(" - ")[0];
    acc[short] = (acc[short] || 0) + r.cases;
    return acc;
  }, {});
  const wardData = Object.entries(wardMap).map(([ward, cases]) => ({ ward, cases })).sort((a, b) => b.cases - a.cases);

  // Daily trend (aggregate by date)
  const dateMap = DAILY_REPORTS.reduce<Record<string, { cases: number; deaths: number; recovered: number }>>((acc, r) => {
    if (!acc[r.date]) acc[r.date] = { cases: 0, deaths: 0, recovered: 0 };
    acc[r.date].cases += r.cases;
    acc[r.date].deaths += r.deaths;
    acc[r.date].recovered += r.recovered;
    return acc;
  }, {});
  const trendData = Object.entries(dateMap).sort((a, b) => a[0].localeCompare(b[0])).map(([date, d]) => ({ date: date.slice(5), ...d }));

  // Bed occupancy
  const bedData = HOSPITALS.map(h => ({
    name: h.name.replace("SMC ", "").replace("Hospital", "Hosp."),
    occupied: h.beds.reduce((s, b) => s + (b.total - b.available), 0),
    available: h.beds.reduce((s, b) => s + b.available, 0),
  }));

  return (
    <div>
      <div className="mb-6 animate-in-up">
        <h1 className="text-xl font-bold text-foreground">Health Analytics</h1>
        <p className="text-sm text-muted-foreground">Visual trends and analytics across Solapur wards</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Disease Pie Chart */}
        <div className="rounded-xl bg-card border p-5 animate-in-up">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Disease Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={diseaseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {diseaseData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ward-wise Cases Bar */}
        <div className="rounded-xl bg-card border p-5 animate-in-up">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-secondary" /> Cases by Ward
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={wardData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="ward" width={60} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="cases" fill="hsl(210 78% 38%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Trend Area Chart */}
        <div className="rounded-xl bg-card border p-5 lg:col-span-2 animate-in-up">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-warning" /> Daily Case Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 18% 88%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="cases" stroke="hsl(38 92% 50%)" fill="hsl(38 92% 50% / 0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="recovered" stroke="hsl(152 48% 42%)" fill="hsl(152 48% 42% / 0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="deaths" stroke="hsl(0 72% 51%)" fill="hsl(0 72% 51% / 0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bed Occupancy */}
        <div className="rounded-xl bg-card border p-5 lg:col-span-2 animate-in-up">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-info" /> Hospital Bed Occupancy
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bedData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="occupied" stackId="a" fill="hsl(0 72% 51%)" radius={[0, 0, 0, 0]} name="Occupied" />
              <Bar dataKey="available" stackId="a" fill="hsl(152 48% 42%)" radius={[4, 4, 0, 0]} name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
