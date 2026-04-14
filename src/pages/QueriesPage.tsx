import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge } from "@/components/ui/shared";
import { supabase } from "@/lib/supabase";
import { Plus, MessageSquare, Paperclip, Send, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";

interface QueryResponse {
  id: string;
  message: string;
  created_at: string;
  responder: { full_name: string } | null;
}

interface Query {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in_progress" | "resolved";
  created_at: string;
  responses: QueryResponse[];
}

const categories = ["Fees & Payments", "Examinations", "Admissions", "Scholarships", "Anti-Ragging", "Academics"];

const QueriesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [filter, setFilter] = useState("all");
  const [showNewQuery, setShowNewQuery] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success">("idle");
  const [facultyResponse, setFacultyResponse] = useState("");

  useEffect(() => {
    fetchQueries();
  }, [user]);

  const fetchQueries = async () => {
    if (!user) return;
    setLoading(true);

    let query = supabase
      .from("queries")
      .select("id, title, description, category, status, created_at")
      .order("created_at", { ascending: false });

    if (user.role === "student") {
      query = query.eq("student_id", user.id);
    } else if (user.role === "faculty") {
      query = query.eq("assigned_faculty_id", user.id);
    }

    const { data } = await query;

    const mapped: Query[] = await Promise.all(
      (data || []).map(async (q: any) => {
        const { data: responses } = await supabase
          .from("query_responses")
          .select("id, message, created_at, responder:profiles!query_responses_responder_id_fkey(full_name)")
          .eq("query_id", q.id)
          .order("created_at", { ascending: true });

        return {
          ...q,
          responses: (responses || []).map((r: any) => ({
            id: r.id,
            message: r.message,
            created_at: r.created_at,
            responder: r.responder,
          })),
        };
      })
    );

    setQueries(mapped);
    setLoading(false);
  };

  const filteredQueries = filter === "all" ? queries : queries.filter(q => q.status === filter);

  const handleSubmitQuery = async () => {
    if (!newCategory || !newTitle.trim() || !newDescription.trim() || !user) return;
    setSubmitState("loading");

    const { error } = await supabase.from("queries").insert({
      student_id: user.id,
      category: newCategory,
      title: newTitle.trim(),
      description: newDescription.trim(),
      status: "pending",
    });

    if (error) {
      console.error("Error submitting query:", error);
      setSubmitState("idle");
      return;
    }

    setSubmitState("success");
    setTimeout(() => {
      setShowNewQuery(false);
      setSubmitState("idle");
      setNewCategory("");
      setNewTitle("");
      setNewDescription("");
      fetchQueries();
    }, 800);
  };

  const handleFacultyResponse = async () => {
    if (!facultyResponse.trim() || !selectedQuery || !user) return;

    await supabase.from("query_responses").insert({
      query_id: selectedQuery.id,
      responder_id: user.id,
      message: facultyResponse.trim(),
    });

    setFacultyResponse("");
    fetchQueries();
  };

  const handleStatusUpdate = async (queryId: string, status: string) => {
    await supabase.from("queries").update({ status }).eq("id", queryId);
    fetchQueries();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">
          {user?.role === "faculty" ? "Assigned Queries" : "My Queries"}
        </h1>
        {user?.role === "student" && (
          <button
            onClick={() => setShowNewQuery(true)}
            className="flex items-center gap-2 h-9 px-4 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-150 shadow-md"
          >
            <Plus className="h-4 w-4" /> Raise Query
          </button>
        )}
      </div>

      <div className="flex gap-1">
        {["all", "pending", "in_progress", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors duration-150 ${
              filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        <div className="bg-card rounded-xl shadow-surface border border-border/50 divide-y divide-border/30">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredQueries.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">No queries found.</div>
          ) : (
            filteredQueries.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedQuery(q)}
                className={`px-5 py-3.5 cursor-pointer transition-colors duration-150 ${
                  selectedQuery?.id === q.id ? "bg-primary/5" : "hover:bg-muted/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{q.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{q.category} · {new Date(q.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
              </motion.div>
            ))
          )}
        </div>

        <AnimatePresence mode="wait">
          {selectedQuery ? (
            <motion.div
              key={selectedQuery.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-xl shadow-surface border border-border/50"
            >
              <div className="p-5 border-b border-border/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold text-foreground">{selectedQuery.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedQuery.category} · {new Date(selectedQuery.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <StatusBadge status={selectedQuery.status} />
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedQuery.description}</p>
                </div>

                {selectedQuery.responses.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Responses</p>
                    <div className="space-y-3">
                      {selectedQuery.responses.map((r) => (
                        <div key={r.id} className="bg-muted/30 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-foreground">{r.responder?.full_name || "Unknown"}</span>
                            <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                          </div>
                          <p className="text-sm text-foreground">{r.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {user?.role === "faculty" && selectedQuery.status !== "resolved" && (
                  <div className="pt-3 border-t border-border/30">
                    <textarea
                      value={facultyResponse}
                      onChange={(e) => setFacultyResponse(e.target.value)}
                      placeholder="Type your response..."
                      className="w-full min-h-[100px] p-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                    <div className="flex items-center justify-end gap-2 mt-3">
                      <button
                        onClick={() => handleStatusUpdate(selectedQuery.id, selectedQuery.status === "pending" ? "in_progress" : "resolved")}
                        className="h-8 px-3 text-xs font-medium text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        {selectedQuery.status === "pending" ? "Mark In Progress" : "Mark Resolved"}
                      </button>
                      <button
                        onClick={handleFacultyResponse}
                        disabled={!facultyResponse.trim()}
                        className="h-8 px-3 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-1 disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5" /> Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-card rounded-xl shadow-surface border border-border/50 flex items-center justify-center p-12 text-muted-foreground text-sm">
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
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-floating z-50 flex flex-col"
            >
              <div className="h-16 flex items-center gap-3 px-5 border-b border-border/50 flex-shrink-0">
                <button onClick={() => setShowNewQuery(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="text-sm font-semibold text-foreground">Raise a Query</h2>
              </div>
              <div className="flex-1 p-5 space-y-5 overflow-auto">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat)}
                        className={`h-10 text-xs font-medium rounded-lg transition-all duration-150 border ${
                          newCategory === cat
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-foreground border-border hover:border-primary/50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Brief summary of your query"
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Description</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide details about your query..."
                    className="w-full min-h-[120px] p-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
              </div>
              <div className="p-5 border-t border-border/50 flex-shrink-0">
                <button
                  onClick={handleSubmitQuery}
                  disabled={!newCategory || !newTitle.trim() || !newDescription.trim() || submitState !== "idle"}
                  className="w-full h-11 gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {submitState === "idle" && <><Send className="h-4 w-4" /> Submit Query</>}
                  {submitState === "loading" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {submitState === "success" && <><CheckCircle className="h-4 w-4" /> Query Submitted!</>}
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
