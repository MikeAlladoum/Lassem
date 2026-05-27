import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
}

export function StatCard({ icon: Icon, label, value, color = "text-cyan-400" }: StatCardProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
      <Icon className={`w-8 h-8 ${color} mb-4`} />
      <p className="text-neutral-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
