import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Users, IndianRupee, MessageSquare, Megaphone,
  Settings, ChevronLeft, LogOut, Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const adminNav = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Users", icon: Users, path: "/admin/users" },
  { title: "Fees", icon: IndianRupee, path: "/admin/fees" },
  { title: "Queries", icon: MessageSquare, path: "/admin/queries" },
  { title: "Announcements", icon: Megaphone, path: "/admin/announcements" },
  { title: "Settings", icon: Settings, path: "/admin/settings" },
];

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen gradient-navy flex flex-col flex-shrink-0 overflow-hidden relative z-10 shadow-lg"
    >
      <div className="h-16 flex items-center px-4 flex-shrink-0 border-b border-white/10">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Shield className="h-4 w-4 text-red-400" />
              </div>
              <span className="text-base font-bold text-white tracking-tight whitespace-nowrap font-display">
                Admin Panel
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

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {adminNav.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== "/admin" && location.pathname.startsWith(item.path));
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
              {!collapsed && <span className="text-sm whitespace-nowrap">{item.title}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 flex-shrink-0 border-t border-white/10">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="h-9 w-9 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-blue-300">Administrator</p>
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

export default AdminSidebar;
