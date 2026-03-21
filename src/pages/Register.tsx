import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Loader2 } from "lucide-react";
import { WARDS } from "@/lib/mock-data";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", ward: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    await register({ name: form.name, email: form.email, phone: form.phone, ward: form.ward, password: form.password });
    navigate("/citizen");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-md animate-in-up">
        <div className="bg-card rounded-xl border p-8 shadow-sm">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">SMC Health</span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground mb-1">Citizen Registration</h1>
          <p className="text-sm text-muted-foreground mb-6">Create your account to access health services</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="mt-1" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="mt-1" />
            </div>
            <div>
              <Label>Ward / Area</Label>
              <Select value={form.ward} onValueChange={v => setForm(f => ({ ...f, ward: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select your ward" /></SelectTrigger>
                <SelectContent>
                  {WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="mt-1" />
              </div>
              <div>
                <Label>Confirm</Label>
                <Input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required className="mt-1" />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" required className="mt-0.5" />
              <span>I consent to SMC processing my health data per Indian privacy regulations</span>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-4 text-center">
            Already registered? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
