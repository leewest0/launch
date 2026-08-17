import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  count?: number;
}

export function SectionHeader({ icon: Icon, title, count }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {Icon && <Icon size={16} className="text-muted" />}
      <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
        {title}
      </h2>
      {typeof count === "number" && (
        <span className="text-xs text-muted">{count}</span>
      )}
    </div>
  );
}
