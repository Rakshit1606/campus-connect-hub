import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/shared";
import { Calendar, Clock, CheckCircle, FileText } from "lucide-react";

const timetable = [
  { day: "Mon", slots: [
    { time: "09:00–10:30", subject: "Data Structures", room: "B-204", faculty: "Dr. Sharma" },
    { time: "10:30–12:00", subject: "Database Systems", room: "Lab-3", faculty: "Prof. Gupta" },
    { time: "13:00–14:30", subject: "Computer Networks", room: "A-101", faculty: "Dr. Rao" },
    { time: "14:30–16:00", subject: "Software Engineering", room: "B-108", faculty: "Dr. Singh" },
  ]},
  { day: "Tue", slots: [
    { time: "09:00–10:30", subject: "Operating Systems", room: "A-205", faculty: "Dr. Patel" },
    { time: "10:30–12:00", subject: "Data Structures Lab", room: "Lab-1", faculty: "Dr. Sharma" },
    { time: "13:00–14:30", subject: "Discrete Mathematics", room: "C-302", faculty: "Prof. Jain" },
  ]},
  { day: "Wed", slots: [
    { time: "09:00–10:30", subject: "Database Systems", room: "B-204", faculty: "Prof. Gupta" },
    { time: "10:30–12:00", subject: "Computer Networks", room: "A-101", faculty: "Dr. Rao" },
    { time: "13:00–14:30", subject: "Software Engineering", room: "Lab-2", faculty: "Dr. Singh" },
    { time: "14:30–16:00", subject: "Operating Systems", room: "A-205", faculty: "Dr. Patel" },
  ]},
];

const attendance = [
  { subject: "Data Structures", attended: 28, total: 32, percentage: 87.5 },
  { subject: "Database Systems", attended: 25, total: 30, percentage: 83.3 },
  { subject: "Computer Networks", attended: 22, total: 28, percentage: 78.6 },
  { subject: "Software Engineering", attended: 30, total: 32, percentage: 93.8 },
  { subject: "Operating Systems", attended: 24, total: 30, percentage: 80.0 },
  { subject: "Discrete Mathematics", attended: 26, total: 28, percentage: 92.9 },
];

const assignments = [
  { title: "B-Tree Implementation", subject: "Data Structures", due: "Mar 20", status: "pending" },
  { title: "ER Diagram Design", subject: "Database Systems", due: "Mar 18", status: "submitted" },
  { title: "TCP/IP Protocol Analysis", subject: "Computer Networks", due: "Mar 22", status: "pending" },
  { title: "SRS Document Draft", subject: "Software Engineering", due: "Mar 15", status: "graded" },
];

const AcademicsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">Academics</h1>

      {/* Timetable */}
      <div>
        <SectionHeader title="Weekly Timetable" action={
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Week of Mar 17
          </span>
        } />
        <div className="bg-card rounded-lg shadow-surface overflow-hidden">
          {timetable.map((day, di) => (
            <div key={day.day} className={di > 0 ? "border-t border-border/50" : ""}>
              <div className="px-4 py-2 bg-secondary/30">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{day.day}</span>
              </div>
              {day.slots.map((slot, si) => (
                <motion.div
                  key={si}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (di * 4 + si) * 0.02 }}
                  className="flex items-center gap-4 px-4 py-2.5 hover:bg-secondary/20 transition-colors duration-150"
                >
                  <span className="text-xs text-muted-foreground tabular-nums w-24 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {slot.time}
                  </span>
                  <span className="text-sm font-medium text-foreground flex-1">{slot.subject}</span>
                  <span className="text-xs text-muted-foreground">{slot.room}</span>
                  <span className="text-xs text-muted-foreground">{slot.faculty}</span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Attendance */}
      <div>
        <SectionHeader title="Attendance Overview" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {attendance.map((item, i) => (
            <motion.div
              key={item.subject}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-lg shadow-surface p-4 hover-lift"
            >
              <p className="text-sm font-medium text-foreground">{item.subject}</p>
              <div className="flex items-end justify-between mt-2">
                <span className={`text-xl font-semibold tabular-nums ${
                  item.percentage >= 85 ? "text-success" : item.percentage >= 75 ? "text-warning" : "text-destructive"
                }`}>
                  {item.percentage.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">{item.attended}/{item.total}</span>
              </div>
              <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    item.percentage >= 85 ? "bg-success" : item.percentage >= 75 ? "bg-warning" : "bg-destructive"
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Assignments */}
      <div>
        <SectionHeader title="Assignments" />
        <div className="bg-card rounded-lg shadow-surface divide-y divide-border/50">
          {assignments.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/20 transition-colors duration-150"
            >
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.subject} · Due {a.due}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${
                a.status === "pending" ? "bg-warning/10 text-warning" :
                a.status === "submitted" ? "bg-primary/10 text-primary" :
                "bg-success/10 text-success"
              }`}>
                {a.status === "graded" && <CheckCircle className="h-3 w-3 inline mr-1" />}
                {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicsPage;
