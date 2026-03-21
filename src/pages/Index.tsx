import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  Bell, CalendarCheck, Building2, Pill, Shield, Bot, Mic,
  Activity, ChevronRight, Heart, Users, FileText, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/PublicNav";
import { SAFETY_ALERTS, CAMPAIGNS } from "@/lib/mock-data";

const FEATURES = [
  { icon: CalendarCheck, title: "Book Appointments", desc: "Find doctors by specialty, ward, and availability. Book slots instantly.", link: "/citizen/appointments", color: "text-primary" },
  { icon: Building2, title: "Hospital Resources", desc: "Real-time bed availability, machinery status across SMC hospitals.", link: "/citizen/resources", color: "text-secondary" },
  { icon: Pill, title: "Medicine Checker", desc: "Search medicine stock at nearest SMC dispensaries.", link: "/citizen/resources", color: "text-warning" },
  { icon: Shield, title: "Safety Alerts", desc: "Location-based health alerts for your ward and nearby areas.", link: "/citizen/alerts", color: "text-destructive" },
  { icon: Bot, title: "AI Doctor", desc: "Chat with our AI assistant for symptom checking and basic advice.", link: "/citizen/ai-doctor", color: "text-info" },
  { icon: Mic, title: "Voice Assistant", desc: "Speak naturally to book appointments or check information.", link: "/citizen/voice", color: "text-accent" },
];

const STATS = [
  { value: "10", label: "Wards Covered", icon: MapPin },
  { value: "50+", label: "Health Centers", icon: Building2 },
  { value: "200+", label: "Doctors", icon: Heart },
  { value: "1.2L", label: "Citizens Served", icon: Users },
];

export default function LandingPage() {
  const { user } = useAuth();
  const activeAlerts = SAFETY_ALERTS.filter(a => a.severity === "high");
  const upcomingCampaigns = CAMPAIGNS.filter(c => c.status === "upcoming").slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Alert Banner */}
      {activeAlerts.length > 0 && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5">
          <div className="container flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-destructive shrink-0" />
            <span className="font-medium text-destructive">{activeAlerts[0].title}</span>
            <Link to="/citizen/alerts" className="ml-auto text-destructive underline underline-offset-2 text-xs">View all</Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="container relative py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl animate-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-primary-foreground/90 backdrop-blur-sm mb-6">
              <Activity className="h-3.5 w-3.5" />
              Solapur Municipal Corporation
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-[1.1] mb-4">
              Smart Public Health Management System
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Book appointments, check hospital resources, get health alerts, and access AI-powered health assistance — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              {user ? (
                <Button asChild variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  <Link to={user.role === "citizen" ? "/citizen" : "/dashboard"}>
                    Go to Dashboard <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold active:scale-[0.97]">
                    <Link to="/register">Register as Citizen</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white/30 text-primary-foreground hover:bg-white/10 active:scale-[0.97]">
                    <Link to="/login">Staff Login</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={s.label} className={`flex items-center gap-3 animate-in-up animate-in-up-delay-${i}`}>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-20">
        <div className="text-center mb-12 animate-in-up">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Citizen Health Services</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Access healthcare services digitally — from your phone, for your family.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Link
              to={user ? f.link : "/login"}
              key={f.title}
              className={`group card-hover rounded-xl bg-card border p-6 animate-in-up animate-in-up-delay-${i % 4}`}
            >
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Campaigns */}
      {upcomingCampaigns.length > 0 && (
        <section className="bg-muted/50 border-t">
          <div className="container py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Upcoming Health Campaigns</h2>
                <p className="text-sm text-muted-foreground">Register for free health drives and vaccination camps</p>
              </div>
              <Link to="/citizen/campaigns" className="text-sm text-primary font-medium hover:underline hidden md:block">View all →</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {upcomingCampaigns.map(c => (
                <div key={c.id} className="card-hover rounded-xl bg-card border p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">{c.type}</span>
                    <span className="text-xs text-muted-foreground">{c.date}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.ward}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{c.registrations}/{c.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span>© 2026 Solapur Municipal Corporation. Smart Public Health System.</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-foreground">Staff Portal</Link>
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
