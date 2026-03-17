import { motion } from "framer-motion";
import { Trophy, Users, Calendar, Zap } from "lucide-react";
import { SectionHeader } from "@/components/ui/shared";

const clubs = [
  { name: "Coding Club", members: 120, role: "Member", nextEvent: "Hackathon - Mar 22" },
  { name: "Photography Society", members: 45, role: "Secretary", nextEvent: "Photo Walk - Mar 20" },
  { name: "Debate Forum", members: 60, role: "Member", nextEvent: "Inter-college Debate - Apr 5" },
];

const events = [
  { title: "Annual Hackathon 2025", date: "Mar 22–23", type: "Competition", status: "Registered" },
  { title: "Cultural Fest: Euphoria", date: "Apr 10–12", type: "Cultural", status: "Open" },
  { title: "Inter-department Cricket", date: "Apr 15", type: "Sports", status: "Open" },
  { title: "AI/ML Workshop Series", date: "Mar 25–28", type: "Workshop", status: "Registered" },
];

const ExtracurricularPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">Extra-Curricular</h1>

      <div>
        <SectionHeader title="My Clubs & Societies" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {clubs.map((club, i) => (
            <motion.div
              key={club.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-lg shadow-surface p-4 hover-lift"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{club.name}</p>
                  <p className="text-xs text-muted-foreground">{club.members} members · {club.role}</p>
                  <p className="text-xs text-primary mt-1.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {club.nextEvent}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Events & Competitions" />
        <div className="bg-card rounded-lg shadow-surface divide-y divide-border/50">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/20 transition-colors duration-150"
            >
              <div className={`h-8 w-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
                event.type === "Competition" ? "bg-warning/10 text-warning" :
                event.type === "Sports" ? "bg-success/10 text-success" :
                event.type === "Workshop" ? "bg-primary/10 text-primary" :
                "bg-accent text-accent-foreground"
              }`}>
                {event.type === "Competition" ? <Trophy className="h-4 w-4" /> :
                 event.type === "Sports" ? <Zap className="h-4 w-4" /> :
                 <Calendar className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.date} · {event.type}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${
                event.status === "Registered" ? "bg-success/10 text-success" : "bg-secondary text-secondary-foreground"
              }`}>
                {event.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExtracurricularPage;
