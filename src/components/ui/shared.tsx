import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatusBadgeProps {
  status: "pending" | "in_progress" | "resolved";
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = {
    pending: { label: "Pending", dotClass: "bg-warning animate-pulse-amber", textClass: "text-warning" },
    in_progress: { label: "In Progress", dotClass: "bg-primary", textClass: "text-primary" },
    resolved: { label: "Resolved", dotClass: "bg-success", textClass: "text-success" },
  };

  const { label, dotClass, textClass } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${textClass}`}>
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
}

export const StatCard = ({ title, value, subtitle, icon }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-lg shadow-surface p-4 hover-lift cursor-default"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-semibold text-foreground mt-1 tabular-nums">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {icon && <div className="text-muted-foreground">{icon}</div>}
    </div>
  </motion.div>
);

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
}

export const SectionHeader = ({ title, action }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    {action}
  </div>
);
