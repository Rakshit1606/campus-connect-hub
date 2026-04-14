import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge } from "@/components/ui/shared";
import {
  Calendar, Clock, BookOpen, MessageSquare, IndianRupee, BarChart3,
  GraduationCap, Award, Bell, TrendingUp, Users, FileText, ClipboardCheck,
  BookMarked, Megaphone, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const timetable = [
  { time: "09:00", subject: "Data Structures", room: "B-204", type: "Lecture" },
  { time: "10:30", subject: "Database Systems", room: "Lab-3", type: "Lab" },
  { time: "12:00", subject: "Lunch Break", room: "", type: "Break" },
  { time: "13:00", subject: "Computer Networks", room: "A-101", type: "Lecture" },
  { time: "14:30", subject: "Software Engineering", room: "B-108", type: "Tutorial" },
];

const recentQueries = [
  { id: "#1024", title: "Tuition fee payment not reflected", status: "pending" as const, date: "Mar 15" },
  { id: "#1021", title: "Lab attendance discrepancy", status: "in_progress" as const, date: "Mar 12" },
  { id: "#1018", title: "Scholarship application status", status: "resolved" as const, date: "Mar 8" },
];

const announcements = [
  { title: "Mid-semester exam schedule published", date: "Mar 16", category: "Exams" },
  { title: "Library hours extended during exam week", date: "Mar 15", category: "General" },
  { title: "Workshop: Cloud Computing Fundamentals", date: "Mar 14", category: "Events" },
];

const quickLinks = [
  { label: "Academics", icon: BookMarked, path: "/academics", color: "from-blue-500 to-blue-600" },
  { label: "Finance", icon: IndianRupee, path: "/finance", color: "from-emerald-500 to-emerald-600" },
  { label: "Queries", icon: MessageSquare, path: "/queries", color: "from-amber-500 to-amber-600" },
  { label: "Performance", icon: TrendingUp, path: "/performance", color: "from-purple-500 to-purple-600" },
];

const facultyQueries = [
  { id: "#1024", student: "Arjun Mehta", title: "Tuition fee payment not reflected", status: "pending" as const, category: "Fees" },
  { id: "#1023", student: "Priya Singh", title: "Request for exam regrading", status: "pending" as const, category: "Exams" },
  { id: "#1022", student: "Rahul Kumar", title: "Hostel room allocation issue", status: "in_progress" as const, category: "Admissions" },
  { id: "#1021", student: "Sneha Patel", title: "Lab attendance discrepancy", status: "in_progress" as const, category: "Academics" },
  { id: "#1020", student: "Vikram Joshi", title: "Transport fee refund request", status: "resolved" as const, category: "Fees" },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-navy rounded-2xl p-6 md:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <GraduationCap className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium">Welcome back,</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 font-display">{user?.name || "Student"}</h1>
          <p className="text-blue-200 text-sm mt-2">B.Tech Computer Science · Semester 6 · 2024-25</p>
          <div className="flex flex-wrap gap-3 mt-5">
            {quickLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${link.color} text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Attendance", value: "84.2%", subtitle: "5 classes today", icon: BarChart3, accent: "text-blue-600 bg-blue-50" },
          { title: "Pending Fees", value: "₹58,500", subtitle: "Due Mar 31", icon: IndianRupee, accent: "text-emerald-600 bg-emerald-50" },
          { title: "Open Queries", value: "2", subtitle: "1 pending response", icon: MessageSquare, accent: "text-amber-600 bg-amber-50" },
          { title: "Assignments", value: "3", subtitle: "Due this week", icon: FileText, accent: "text-purple-600 bg-purple-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="bg-card rounded-xl shadow-surface p-5 hover-lift cursor-default border border-border/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1.5 tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.accent}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Three Column Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl shadow-surface border border-border/50 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Today's Schedule</h2>
            </div>
            <span className="text-xs text-muted-foreground">Mon, Mar 17</span>
          </div>
          <div className="divide-y divide-border/30">
            {timetable.map((slot, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`flex items-center gap-3 px-5 py-3 ${slot.type === "Break" ? "opacity-50 bg-muted/30" : "hover:bg-muted/20"} transition-colors`}
              >
                <span className="text-xs font-mono text-muted-foreground tabular-nums w-12">{slot.time}</span>
                <div className={`w-1 h-8 rounded-full ${
                  slot.type === "Lab" ? "bg-emerald-400" : slot.type === "Tutorial" ? "bg-amber-400" : slot.type === "Break" ? "bg-muted" : "bg-primary"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{slot.subject}</p>
                  {slot.room && <p className="text-xs text-muted-foreground">{slot.room} · {slot.type}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Queries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-xl shadow-surface border border-border/50 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-foreground">Recent Queries</h2>
            </div>
            <button onClick={() => navigate("/queries")} className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-border/30">
            {recentQueries.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="px-5 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{q.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{q.id} · {q.date}</p>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl shadow-surface border border-border/50 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-red-500" />
              <h2 className="text-sm font-semibold text-foreground">Announcements</h2>
            </div>
            <button onClick={() => navigate("/announcements")} className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-border/30">
            {announcements.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="px-5 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer"
              >
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{a.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-navy rounded-2xl p-6 md:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-56 h-56 opacity-10">
          <Award className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium">Good morning,</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 font-display">{user?.name || "Professor"}</h1>
          <p className="text-blue-200 text-sm mt-2">Department of Computer Science · 2024-25</p>
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { label: "My Classes", icon: BookOpen, path: "/academics" },
              { label: "Student Queries", icon: MessageSquare, path: "/queries" },
              { label: "Post Announcement", icon: Megaphone, path: "/announcements" },
            ].map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-sm font-medium transition-all duration-200 backdrop-blur-sm"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Pending Queries", value: "5", subtitle: "2 high priority", icon: MessageSquare, accent: "text-amber-600 bg-amber-50" },
          { title: "Classes Today", value: "4", subtitle: "Next: 10:30 AM", icon: Clock, accent: "text-blue-600 bg-blue-50" },
          { title: "Assignments", value: "12", subtitle: "3 need grading", icon: ClipboardCheck, accent: "text-purple-600 bg-purple-50" },
          { title: "Avg Attendance", value: "78.6%", subtitle: "CS-301 lowest", icon: Users, accent: "text-emerald-600 bg-emerald-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="bg-card rounded-xl shadow-surface p-5 hover-lift cursor-default border border-border/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1.5 tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.accent}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Student Queries Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl shadow-surface border border-border/50 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Assigned Student Queries</h2>
          </div>
          <div className="flex gap-1">
            {["All", "Pending", "In Progress"].map((f) => (
              <button key={f} className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors duration-150 ${
                f === "All" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
            <span>ID</span><span>Student</span><span>Query</span><span>Category</span><span>Status</span>
          </div>
          {facultyQueries.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-5 py-3.5 items-center hover:bg-muted/20 transition-colors duration-150 cursor-pointer border-t border-border/30"
            >
              <span className="text-xs text-muted-foreground font-mono tabular-nums">{q.id}</span>
              <span className="text-sm text-foreground font-medium">{q.student}</span>
              <span className="text-sm text-foreground truncate">{q.title}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{q.category}</span>
              <StatusBadge status={q.status} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  return user?.role === "faculty" ? <FacultyDashboard /> : <StudentDashboard />;
};

export default Dashboard;
