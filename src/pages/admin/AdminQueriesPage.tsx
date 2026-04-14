import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatusBadge } from "@/components/ui/shared";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Loader2, UserCheck, Send } from "lucide-react";

interface FacultyOption {
  id: string;
  full_name: string;
}

interface AdminQuery {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in_progress" | "resolved";
  created_at: string;
  student_name: string;
  student_email: string;
  assigned_faculty_id: string | null;
  assigned_faculty_name: string | null;
}

const AdminQueriesPage = () => {
  const [queries, setQueries] = useState<AdminQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState<AdminQuery | null>(null);
  const [facultyList, setFacultyList] = useState<FacultyOption[]>([]);
  const [assignFacultyId, setAssignFacultyId] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchQueries();
    fetchFacultyList();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    const { data: queriesData, error } = await supabase
      .from("queries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching queries:", error);
      setLoading(false);
      return;
    }

    const userIds = new Set<string>();
    queriesData?.forEach((q: any) => {
      if (q.student_id) userIds.add(q.student_id);
      if (q.assigned_faculty_id) userIds.add(q.assigned_faculty_id);
    });

    let profilesData: any[] = [];
    if (userIds.size > 0) {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", Array.from(userIds));
      profilesData = data || [];
    }

    const mapped: AdminQuery[] = (queriesData || []).map((q: any) => {
      const student = profilesData.find((p) => p.id === q.student_id);
      const faculty = profilesData.find((p) => p.id === q.assigned_faculty_id);
      return {
        id: q.id,
        title: q.title,
        description: q.description,
        category: q.category,
        status: q.status,
        created_at: q.created_at,
        student_name: student?.full_name || "Unknown",
        student_email: student?.email || "",
        assigned_faculty_id: q.assigned_faculty_id,
        assigned_faculty_name: faculty?.full_name || null,
      };
    });
    setQueries(mapped);
    setLoading(false);
  };

  const fetchFacultyList = async () => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "faculty");

    if (!roles || roles.length === 0) return;

    const facultyIds = roles.map((r) => r.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", facultyIds);

    setFacultyList(
      (profiles || []).map((p) => ({ id: p.id, full_name: p.full_name }))
    );
  };

  const assignFaculty = async (queryId: string, facultyId: string) => {
    if (!facultyId) return;
    setAssigning(true);
    await supabase
      .from("queries")
      .update({ assigned_faculty_id: facultyId, status: "in_progress" })
      .eq("id", queryId);

    setAssigning(false);
    setAssignFacultyId("");
    await fetchQueries();
    // Update selected query
    setSelectedQuery((prev) => {
      if (!prev || prev.id !== queryId) return prev;
      const faculty = facultyList.find((f) => f.id === facultyId);
      return { ...prev, assigned_faculty_id: facultyId, assigned_faculty_name: faculty?.full_name || null, status: "in_progress" };
    });
  };

  const updateStatus = async (queryId: string, status: string) => {
    await supabase.from("queries").update({ status }).eq("id", queryId);
    fetchQueries();
  };

  const filteredQueries = filter === "all" ? queries : queries.filter((q) => q.status === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">All Queries</h1>

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
            {f !== "all" && (
              <span className="ml-1 opacity-60">
                ({queries.filter((q) => q.status === f).length})
              </span>
            )}
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
            <div className="text-center py-12 text-sm text-muted-foreground">No queries found.</div>
          ) : (
            filteredQueries.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  setSelectedQuery(q);
                  setAssignFacultyId(q.assigned_faculty_id || "");
                }}
                className={`px-5 py-3.5 cursor-pointer transition-colors duration-150 ${
                  selectedQuery?.id === q.id ? "bg-primary/5" : "hover:bg-muted/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{q.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {q.student_name} · {q.category} · {new Date(q.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </p>
                    {!q.assigned_faculty_name && (
                      <span className="text-xs text-destructive font-medium mt-0.5 inline-block">⚠ Unassigned</span>
                    )}
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
                <p className="text-base font-semibold text-foreground">{selectedQuery.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  From: <span className="font-medium text-foreground">{selectedQuery.student_name}</span> ({selectedQuery.student_email})
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Category: <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium ml-1">{selectedQuery.category}</span>
                </p>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedQuery.description}</p>
                </div>

                {/* Faculty Assignment */}
                <div className="p-4 bg-muted/30 rounded-lg border border-border/30">
                  <div className="flex items-center gap-2 mb-3">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Assign to Faculty</p>
                  </div>
                  {selectedQuery.assigned_faculty_name ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Currently: {selectedQuery.assigned_faculty_name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Reassign below if needed</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-destructive font-medium mb-2">No faculty assigned yet</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <select
                      value={assignFacultyId}
                      onChange={(e) => setAssignFacultyId(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select faculty member...</option>
                      {facultyList.map((f) => (
                        <option key={f.id} value={f.id}>{f.full_name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => assignFaculty(selectedQuery.id, assignFacultyId)}
                      disabled={!assignFacultyId || assigning}
                      className="h-9 px-4 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                    >
                      {assigning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      Assign
                    </button>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex gap-2 pt-3 border-t border-border/30">
                  {selectedQuery.status !== "in_progress" && (
                    <button
                      onClick={() => updateStatus(selectedQuery.id, "in_progress")}
                      className="h-9 px-4 text-xs font-medium text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {selectedQuery.status !== "resolved" && (
                    <button
                      onClick={() => updateStatus(selectedQuery.id, "resolved")}
                      className="h-9 px-4 text-xs font-medium bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-card rounded-xl shadow-surface border border-border/50 flex items-center justify-center p-12 text-muted-foreground text-sm">
              <MessageSquare className="h-5 w-5 mr-2" /> Select a query to view details & assign faculty
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminQueriesPage;
