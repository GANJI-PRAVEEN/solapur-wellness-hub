import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Activity, Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";

export function PublicNav() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
          <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline text-sm">SMC Health</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/citizen/appointments" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">{t("nav.appointments")}</Link>
          <Link to="/citizen/resources" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">{t("nav.resources")}</Link>
          <Link to="/citizen/campaigns" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">{t("nav.campaigns")}</Link>
          <Link to="/citizen/alerts" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">{t("nav.alerts")}</Link>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              <Link to={user.role === "citizen" ? "/citizen" : "/dashboard"}>
                <Button variant="outline" size="sm">{user.name.split(" ")[0]}</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>{t("nav.logout")}</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/login">{t("nav.login")}</Link></Button>
              <Button asChild size="sm"><Link to="/register">{t("nav.register")}</Link></Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card px-4 py-3 space-y-1">
          <Link to="/citizen/appointments" className="block px-3 py-2 text-sm rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.appointments")}</Link>
          <Link to="/citizen/resources" className="block px-3 py-2 text-sm rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.resources")}</Link>
          <Link to="/citizen/campaigns" className="block px-3 py-2 text-sm rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.campaigns")}</Link>
          <Link to="/citizen/alerts" className="block px-3 py-2 text-sm rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.alerts")}</Link>
        </div>
      )}
    </nav>
  );
}
