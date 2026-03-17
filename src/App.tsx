import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import AcademicsPage from "@/pages/AcademicsPage";
import FinancePage from "@/pages/FinancePage";
import QueriesPage from "@/pages/QueriesPage";
import AnnouncementsPage from "@/pages/AnnouncementsPage";
import PerformancePage from "@/pages/PerformancePage";
import ExtracurricularPage from "@/pages/ExtracurricularPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <AppLayout />
  );
};

const AuthRoute = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <LoginPage />;
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
