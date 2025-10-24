import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { X } from "lucide-react";

interface MetricBadgeProps {
  label: string;
  color: string;
  onRemove?: () => void;
  tooltip?: string;
}

export function MetricBadge({ label, color, onRemove, tooltip }: MetricBadgeProps) {
  const badge = (
    <Badge
      variant="secondary"
      className="gap-2 pl-3 pr-2 py-1.5 hover-elevate"
      data-testid={`badge-metric-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 rounded-sm hover-elevate active-elevate-2"
          data-testid={`button-remove-${label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return badge;
}
