import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { DAILY_REPORTS, SAFETY_ALERTS, CAMPAIGNS, HOSPITALS, DOCTORS } from "@/lib/mock-data";
import { Activity, FileText, Building2, Users, Shield, TrendingUp, CalendarCheck, AlertTriangle } from "lucide-react";

const totalCases = DAILY_REPORTS.reduce((s, r) => s + r.cases, 0);
const totalDeaths = DAILY_REPORTS.reduce((s, r) => s + r.deaths, 0);
const activeBeds = HOSPITALS.reduce((s, h) => s + h.beds.reduce((bs, b) => bs + b.available, 0), 0);

const STATS = [
  { labelKey: "dash.stats.reports", value: DAILY_REPORTS.length, icon: FileText, color: "text-primary bg-primary/10" },
  { labelKey: "dash.stats.cases", value: totalCases, icon: TrendingUp, color: "text-warning bg-warning/10" },
  { labelKey: "dash.stats.alerts", value: SAFETY_ALERTS.filter(a => a.severity === "high").length, icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
  { labelKey: "dash.stats.doctors", value: DOCTORS.length, icon: Users, color: "text-secondary bg-secondary/10" },
  { labelKey: "dash.stats.beds", value: activeBeds, icon: Building2, color: "text-info bg-info/10" },
  { labelKey: "dash.stats.campaigns", value: CAMPAIGNS.filter(c => c.status !== "completed").length, icon: CalendarCheck, color: "text-accent bg-accent/10" },
];

export default function DashboardOverview() {
  const { user } = useAuth();
  const { t } = useI18n();

  // Disease breakdown
  const diseaseMap = DAILY_REPORTS.reduce<Record<string, number>>((acc, r) => {
    acc[r.disease] = (acc[r.disease] || 0) + r.cases;
    return acc;
  }, {});
  const topDiseases = Object.entries(diseaseMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCases = topDiseases[0]?.[1] || 1;

  return (
    <div>
      <div className="mb-6 animate-in-up">
        <h1 className="text-xl font-bold text-foreground">{t("dash.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("dash.welcome").replace("{name}", user?.name || "User")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {STATS.map((s, i) => (
          <div key={s.labelKey} className={`card-hover rounded-xl bg-card border p-4 animate-in-up animate-in-up-delay-${i % 4}`}>
            <div className={`h-8 w-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold text-foreground tabular-nums">{s.value}</p>
            <p className="text-xs text-muted-foreground">{t(s.labelKey)}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Disease Breakdown */}
        <div className="card-hover rounded-xl bg-card border p-5 animate-in-up">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            {t("dash.disease")}
          </h3>
          <div className="space-y-3">
            {topDiseases.map(([disease, cases]) => (
              <div key={disease}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{disease}</span>
                  <span className="font-medium tabular-nums">{cases} {t("dash.cases")}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full hero-gradient" style={{ width: `${(cases / maxCases) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="card-hover rounded-xl bg-card border p-5 animate-in-up">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-destructive" />
            {t("dash.activeAlerts")}
          </h3>
          <div className="space-y-3">
            {SAFETY_ALERTS.map(alert => (
              <div key={alert.id} className={`rounded-lg p-3 ${alert.severity === "high" ? "bg-destructive/5 border border-destructive/10" :
                  alert.severity === "medium" ? "bg-warning/5 border border-warning/10" :
                    "bg-info/5 border border-info/10"
                }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${alert.severity === "high" ? "bg-destructive/10 text-destructive" :
                      alert.severity === "medium" ? "bg-warning/10 text-warning" :
                        "bg-info/10 text-info"
                    }`}>{alert.severity}</span>
                  <span className="text-xs text-muted-foreground">{alert.date}</span>
                </div>
                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.wards.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="card-hover rounded-xl bg-card border p-5 lg:col-span-2 animate-in-up">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            {t("dash.recent")}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium text-muted-foreground">{t("dash.col.date")}</th>
                  <th className="pb-2 font-medium text-muted-foreground">{t("dash.col.ward")}</th>
                  <th className="pb-2 font-medium text-muted-foreground">{t("dash.col.disease")}</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">{t("dash.col.cases")}</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">{t("dash.col.deaths")}</th>
                  <th className="pb-2 font-medium text-muted-foreground">{t("dash.col.reportedBy")}</th>
                </tr>
              </thead>
              <tbody>
                {DAILY_REPORTS.slice(0, 10).map(r => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2 tabular-nums">{r.date}</td>
                    <td className="py-2">{r.ward.split(" - ")[0]}</td>
                    <td className="py-2">{r.disease}</td>
                    <td className="py-2 text-right font-medium tabular-nums">{r.cases}</td>
                    <td className="py-2 text-right tabular-nums">{r.deaths > 0 ? <span className="text-destructive">{r.deaths}</span> : "0"}</td>
                    <td className="py-2 text-muted-foreground">{r.reportedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
