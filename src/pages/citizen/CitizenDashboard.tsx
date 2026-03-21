import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { PublicNav } from "@/components/PublicNav";
import {
  CalendarCheck, Building2, Megaphone, Shield, Bot, Mic,
  FileText, Bell, ChevronRight, Activity
} from "lucide-react";
import { SAFETY_ALERTS } from "@/lib/mock-data";

const MODULES = [
  { icon: CalendarCheck, title: "Book Appointment", desc: "Find doctors & book slots", link: "/citizen/appointments", color: "bg-primary/10 text-primary" },
  { icon: Building2, title: "Hospital Resources", desc: "Beds, machinery, medicine stock", link: "/citizen/resources", color: "bg-secondary/10 text-secondary" },
  { icon: Megaphone, title: "Campaigns", desc: "Health drives & vaccinations", link: "/citizen/campaigns", color: "bg-warning/10 text-warning" },
  { icon: Shield, title: "Safety Alerts", desc: "Health alerts for your area", link: "/citizen/alerts", color: "bg-destructive/10 text-destructive" },
  { icon: Bot, title: "AI Doctor", desc: "Symptom check & advice", link: "/citizen/ai-doctor", color: "bg-info/10 text-info" },
  { icon: Mic, title: "Voice Assistant", desc: "Speak to navigate", link: "/citizen/voice", color: "bg-accent/10 text-accent" },
  { icon: FileText, title: "Report Analyzer", desc: "Upload & analyze test reports", link: "/citizen/analyzer", color: "bg-primary/10 text-primary" },
  { icon: Bell, title: "My Reminders", desc: "Medicine & follow-up alerts", link: "/citizen/reminders", color: "bg-secondary/10 text-secondary" },
];

export default function CitizenDashboard() {
  const { user } = useAuth();
  const userAlerts = SAFETY_ALERTS.filter(a => a.severity === "high");

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="container py-6 md:py-8">
        <div className="mb-6 animate-in-up">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Namaste, {user?.name || "Citizen"} 🙏
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.ward ? `${user.ward} • ` : ""}Access your health services below
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
              key={m.title}
              to={m.link}
              className={`card-hover rounded-xl bg-card border p-4 md:p-5 group animate-in-up animate-in-up-delay-${i % 4}`}
            >
              <div className={`h-10 w-10 rounded-lg ${m.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <m.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">{m.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
            </Link>
          ))}
        </div>

        {/* Quick info bar */}
        <div className="mt-8 rounded-xl bg-muted/50 border p-4 flex items-center gap-3 animate-in-up">
          <Activity className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Emergency?</span> Call SMC Health Helpline: <a href="tel:0217-2312345" className="text-primary font-medium">0217-231-2345</a>
          </p>
        </div>
      </div>
    </div>
  );
}
