import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/shared";
import { supabase } from "@/lib/supabase";
import { IndianRupee, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface FeeStructure {
  id: string;
  category: string;
  amount: number;
  due_date: string;
}

interface StudentFee {
  id: string;
  student_name: string;
  student_email: string;
  category: string;
  amount: number;
  paid_amount: number;
  status: string;
}

const AdminFeesPage = () => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setLoading(true);
    const { data } = await supabase.from("fee_structures").select("*").order("category");
    setFeeStructures(data || []);
    setLoading(false);
  };

  const formatINR = (amount: number) =>
    `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;

  const totalFees = feeStructures.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Fee Management</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-lg shadow-surface p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Fee Structure</p>
          <p className="text-2xl font-semibold text-foreground mt-1 tabular-nums">{formatINR(totalFees)}</p>
        </div>
        <div className="bg-card rounded-lg shadow-surface p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Categories</p>
          <p className="text-2xl font-semibold text-foreground mt-1 tabular-nums">{feeStructures.length}</p>
        </div>
        <div className="bg-card rounded-lg shadow-surface p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Academic Year</p>
          <p className="text-2xl font-semibold text-foreground mt-1">2024-25</p>
        </div>
      </div>

      {/* Fee Structure Table */}
      <div>
        <SectionHeader title="Fee Structure" />
        <div className="bg-card rounded-lg shadow-surface">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Category</span><span>Amount</span><span>Due Date</span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : feeStructures.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              No fee structures found. Add them in your Supabase database.
            </div>
          ) : (
            feeStructures.map((fee, i) => (
              <motion.div
                key={fee.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 items-center border-t border-border/50 hover:bg-secondary/20 transition-colors duration-150"
              >
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{fee.category}</span>
                </div>
                <span className="text-sm tabular-nums text-foreground">{formatINR(fee.amount)}</span>
                <span className="text-xs text-muted-foreground">{fee.due_date}</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeesPage;
