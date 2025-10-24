import { LayoutGrid, BarChart3, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewMode = "grid" | "bar" | "line";

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 border rounded-lg p-1">
      <Button
        variant={value === "grid" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => onChange("grid")}
        className="h-8 w-8"
        data-testid="button-view-grid"
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        variant={value === "bar" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => onChange("bar")}
        className="h-8 w-8"
        data-testid="button-view-bar"
      >
        <BarChart3 className="w-4 h-4" />
      </Button>
      <Button
        variant={value === "line" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => onChange("line")}
        className="h-8 w-8"
        data-testid="button-view-line"
      >
        <LineChart className="w-4 h-4" />
      </Button>
    </div>
  );
}
