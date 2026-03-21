import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type UserRole = "super_admin" | "admin" | "field_staff" | "doctor" | "citizen" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ward?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users for each role
const DEMO_USERS: Record<string, User> = {
  "admin@smc.gov.in": { id: "1", name: "Dr. Rajesh Patil", email: "admin@smc.gov.in", role: "super_admin" },
  "health@smc.gov.in": { id: "2", name: "Priya Deshmukh", email: "health@smc.gov.in", role: "admin", ward: "Ward 1" },
  "asha@smc.gov.in": { id: "3", name: "Sunita Jadhav", email: "asha@smc.gov.in", role: "field_staff", ward: "Ward 3" },
  "doctor@smc.gov.in": { id: "4", name: "Dr. Anand Kulkarni", email: "doctor@smc.gov.in", role: "doctor" },
  "citizen@example.com": { id: "5", name: "Amit Sharma", email: "citizen@example.com", role: "citizen", ward: "Ward 5" },
  "viewer@smc.gov.in": { id: "6", name: "Meena Gaikwad", email: "viewer@smc.gov.in", role: "viewer" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("smc_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const found = DEMO_USERS[email];
    if (found) {
      setUser(found);
      localStorage.setItem("smc_user", JSON.stringify(found));
    } else {
      // Default citizen login
      const newUser: User = { id: crypto.randomUUID(), name: email.split("@")[0], email, role: "citizen" };
      setUser(newUser);
      localStorage.setItem("smc_user", JSON.stringify(newUser));
    }
    setIsLoading(false);
  }, []);

  const register = useCallback(async (data: Partial<User> & { password: string }) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name || "Citizen",
      email: data.email || "",
      role: "citizen",
      ward: data.ward,
      phone: data.phone,
    };
    setUser(newUser);
    localStorage.setItem("smc_user", JSON.stringify(newUser));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("smc_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Health Officer",
  field_staff: "Field Staff",
  doctor: "Doctor / MO",
  citizen: "Citizen",
  viewer: "Viewer / Analyst",
};
