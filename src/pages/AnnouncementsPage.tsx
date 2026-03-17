import { motion } from "framer-motion";
import { Megaphone, Calendar, Tag } from "lucide-react";
import { SectionHeader } from "@/components/ui/shared";

const announcements = [
  { title: "Mid-Semester Examination Schedule Published", body: "The mid-semester examination for all departments will commence from April 7, 2025. Students are advised to collect their hall tickets from the examination cell.", date: "Mar 16", category: "Exams", priority: "high" },
  { title: "Library Hours Extended During Exam Week", body: "The central library will remain open from 7:00 AM to 11:00 PM during the examination period (April 7–18).", date: "Mar 15", category: "General", priority: "normal" },
  { title: "Workshop: Cloud Computing Fundamentals", body: "A two-day workshop on Cloud Computing will be held on March 22–23 in Seminar Hall B. Registration is open for all CS and IT students.", date: "Mar 14", category: "Events", priority: "normal" },
  { title: "Fee Payment Deadline Extended", body: "The last date for payment of tuition fees for the current semester has been extended to March 31, 2025. Late fee will apply after this date.", date: "Mar 13", category: "Finance", priority: "high" },
  { title: "Annual Sports Meet Registration Open", body: "Registration for the Annual Sports Meet (April 25–27) is now open. Interested students can register through the Sports Department portal.", date: "Mar 12", category: "Sports", priority: "normal" },
  { title: "Semester Break: April 19–26", body: "The campus will observe semester break from April 19 to April 26. Hostel facilities will remain available for registered residents.", date: "Mar 10", category: "Holiday", priority: "normal" },
];

const AnnouncementsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">Announcements</h1>

      <div className="space-y-3">
        {announcements.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-lg shadow-surface p-4 hover-lift cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className={`h-8 w-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
                a.priority === "high" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
              }`}>
                <Megaphone className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{a.title}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {a.date}
                  </span>
                  <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                    <Tag className="h-3 w-3" /> {a.category}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
