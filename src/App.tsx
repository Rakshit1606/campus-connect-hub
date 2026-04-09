import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import AdminLayout from "@/components/AdminLayout";
import LoginPage from "@/pages/LoginPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import Dashboard from "@/pages/Dashboard";
import AcademicsPage from "@/pages/AcademicsPage";
import FinancePage from "@/pages/FinancePage";
import QueriesPage from "@/pages/QueriesPage";
import AnnouncementsPage from "@/pages/AnnouncementsPage";
import PerformancePage from "@/pages/PerformancePage";
import ExtracurricularPage from "@/pages/ExtracurricularPage";
import SettingsPage from "@/pages/SettingsPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminFeesPage from "@/pages/admin/AdminFeesPage";
import AdminQueriesPage from "@/pages/admin/AdminQueriesPage";
import NotFound from "@/pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  return <AppLayout />;
};

const AdminRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!isAuthenticated) return <Navigate to="/admin-login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return <AdminLayout />;
};

const AuthRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (isAuthenticated && user?.role === "admin") return <Navigate to="/admin" replace />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <LoginPage />;
};

const AdminAuthRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (isAuthenticated && user?.role === "admin") return <Navigate to="/admin" replace />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <AdminLoginPage />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthRoute />} />
            <Route path="/admin-login" element={<AdminAuthRoute />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/academics" element={<AcademicsPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/queries" element={<QueriesPage />} />
              <Route path="/queries/new" element={<QueriesPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/extracurricular" element={<ExtracurricularPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route element={<AdminRoutes />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/fees" element={<AdminFeesPage />} />
              <Route path="/admin/queries" element={<AdminQueriesPage />} />
              <Route path="/admin/announcements" element={<AnnouncementsPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
