import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { SectionHeader, StatusBadge } from "@/components/ui/shared";
import { Plus, Search, MessageSquare, Paperclip, Send, CheckCircle, ArrowLeft } from "lucide-react";

interface Query {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in_progress" | "resolved";
  date: string;
  responses: { from: string; message: string; date: string }[];
}

const mockQueries: Query[] = [
  {
    id: "#1024", title: "Tuition fee payment not reflected", category: "Fees",
    description: "I made a payment of $980 via UPI on March 10, but the amount is not showing in my fee portal.",
    status: "pending", date: "Mar 15",
    responses: [],
  },
  {
    id: "#1021", title: "Lab attendance discrepancy", category: "Academics",
    description: "My Data Structures Lab attendance shows 22/28 but I have attended 25 sessions.",
    status: "in_progress", date: "Mar 12",
    responses: [
      { from: "Dr. Sharma", message: "I'm reviewing the attendance records. Will update within 48 hours.", date: "Mar 13" },
    ],
  },
  {
    id: "#1018", title: "Scholarship application status", category: "Scholarships",
    description: "I submitted my merit scholarship application on Feb 28. What is the current status?",
    status: "resolved", date: "Mar 8",
    responses: [
      { from: "Prof. Gupta", message: "Your application has been approved. The scholarship amount will be credited to your fee account by March 20.", date: "Mar 10" },
    ],
  },
];

const categories = ["Fees & Payments", "Examinations", "Admissions", "Scholarships", "Anti-Ragging", "Academics"];

const QueriesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [queries] = useState<Query[]>(mockQueries);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [filter, setFilter] = useState("all");
  const [showNewQuery, setShowNewQuery] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success">("idle");
  const [facultyResponse, setFacultyResponse] = useState("");

  const filteredQueries = filter === "all" ? queries : queries.filter(q => q.status === filter);

  const handleSubmitQuery = () => {
    if (!newCategory || !newTitle.trim() || !newDescription.trim()) return;
    setSubmitState("loading");
    setTimeout(() => {
      setSubmitState("success");
      setTimeout(() => {
        setShowNewQuery(false);
        setSubmitState("idle");
        setNewCategory("");
        setNewTitle("");
        setNewDescription("");
      }, 800);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">
          {user?.role === "faculty" ? "Student Queries" : "Queries"}
        </h1>
        {user?.role === "student" && (
          <button
            onClick={() => setShowNewQuery(true)}
            className="flex items-center gap-2 h-9 px-4 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:opacity-90 transition-opacity duration-150"
          >
            <Plus className="h-4 w-4" /> Raise Query
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-1">
        {["all", "pending", "in_progress", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-sm font-medium transition-colors duration-150 ${
              filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        {/* Query List */}
        <div className="bg-card rounded-lg shadow-surface divide-y divide-border/50">
          {filteredQueries.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedQuery(q)}
              className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                selectedQuery?.id === q.id ? "bg-primary/5" : "hover:bg-secondary/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{q.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{q.id} · {q.category} · {q.date}</p>
                </div>
                <StatusBadge status={q.status} />
              </div>
            </motion.div>
          ))}
          {filteredQueries.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No queries found.</div>
          )}
        </div>

        {/* Query Detail */}
        <AnimatePresence mode="wait">
          {selectedQuery ? (
            <motion.div
              key={selectedQuery.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-lg shadow-surface"
            >
              <div className="p-4 border-b border-border/50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold text-foreground">{selectedQuery.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedQuery.id} · {selectedQuery.category} · {selectedQuery.date}
                    </p>
                  </div>
                  <StatusBadge status={selectedQuery.status} />
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-foreground">{selectedQuery.description}</p>
                </div>

                {selectedQuery.responses.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Responses</p>
                    <div className="space-y-3">
                      {selectedQuery.responses.map((r, i) => (
                        <div key={i} className="bg-secondary/30 rounded-md p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-foreground">{r.from}</span>
                            <span className="text-xs text-muted-foreground">{r.date}</span>
                          </div>
                          <p className="text-sm text-foreground">{r.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Faculty response */}
                {user?.role === "faculty" && selectedQuery.status !== "resolved" && (
                  <div className="pt-2 border-t border-border/50">
                    <textarea
                      value={facultyResponse}
                      onChange={(e) => setFacultyResponse(e.target.value)}
                      placeholder="Type your response..."
                      className="w-full min-h-[120px] p-3 rounded-sm bg-background shadow-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150">
                        <Paperclip className="h-3.5 w-3.5" /> Attach file
                      </button>
                      <div className="flex gap-2">
                        <button className="h-8 px-3 text-xs font-medium text-foreground bg-secondary rounded-sm hover:bg-secondary/80 transition-colors duration-150">
                          Mark In Progress
                        </button>
                        <button className="h-8 px-3 text-xs font-medium bg-success text-success-foreground rounded-sm hover:opacity-90 transition-opacity duration-150 flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5" /> Resolve & Notify
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-card rounded-lg shadow-surface flex items-center justify-center p-12 text-muted-foreground text-sm">
              <MessageSquare className="h-5 w-5 mr-2" /> Select a query to view details
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* New Query Slide-over */}
      <AnimatePresence>
        {showNewQuery && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewQuery(false)}
              className="fixed inset-0 bg-foreground/20 z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-floating z-50 flex flex-col"
            >
              <div className="h-14 flex items-center gap-3 px-5 border-b border-border/50 flex-shrink-0">
                <button onClick={() => setShowNewQuery(false)} className="text-muted-foreground hover:text-foreground transition-colors duration-150">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="text-sm font-semibold text-foreground">Raise a Query</h2>
              </div>
              <div className="flex-1 p-5 space-y-4 overflow-auto">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat)}
                        className={`h-9 text-xs font-medium rounded-sm transition-all duration-150 ${
                          newCategory === cat
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Brief summary of your query"
                    className="w-full h-10 px-3 rounded-sm bg-background shadow-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Description</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide details about your query..."
                    className="w-full min-h-[120px] p-3 rounded-sm bg-background shadow-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150">
                  <Paperclip className="h-3.5 w-3.5" /> Attach file (optional)
                </button>
              </div>
              <div className="p-5 border-t border-border/50 flex-shrink-0">
                <button
                  onClick={handleSubmitQuery}
                  disabled={!newCategory || !newTitle.trim() || !newDescription.trim() || submitState !== "idle"}
                  className="w-full h-10 bg-primary text-primary-foreground rounded-sm font-medium hover:opacity-90 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitState === "idle" && <><Send className="h-4 w-4" /> Submit Query</>}
                  {submitState === "loading" && (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                  )}
                  {submitState === "success" && <><CheckCircle className="h-4 w-4" /> Query Submitted</>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QueriesPage;
