import { cn } from "@/lib/utils";
import type { VideoStatus, PublicationStatus } from "@/types";

const statusConfig: Record<
  VideoStatus | PublicationStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  published: {
    label: "Publiée",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  error: {
    label: "Erreur",
    className: "bg-red-50 text-red-700 ring-red-600/20",
  },
  partial: {
    label: "Partielle",
    className: "bg-orange-50 text-orange-700 ring-orange-600/20",
  },
  scheduled: {
    label: "Planifiée",
    className: "bg-blue-50 text-blue-700 ring-blue-600/20",
  },
};

interface BadgeProps {
  status: VideoStatus | PublicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
