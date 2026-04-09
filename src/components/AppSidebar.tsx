import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  IndianRupee,
  MessageSquare,
  Megaphone,
  BarChart3,
  Trophy,
  Settings,
  ChevronLeft,
  LogOut,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const studentNav: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Academics", icon: BookOpen, path: "/academics" },
  { title: "Finance & Fees", icon: IndianRupee, path: "/finance" },
  { title: "Queries", icon: MessageSquare, path: "/queries", badge: 2 },
  { title: "Announcements", icon: Megaphone, path: "/announcements" },
  { title: "Performance", icon: BarChart3, path: "/performance" },
  { title: "Extra-Curricular", icon: Trophy, path: "/extracurricular" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const facultyNav: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Academics", icon: BookOpen, path: "/academics" },
  { title: "Student Queries", icon: MessageSquare, path: "/queries", badge: 5 },
  { title: "Announcements", icon: Megaphone, path: "/announcements" },
  { title: "Performance", icon: BarChart3, path: "/performance" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = user?.role === "faculty" ? facultyNav : studentNav;

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen bg-card shadow-surface flex flex-col flex-shrink-0 overflow-hidden relative z-10"
    >
      {/* Header */}
      <div className="h-14 flex items-center px-4 flex-shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-base font-semibold text-foreground tracking-tight whitespace-nowrap"
            >
              CampusFlow
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto h-7 w-7 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform duration-150 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Raise Query Button (Student) */}
      {user?.role === "student" && (
        <div className="px-3 mb-2">
          <button
            onClick={() => navigate("/queries/new")}
            className={`flex items-center gap-2 bg-primary text-primary-foreground rounded-sm font-medium hover:opacity-90 transition-opacity duration-150 ${
              collapsed ? "h-9 w-9 justify-center mx-auto" : "h-9 px-3 w-full"
            }`}
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Raise Query</span>}
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 h-9 rounded-sm transition-all duration-150 ${
                collapsed ? "justify-center px-0" : "px-3"
              } ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="text-sm whitespace-nowrap">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs font-medium px-1.5 py-0.5 rounded-sm min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 flex-shrink-0">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm flex-shrink-0">
            {user?.name?.charAt(0)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="h-7 w-7 flex items-center justify-center rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
