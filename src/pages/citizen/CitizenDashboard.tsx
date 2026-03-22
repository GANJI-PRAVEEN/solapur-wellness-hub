import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { PublicNav } from "@/components/PublicNav";
import {
  CalendarCheck, Building2, Megaphone, Shield, Bot, Mic,
  FileText, Bell, ChevronRight, Activity, ClipboardList, Receipt
} from "lucide-react";
import { SAFETY_ALERTS } from "@/lib/mock-data";

const MODULES = [
  { icon: CalendarCheck, titleKey: "cit.mod.appts", descKey: "cit.mod.appts.desc", link: "/citizen/appointments", color: "bg-primary/10 text-primary" },
  { icon: Building2, titleKey: "cit.mod.res", descKey: "cit.mod.res.desc", link: "/citizen/resources", color: "bg-secondary/10 text-secondary" },
  { icon: Megaphone, titleKey: "cit.mod.camp", descKey: "cit.mod.camp.desc", link: "/citizen/campaigns", color: "bg-warning/10 text-warning" },
  { icon: Shield, titleKey: "cit.mod.alerts", descKey: "cit.mod.alerts.desc", link: "/citizen/alerts", color: "bg-destructive/10 text-destructive" },
  { icon: Bot, titleKey: "cit.mod.ai", descKey: "cit.mod.ai.desc", link: "/citizen/ai-doctor", color: "bg-info/10 text-info" },
  { icon: Mic, titleKey: "cit.mod.voice", descKey: "cit.mod.voice.desc", link: "/citizen/voice", color: "bg-accent/10 text-accent" },
  { icon: FileText, titleKey: "cit.mod.report", descKey: "cit.mod.report.desc", link: "/citizen/analyzer", color: "bg-primary/10 text-primary" },
  { icon: Bell, titleKey: "cit.mod.reminders", descKey: "cit.mod.reminders.desc", link: "/citizen/reminders", color: "bg-secondary/10 text-secondary" },
  { icon: ClipboardList, titleKey: "cit.mod.testReports", descKey: "cit.mod.testReports.desc", link: "/citizen/reports", color: "bg-success/10 text-success" },
  { icon: Receipt, titleKey: "cit.mod.bills", descKey: "cit.mod.bills.desc", link: "/citizen/bills", color: "bg-destructive/10 text-destructive" },
];

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const userAlerts = SAFETY_ALERTS.filter(a => a.severity === "high");

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="container py-6 md:py-8">
        <div className="mb-6 animate-in-up">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {t("cit.hello").replace("{name}", user?.name || "Citizen")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.ward ? `${user.ward} • ` : ""}{t("cit.subtitle")}
          </p>
        </div>

        {/* Alert card */}
        {userAlerts.length > 0 && (
          <Link to="/citizen/alerts" className="block mb-6 animate-in-up">
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-destructive">{userAlerts[0].title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{userAlerts[0].description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-destructive shrink-0 mt-1" />
              </div>
            </div>
          </Link>
        )}

        {/* Quick actions grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {MODULES.map((m, i) => (
            <Link
              key={m.titleKey}
              to={m.link}
              className={`card-hover rounded-xl bg-card border p-4 md:p-5 group animate-in-up animate-in-up-delay-${i % 4}`}
            >
              <div className={`h-10 w-10 rounded-lg ${m.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <m.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">{t(m.titleKey)}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t(m.descKey)}</p>
            </Link>
          ))}
        </div>

        {/* Quick info bar */}
        <div className="mt-8 rounded-xl bg-muted/50 border p-4 flex items-center gap-3 animate-in-up">
          <Activity className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{t("cit.emergency")}</span> {t("cit.call")} <a href="tel:0217-2312345" className="text-primary font-medium">0217-231-2345</a>
          </p>
        </div>
      </div>
    </div>
  );
}
