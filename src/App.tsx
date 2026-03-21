import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import AppointmentsPage from "./pages/citizen/AppointmentsPage";
import ResourcesPage from "./pages/citizen/ResourcesPage";
import CampaignsPage from "./pages/citizen/CampaignsPage";
import AlertsPage from "./pages/citizen/AlertsPage";
import AIDoctorPage from "./pages/citizen/AIDoctorPage";
import VoiceAssistantPage from "./pages/citizen/VoiceAssistantPage";
import ReportAnalyzerPage from "./pages/citizen/ReportAnalyzerPage";
import RemindersPage from "./pages/citizen/RemindersPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";

const queryClient = new QueryClient();

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Citizen routes */}
            <Route path="/citizen" element={<ProtectedRoute><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/citizen/appointments" element={<AppointmentsPage />} />
            <Route path="/citizen/resources" element={<ResourcesPage />} />
            <Route path="/citizen/campaigns" element={<CampaignsPage />} />
            <Route path="/citizen/alerts" element={<AlertsPage />} />
            <Route path="/citizen/ai-doctor" element={<AIDoctorPage />} />
            <Route path="/citizen/voice" element={<VoiceAssistantPage />} />
            <Route path="/citizen/analyzer" element={<ReportAnalyzerPage />} />
            <Route path="/citizen/reminders" element={<ProtectedRoute><RemindersPage /></ProtectedRoute>} />

            {/* Admin dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute roles={["super_admin", "admin", "doctor", "field_staff", "viewer"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardOverview />} />
              <Route path="reports" element={<DashboardOverview />} />
              <Route path="analytics" element={<DashboardOverview />} />
              <Route path="outbreak" element={<DashboardOverview />} />
              <Route path="doctors" element={<DashboardOverview />} />
              <Route path="hospitals" element={<DashboardOverview />} />
              <Route path="medicines" element={<DashboardOverview />} />
              <Route path="appointments-mgmt" element={<DashboardOverview />} />
              <Route path="campaigns-mgmt" element={<DashboardOverview />} />
              <Route path="alerts-mgmt" element={<DashboardOverview />} />
              <Route path="audit" element={<DashboardOverview />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
