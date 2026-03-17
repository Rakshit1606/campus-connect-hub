import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard, SectionHeader, StatusBadge } from "@/components/ui/shared";
import { Calendar, Clock, BookOpen, MessageSquare, DollarSign, BarChart3 } from "lucide-react";

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

const facultyQueries = [
  { id: "#1024", student: "Arjun Mehta", title: "Tuition fee payment not reflected", status: "pending" as const, category: "Fees" },
  { id: "#1023", student: "Priya Singh", title: "Request for exam regrading", status: "pending" as const, category: "Exams" },
  { id: "#1022", student: "Rahul Kumar", title: "Hostel room allocation issue", status: "in_progress" as const, category: "Admissions" },
  { id: "#1021", student: "Sneha Patel", title: "Lab attendance discrepancy", status: "in_progress" as const, category: "Academics" },
  { id: "#1020", student: "Vikram Joshi", title: "Transport fee refund request", status: "resolved" as const, category: "Fees" },
];

const StudentDashboard = () => (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Attendance" value="84.2%" subtitle="5 classes today" icon={<BarChart3 className="h-5 w-5" />} />
      <StatCard title="Pending Fees" value="$1,240.00" subtitle="Due Mar 31" icon={<DollarSign className="h-5 w-5" />} />
      <StatCard title="Open Queries" value="2" subtitle="1 pending response" icon={<MessageSquare className="h-5 w-5" />} />
      <StatCard title="Assignments" value="3" subtitle="Due this week" icon={<BookOpen className="h-5 w-5" />} />
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      {/* Timetable */}
      <div className="lg:col-span-1">
        <SectionHeader title="Today's Schedule" action={
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Mon, Mar 17
          </span>
        } />
        <div className="bg-card rounded-lg shadow-surface divide-y divide-border/50">
          {timetable.map((slot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 px-4 py-3 ${slot.type === "Break" ? "opacity-50" : ""}`}
            >
              <span className="text-xs font-medium text-muted-foreground tabular-nums w-12">{slot.time}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{slot.subject}</p>
                {slot.room && <p className="text-xs text-muted-foreground">{slot.room} · {slot.type}</p>}
              </div>
              {slot.type === "Lab" && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-sm font-medium">Lab</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Queries */}
      <div className="lg:col-span-1">
        <SectionHeader title="Recent Queries" action={
          <button className="text-xs text-primary font-medium hover:underline">View all</button>
        } />
        <div className="bg-card rounded-lg shadow-surface divide-y divide-border/50">
          {recentQueries.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="px-4 py-3 hover:bg-secondary/30 transition-colors duration-150 cursor-pointer"
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
      </div>

      {/* Announcements */}
      <div className="lg:col-span-1">
        <SectionHeader title="Announcements" action={
          <button className="text-xs text-primary font-medium hover:underline">View all</button>
        } />
        <div className="bg-card rounded-lg shadow-surface divide-y divide-border/50">
          {announcements.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="px-4 py-3 hover:bg-secondary/30 transition-colors duration-150 cursor-pointer"
            >
              <p className="text-sm font-medium text-foreground">{a.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{a.date}</span>
                <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-sm">{a.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FacultyDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Pending Queries" value="5" subtitle="2 high priority" icon={<MessageSquare className="h-5 w-5" />} />
      <StatCard title="Classes Today" value="4" subtitle="Next: 10:30 AM" icon={<Clock className="h-5 w-5" />} />
      <StatCard title="Assignments" value="12" subtitle="3 need grading" icon={<BookOpen className="h-5 w-5" />} />
      <StatCard title="Avg Attendance" value="78.6%" subtitle="CS-301 lowest" icon={<BarChart3 className="h-5 w-5" />} />
    </div>

    <div>
      <SectionHeader title="Student Queries" action={
        <div className="flex gap-1">
          {["All", "Pending", "In Progress"].map((f) => (
            <button key={f} className={`text-xs px-2.5 py-1 rounded-sm font-medium transition-colors duration-150 ${
              f === "All" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}>
              {f}
            </button>
          ))}
        </div>
      } />
      <div className="bg-card rounded-lg shadow-surface">
        <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>ID</span><span>Student</span><span>Query</span><span>Category</span><span>Status</span>
        </div>
        {facultyQueries.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-3 items-center hover:bg-secondary/30 transition-colors duration-150 cursor-pointer border-t border-border/50"
          >
            <span className="text-xs text-muted-foreground font-mono tabular-nums">{q.id}</span>
            <span className="text-sm text-foreground">{q.student}</span>
            <span className="text-sm text-foreground truncate">{q.title}</span>
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-sm">{q.category}</span>
            <StatusBadge status={q.status} />
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-lg font-semibold text-foreground mb-6">
        {user?.role === "faculty" ? "Faculty Dashboard" : "Dashboard"}
      </h1>
      {user?.role === "faculty" ? <FacultyDashboard /> : <StudentDashboard />}
    </div>
  );
};

export default Dashboard;
