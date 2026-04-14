import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, BookOpen, IndianRupee, MessageSquare, Megaphone,
  BarChart3, Trophy, Settings, ChevronLeft, LogOut, Plus, GraduationCap,
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
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen gradient-navy flex flex-col flex-shrink-0 overflow-hidden relative z-10 shadow-lg"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 flex-shrink-0 border-b border-white/10">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="h-8 w-8 rounded-lg gradient-gold flex items-center justify-center">
                <GraduationCap className="h-4.5 w-4.5 text-navy" style={{ color: 'hsl(224, 71%, 15%)' }} />
              </div>
              <span className="text-base font-bold text-white tracking-tight whitespace-nowrap font-display">
                CampusFlow
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto h-8 w-8 flex items-center justify-center rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-colors duration-150"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Raise Query Button (Student) */}
      {user?.role === "student" && (
        <div className="px-3 mt-4 mb-2">
          <button
            onClick={() => navigate("/queries/new")}
            className={`flex items-center gap-2 gradient-gold rounded-lg font-semibold hover:opacity-90 transition-all duration-150 shadow-md ${
              collapsed ? "h-10 w-10 justify-center mx-auto" : "h-10 px-4 w-full"
            }`}
            style={{ color: 'hsl(224, 71%, 15%)' }}
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Raise Query</span>}
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 h-10 rounded-lg transition-all duration-150 ${
                collapsed ? "justify-center px-0" : "px-3"
              } ${
                isActive
                  ? "bg-white/15 text-white font-medium shadow-sm"
                  : "text-blue-200/70 hover:text-white hover:bg-white/8"
              }`}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="text-sm whitespace-nowrap">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto gradient-gold text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center" style={{ color: 'hsl(224, 71%, 15%)' }}>
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
      <div className="p-3 flex-shrink-0 border-t border-white/10">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="h-9 w-9 rounded-full gradient-gold flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ color: 'hsl(224, 71%, 15%)' }}>
            {user?.name?.charAt(0)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-blue-300 capitalize">{user?.role}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-blue-300 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150"
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
