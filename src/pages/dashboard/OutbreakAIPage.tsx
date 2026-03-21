import { useState } from "react";
import { DAILY_REPORTS, WARDS } from "@/lib/mock-data";
import { AlertTriangle, Brain, TrendingUp, Shield, MapPin, Map } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SolapurMap from "@/components/SolapurMap";

const THRESHOLDS: Record<string, number> = {
  Dengue: 15, Malaria: 12, Typhoid: 10, Gastroenteritis: 18,
  "COVID-19": 20, Tuberculosis: 8, Chikungunya: 10, Influenza: 15,
};

interface Prediction {
  disease: string;
  ward: string;
  currentCases: number;
  threshold: number;
  riskLevel: "critical" | "high" | "moderate" | "low";
  prediction: string;
  trend: { day: string; cases: number }[];
}

function generatePredictions(): Prediction[] {
  const wardDisease: Record<string, Record<string, number>> = {};
  DAILY_REPORTS.forEach(r => {
    const w = r.ward.split(" - ")[0];
    if (!wardDisease[w]) wardDisease[w] = {};
    wardDisease[w][r.disease] = (wardDisease[w][r.disease] || 0) + r.cases;
  });

  const predictions: Prediction[] = [];
  Object.entries(wardDisease).forEach(([ward, diseases]) => {
    Object.entries(diseases).forEach(([disease, cases]) => {
      const threshold = THRESHOLDS[disease] || 10;
      const ratio = cases / threshold;
      let riskLevel: Prediction["riskLevel"] = "low";
      let prediction = "Stable. No immediate concern.";
      if (ratio > 2.5) { riskLevel = "critical"; prediction = `CRITICAL: ${cases} cases exceed threshold by ${Math.round((ratio - 1) * 100)}%. Immediate intervention needed.`; }
      else if (ratio > 1.5) { riskLevel = "high"; prediction = `HIGH RISK: Trending above safe levels. Deploy field teams for containment.`; }
      else if (ratio > 0.8) { riskLevel = "moderate"; prediction = `MODERATE: Approaching threshold. Increase surveillance in this ward.`; }

      const trend = Array.from({ length: 7 }, (_, i) => ({
        day: `Day ${i + 1}`,
        cases: Math.max(0, Math.round(cases / 5 + (Math.random() - 0.3) * (cases / 4))),
      }));

      predictions.push({ disease, ward, currentCases: cases, threshold, riskLevel, prediction, trend });
    });
  });

  return predictions.sort((a, b) => {
    const order = { critical: 0, high: 1, moderate: 2, low: 3 };
    return order[a.riskLevel] - order[b.riskLevel];
  });
}

const RISK_STYLES = {
  critical: { bg: "bg-destructive/5 border-destructive/20", badge: "bg-destructive text-destructive-foreground", dot: "bg-destructive" },
  high: { bg: "bg-warning/5 border-warning/20", badge: "bg-warning text-warning-foreground", dot: "bg-warning" },
  moderate: { bg: "bg-info/5 border-info/20", badge: "bg-info text-info-foreground", dot: "bg-info" },
  low: { bg: "bg-muted/50 border-border", badge: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
};

export default function OutbreakAIPage() {
  const predictions = generatePredictions();
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  const filtered = predictions.filter(p => riskFilter === "all" || p.riskLevel === riskFilter);
  const criticalCount = predictions.filter(p => p.riskLevel === "critical").length;
  const highCount = predictions.filter(p => p.riskLevel === "high").length;

  // Ward risk map data
  const wardRisk: Record<string, string> = {};
  predictions.forEach(p => {
    const current = wardRisk[p.ward];
    const order = { critical: 0, high: 1, moderate: 2, low: 3 };
    if (!current || order[p.riskLevel] < order[current as keyof typeof order]) {
      wardRisk[p.ward] = p.riskLevel;
    }
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-in-up">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> AI Outbreak Prediction
          </h1>
          <p className="text-sm text-muted-foreground">Disease threshold analysis with AI-powered risk assessment</p>
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Risk Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risks</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-in-up">
        <div className="rounded-xl bg-destructive/5 border border-destructive/15 p-4">
          <p className="text-2xl font-bold text-destructive tabular-nums">{criticalCount}</p>
          <p className="text-xs text-muted-foreground">Critical Alerts</p>
        </div>
        <div className="rounded-xl bg-warning/5 border border-warning/15 p-4">
          <p className="text-2xl font-bold text-warning tabular-nums">{highCount}</p>
          <p className="text-xs text-muted-foreground">High Risk</p>
        </div>
        <div className="rounded-xl bg-card border p-4">
          <p className="text-2xl font-bold text-foreground tabular-nums">{Object.keys(THRESHOLDS).length}</p>
          <p className="text-xs text-muted-foreground">Diseases Tracked</p>
        </div>
        <div className="rounded-xl bg-card border p-4">
          <p className="text-2xl font-bold text-foreground tabular-nums">{WARDS.length}</p>
          <p className="text-xs text-muted-foreground">Wards Monitored</p>
        </div>
      </div>

      {/* Ward Risk Map */}
      <div className="rounded-xl bg-card border p-5 mb-6 animate-in-up">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> Ward Risk Heatmap
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {WARDS.map((w, i) => {
            const short = w.split(" - ")[0];
            const risk = wardRisk[short] || "low";
            const rs = RISK_STYLES[risk as keyof typeof RISK_STYLES];
            return (
              <div key={w} className={`rounded-lg border ${rs.bg} p-3 text-center cursor-default`}>
                <div className={`h-2 w-2 rounded-full ${rs.dot} mx-auto mb-1.5`} />
                <p className="text-xs font-semibold text-foreground">{short}</p>
                <p className="text-[10px] text-muted-foreground truncate">{w.split(" - ")[1]}</p>
                <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full ${rs.badge}`}>{risk}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" />Critical</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" />High</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-info" />Moderate</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground" />Low</span>
        </div>
      </div>

      {/* Prediction Detail Modal */}
      {selectedPrediction && (
        <div className="rounded-xl bg-card border p-5 mb-6 animate-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">{selectedPrediction.disease} — {selectedPrediction.ward}</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedPrediction(null)}>Close</Button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={selectedPrediction.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 18% 88%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <ReferenceLine y={selectedPrediction.threshold} stroke="hsl(0 72% 51%)" strokeDasharray="5 5" label={{ value: "Threshold", fontSize: 11 }} />
              <Line type="monotone" dataKey="cases" stroke="hsl(210 78% 38%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Predictions List */}
      <div className="space-y-3">
        {filtered.map((p, i) => {
          const rs = RISK_STYLES[p.riskLevel];
          return (
            <div key={`${p.ward}-${p.disease}`} className={`rounded-xl border ${rs.bg} p-5 cursor-pointer hover:shadow-md transition-shadow animate-in-up`} onClick={() => setSelectedPrediction(p)}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rs.badge}`}>{p.riskLevel.toUpperCase()}</span>
                    <h4 className="font-semibold text-foreground">{p.disease}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.prediction}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span><MapPin className="h-3 w-3 inline mr-0.5" />{p.ward}</span>
                    <span>Cases: <span className="font-semibold text-foreground tabular-nums">{p.currentCases}</span></span>
                    <span>Threshold: <span className="tabular-nums">{p.threshold}</span></span>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
