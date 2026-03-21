import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth, ROLE_LABELS } from "@/lib/auth";
import {
  Activity, LayoutDashboard, FileText, BarChart3, Users, Building2,
  CalendarCheck, Megaphone, Pill, Shield, Bell, LogOut, Menu, X, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: FileText, label: "Daily Reports", path: "/dashboard/reports" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Shield, label: "Outbreak AI", path: "/dashboard/outbreak" },
  { icon: Users, label: "Doctors", path: "/dashboard/doctors" },
  { icon: Building2, label: "Hospitals & Beds", path: "/dashboard/hospitals" },
  { icon: Pill, label: "Medicine Stock", path: "/dashboard/medicines" },
  { icon: CalendarCheck, label: "Appointments", path: "/dashboard/appointments-mgmt" },
  { icon: Megaphone, label: "Campaigns", path: "/dashboard/campaigns-mgmt" },
  { icon: Bell, label: "Alerts", path: "/dashboard/alerts-mgmt" },
  { icon: Settings, label: "Audit Log", path: "/dashboard/audit" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-sidebar border-r flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-14 flex items-center gap-2 px-4 border-b border-sidebar-border">
          <div className="h-7 w-7 rounded-md hero-gradient flex items-center justify-center">
            <Activity className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm text-sidebar-foreground">SMC Health</span>
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="px-2 mb-2">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/50">{user?.role ? ROLE_LABELS[user.role] : ""}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground" onClick={logout}>
            <LogOut className="h-3.5 w-3.5 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-60">
        <header className="sticky top-0 z-20 h-14 bg-card/95 backdrop-blur-sm border-b flex items-center px-4 gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
          </Button>
          <Link to="/">
            <Button variant="outline" size="sm">Public Site</Button>
          </Link>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
