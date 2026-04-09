import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/shared";
import { supabase } from "@/lib/supabase";
import { Users, GraduationCap, BookOpen, Search, Plus, Edit2, Trash2, Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "student" | "faculty">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, created_at");

    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id, role");

    const rolesMap = new Map(roles?.map((r) => [r.user_id, r.role]) || []);
    const merged: UserProfile[] = (profiles || []).map((p) => ({
      ...p,
      role: (rolesMap.get(p.id) as string) || "student",
    }));
    setUsers(merged);
    setLoading(false);
  };

  const filteredUsers = users
    .filter((u) => filter === "all" || u.role === filter)
    .filter((u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );

  const studentCount = users.filter((u) => u.role === "student").length;
  const facultyCount = users.filter((u) => u.role === "faculty").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">User Management</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-lg shadow-surface p-4 flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-2xl font-semibold text-foreground tabular-nums">{users.length}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-surface p-4 flex items-center gap-3">
          <GraduationCap className="h-5 w-5 text-primary" />
          <div>
            <p className="text-2xl font-semibold text-foreground tabular-nums">{studentCount}</p>
            <p className="text-xs text-muted-foreground">Students</p>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-surface p-4 flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <div>
            <p className="text-2xl font-semibold text-foreground tabular-nums">{facultyCount}</p>
            <p className="text-xs text-muted-foreground">Faculty</p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {(["all", "student", "faculty"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-sm font-medium transition-colors duration-150 ${
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full h-9 pl-9 pr-3 rounded-sm bg-background shadow-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-card rounded-lg shadow-surface">
        <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>Name</span><span>Email</span><span>Role</span><span>Joined</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">No users found.</div>
        ) : (
          filteredUsers.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 py-3 items-center border-t border-border/50 hover:bg-secondary/20 transition-colors duration-150"
            >
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs flex-shrink-0">
                  {user.full_name?.charAt(0) || "?"}
                </div>
                <span className="text-sm font-medium text-foreground truncate">{user.full_name}</span>
              </div>
              <span className="text-sm text-muted-foreground truncate">{user.email}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-sm capitalize ${
                user.role === "faculty" ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"
              }`}>
                {user.role}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {new Date(user.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
