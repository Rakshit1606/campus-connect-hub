import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader, StatusBadge } from "@/components/ui/shared";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Loader2 } from "lucide-react";

interface AdminQuery {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in_progress" | "resolved";
  created_at: string;
  student_name: string;
  student_email: string;
  assigned_faculty_name: string | null;
}

const AdminQueriesPage = () => {
  const [queries, setQueries] = useState<AdminQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState<AdminQuery | null>(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("queries")
      .select(`
        id, title, description, category, status, created_at,
        student:profiles!queries_student_id_fkey(full_name, email),
        faculty:profiles!queries_assigned_faculty_id_fkey(full_name)
      `)
      .order("created_at", { ascending: false });

    const mapped: AdminQuery[] = (data || []).map((q: any) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      category: q.category,
      status: q.status,
      created_at: q.created_at,
      student_name: q.student?.full_name || "Unknown",
      student_email: q.student?.email || "",
      assigned_faculty_name: q.faculty?.full_name || null,
    }));
    setQueries(mapped);
    setLoading(false);
  };

  const updateStatus = async (queryId: string, status: string) => {
    await supabase.from("queries").update({ status }).eq("id", queryId);
    fetchQueries();
  };

  const filteredQueries = filter === "all" ? queries : queries.filter((q) => q.status === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">All Queries (Admin)</h1>

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
        <div className="bg-card rounded-lg shadow-surface divide-y divide-border/50">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredQueries.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">No queries found.</div>
          ) : (
            filteredQueries.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedQuery(q)}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                  selectedQuery?.id === q.id ? "bg-primary/5" : "hover:bg-secondary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{q.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {q.student_name} · {q.category} · {new Date(q.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </p>
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
              className="bg-card rounded-lg shadow-surface"
            >
              <div className="p-4 border-b border-border/50">
                <p className="text-base font-semibold text-foreground">{selectedQuery.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  From: {selectedQuery.student_name} ({selectedQuery.student_email})
                </p>
                <p className="text-xs text-muted-foreground">
                  Assigned: {selectedQuery.assigned_faculty_name || "Unassigned"}
                </p>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-foreground">{selectedQuery.description}</p>
                </div>
                <div className="flex gap-2 pt-2 border-t border-border/50">
                  {selectedQuery.status !== "in_progress" && (
                    <button
                      onClick={() => updateStatus(selectedQuery.id, "in_progress")}
                      className="h-8 px-3 text-xs font-medium text-foreground bg-secondary rounded-sm hover:bg-secondary/80 transition-colors duration-150"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {selectedQuery.status !== "resolved" && (
                    <button
                      onClick={() => updateStatus(selectedQuery.id, "resolved")}
                      className="h-8 px-3 text-xs font-medium bg-success text-success-foreground rounded-sm hover:opacity-90 transition-opacity duration-150"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-card rounded-lg shadow-surface flex items-center justify-center p-12 text-muted-foreground text-sm">
              <MessageSquare className="h-5 w-5 mr-2" /> Select a query to view details
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminQueriesPage;
