import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/shared";
import { IndianRupee, CheckCircle, AlertCircle } from "lucide-react";

const feeStructure = [
  { category: "Tuition Fees", amount: 125000, paid: 75000, due: "Mar 31" },
  { category: "Security Deposit", amount: 15000, paid: 15000, due: "Paid" },
  { category: "Transport Fees", amount: 24000, paid: 24000, due: "Paid" },
  { category: "Hostel Fees", amount: 48000, paid: 24000, due: "Apr 15" },
  { category: "Examination Fees", amount: 8500, paid: 0, due: "Apr 30" },
  { category: "Miscellaneous", amount: 5000, paid: 5000, due: "Paid" },
];

const transactions = [
  { id: "TXN-2024-0891", date: "Mar 10", amount: 24000, category: "Hostel Fees", method: "UPI" },
  { id: "TXN-2024-0842", date: "Feb 28", amount: 37500, category: "Tuition Fees", method: "Card" },
  { id: "TXN-2024-0801", date: "Feb 15", amount: 37500, category: "Tuition Fees", method: "Bank Transfer" },
  { id: "TXN-2024-0756", date: "Jan 20", amount: 24000, category: "Transport Fees", method: "UPI" },
  { id: "TXN-2024-0712", date: "Jan 5", amount: 15000, category: "Security Deposit", method: "Card" },
];

const formatINR = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

const FinancePage = () => {
  const totalFees = feeStructure.reduce((a, b) => a + b.amount, 0);
  const totalPaid = feeStructure.reduce((a, b) => a + b.paid, 0);
  const totalDue = totalFees - totalPaid;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">Finance & Fees</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-lg shadow-surface p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Fees</p>
          <p className="text-2xl font-semibold text-foreground mt-1 tabular-nums">{formatINR(totalFees)}</p>
        </div>
        <div className="bg-card rounded-lg shadow-surface p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Paid</p>
          <p className="text-2xl font-semibold text-success mt-1 tabular-nums">{formatINR(totalPaid)}</p>
        </div>
        <div className="bg-card rounded-lg shadow-surface p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Due</p>
          <p className="text-2xl font-semibold text-warning mt-1 tabular-nums">{formatINR(totalDue)}</p>
        </div>
      </div>

      <div>
        <SectionHeader title="Fee Structure" />
        <div className="bg-card rounded-lg shadow-surface">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Category</span><span>Amount</span><span>Paid</span><span>Status</span>
          </div>
          {feeStructure.map((fee, i) => {
            const isPaid = fee.paid >= fee.amount;
            return (
              <motion.div
                key={fee.category}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 items-center border-t border-border/50 hover:bg-secondary/20 transition-colors duration-150"
              >
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{fee.category}</span>
                </div>
                <span className="text-sm tabular-nums text-foreground">{formatINR(fee.amount)}</span>
                <span className="text-sm tabular-nums text-foreground">{formatINR(fee.paid)}</span>
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${isPaid ? "text-success" : "text-warning"}`}>
                  {isPaid ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {fee.due}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div>
        <SectionHeader title="Recent Transactions" />
        <div className="bg-card rounded-lg shadow-surface divide-y divide-border/50">
          {transactions.map((txn, i) => (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/20 transition-colors duration-150"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{txn.category}</p>
                <p className="text-xs text-muted-foreground">{txn.id} · {txn.method}</p>
              </div>
              <span className="text-xs text-muted-foreground">{txn.date}</span>
              <span className="text-sm font-medium tabular-nums text-foreground">{formatINR(txn.amount)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
