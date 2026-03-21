import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Severity = "info" | "low" | "medium" | "high" | "critical" | null | undefined;

interface SeverityBadgeProps {
  level: Severity;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function SeverityBadge({ level, className, size = "default" }: SeverityBadgeProps) {
  if (!level) return <Badge variant="outline" className={className}>Unknown</Badge>;

  const colors = {
    info: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50",
    low: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50",
    high: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50",
    critical: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-0.5 text-sm",
    lg: "px-4 py-1.5 text-base font-bold uppercase tracking-wider",
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium border shadow-sm",
        colors[level],
        sizes[size],
        className
      )}
    >
      {level.toUpperCase()}
    </Badge>
  );
}
