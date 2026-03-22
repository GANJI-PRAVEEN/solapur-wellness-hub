import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate(email.includes("smc.gov") ? "/dashboard" : "/citizen");
    } catch {
      setError(t("login.invalid"));
    }
  };

  const quickLogin = async (email: string) => {
    setEmail(email);
    await login(email, "demo");
    navigate(email.includes("citizen") ? "/citizen" : "/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-in-up">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">SMC Health</span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground mb-1">{t("login.welcome")}</h1>
          <p className="text-sm text-muted-foreground mb-6">{t("login.subtitle")}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("login.submit")}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-4 text-center">
            {t("login.newCitizen")} <Link to="/register" className="text-primary font-medium hover:underline">{t("login.registerHere")}</Link>
          </p>

          <div className="mt-8 pt-6 border-t">
            <p className="text-xs text-muted-foreground mb-3">{t("login.quickDemo")}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Super Admin", email: "admin@smc.gov.in" },
                { label: "Health Officer", email: "health@smc.gov.in" },
                { label: "Field Staff", email: "asha@smc.gov.in" },
                { label: "Doctor", email: "doctor@smc.gov.in" },
                { label: "Citizen", email: "citizen@example.com" },
                { label: "Viewer", email: "viewer@smc.gov.in" },
              ].map(u => (
                <Button key={u.email} variant="outline" size="sm" className="text-xs justify-start" onClick={() => quickLogin(u.email)}>
                  {t(u.label) !== u.label ? t(u.label) : u.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right - Brand */}
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground animate-in-up">
          <h2 className="text-3xl font-bold mb-4 leading-tight">{t("login.brandTitle")}</h2>
          <p className="text-primary-foreground/70 leading-relaxed">
            {t("login.brandSubtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
