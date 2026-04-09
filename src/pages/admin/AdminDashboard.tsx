import { motion } from "framer-motion";
import { StatCard, SectionHeader } from "@/components/ui/shared";
import { Users, GraduationCap, BookOpen, MessageSquare, IndianRupee, Shield } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value="1,248" subtitle="32 new this month" icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Total Faculty" value="86" subtitle="4 departments" icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Open Queries" value="23" subtitle="8 pending" icon={<MessageSquare className="h-5 w-5" />} />
        <StatCard title="Fee Collection" value="₹48.2L" subtitle="This semester" icon={<IndianRupee className="h-5 w-5" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div>
          <SectionHeader title="Recent Activity" />
          <div className="bg-card rounded-lg shadow-surface divide-y divide-border/50">
            {[
              { action: "New student registered", detail: "Ravi Kumar — B.Tech CS", time: "5 min ago" },
              { action: "Query escalated", detail: "#1045 — Fee dispute", time: "12 min ago" },
              { action: "Announcement posted", detail: "Mid-sem exam schedule", time: "1 hr ago" },
              { action: "Fee payment received", detail: "₹85,000 — Sneha Patel", time: "2 hrs ago" },
              { action: "Faculty added", detail: "Dr. Anand Verma — Mech", time: "3 hrs ago" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="px-4 py-3 hover:bg-secondary/30 transition-colors duration-150"
              >
                <p className="text-sm font-medium text-foreground">{item.action}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{item.detail}</span>
                  <span className="text-xs text-muted-foreground">· {item.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <SectionHeader title="Quick Actions" />
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Student", icon: GraduationCap, path: "/admin/users" },
              { label: "Add Faculty", icon: BookOpen, path: "/admin/users" },
              { label: "Manage Fees", icon: IndianRupee, path: "/admin/fees" },
              { label: "View Queries", icon: MessageSquare, path: "/admin/queries" },
              { label: "User Roles", icon: Shield, path: "/admin/users" },
              { label: "All Users", icon: Users, path: "/admin/users" },
            ].map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-surface hover:shadow-elevated transition-all duration-150 text-left"
              >
                <action.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
