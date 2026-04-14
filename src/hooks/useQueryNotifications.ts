import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export const useQueryNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Only set up notifications for faculty members
    if (!user || user.role !== "faculty") return;

    const channel = supabase
      .channel("query_assignments")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "queries",
        },
        (payload) => {
          const oldRecord = payload.old;
          const newRecord = payload.new;

          // Check if this query was just assigned to the current faculty
          if (
            newRecord.assigned_faculty_id === user.id &&
            oldRecord.assigned_faculty_id !== user.id
          ) {
            toast.success("New Query Assigned", {
              description: `A query regarding "${newRecord.category}" has just been assigned to you.`,
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
};
