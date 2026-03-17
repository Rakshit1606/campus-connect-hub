import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/shared";
import { BarChart3, TrendingUp, Award } from "lucide-react";

const grades = [
  { subject: "Data Structures", code: "CS-301", grade: "A", credits: 4, gpa: 9.0 },
  { subject: "Database Systems", code: "CS-302", grade: "A-", credits: 4, gpa: 8.5 },
  { subject: "Computer Networks", code: "CS-303", grade: "B+", credits: 3, gpa: 8.0 },
  { subject: "Software Engineering", code: "CS-304", grade: "A", credits: 3, gpa: 9.0 },
  { subject: "Operating Systems", code: "CS-305", grade: "B+", credits: 4, gpa: 8.0 },
  { subject: "Discrete Mathematics", code: "MA-201", grade: "A-", credits: 3, gpa: 8.5 },
];

const semesterGPA = [
  { sem: "Sem 1", gpa: 7.8 },
  { sem: "Sem 2", gpa: 8.2 },
  { sem: "Sem 3", gpa: 8.4 },
  { sem: "Sem 4", gpa: 8.5 },
  { sem: "Sem 5", gpa: 8.6 },
];

const PerformancePage = () => {
  const currentGPA = 8.52;
  const cgpa = 8.30;
  const totalCredits = 21;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">Performance</h1>

      {/* GPA Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-lg shadow-surface p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current SGPA</p>
          <p className="text-2xl font-semibold text-foreground mt-1 tabular-nums">{currentGPA.toFixed(2)}</p>
          <p className="text-xs text-success flex items-center gap-1 mt-0.5"><TrendingUp className="h-3 w-3" /> +0.12 from last sem</p>
        </div>
        <div className="bg-card rounded-lg shadow-surface p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CGPA</p>
          <p className="text-2xl font-semibold text-foreground mt-1 tabular-nums">{cgpa.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-lg shadow-surface p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Credits Earned</p>
          <p className="text-2xl font-semibold text-foreground mt-1 tabular-nums">{totalCredits}</p>
          <p className="text-xs text-muted-foreground mt-0.5">This semester</p>
        </div>
      </div>

      {/* GPA Trend */}
      <div>
        <SectionHeader title="GPA Trend" />
        <div className="bg-card rounded-lg shadow-surface p-4">
          <div className="flex items-end gap-3 h-32">
            {semesterGPA.map((s, i) => (
              <div key={s.sem} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium tabular-nums text-foreground">{s.gpa}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(s.gpa / 10) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full bg-primary/20 rounded-sm relative overflow-hidden min-h-[8px]"
                >
                  <div className="absolute inset-0 bg-primary rounded-sm" style={{ opacity: 0.3 + (s.gpa / 10) * 0.7 }} />
                </motion.div>
                <span className="text-xs text-muted-foreground">{s.sem}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <div>
        <SectionHeader title="Current Semester Grades" />
        <div className="bg-card rounded-lg shadow-surface">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Subject</span><span>Code</span><span>Credits</span><span>Grade</span><span>GPA</span>
          </div>
          {grades.map((g, i) => (
            <motion.div
              key={g.code}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-3 items-center border-t border-border/50"
            >
              <span className="text-sm font-medium text-foreground">{g.subject}</span>
              <span className="text-xs text-muted-foreground font-mono">{g.code}</span>
              <span className="text-sm tabular-nums text-foreground text-center">{g.credits}</span>
              <span className={`text-sm font-semibold tabular-nums ${
                g.grade.startsWith("A") ? "text-success" : "text-primary"
              }`}>{g.grade}</span>
              <span className="text-sm tabular-nums text-foreground text-center">{g.gpa.toFixed(1)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
