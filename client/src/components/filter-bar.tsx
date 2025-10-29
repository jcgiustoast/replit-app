import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { MetricBadge } from "./metric-badge";
import { AdvancedFilters, type AdvancedFilter } from "./advanced-filters";

interface FilterBarProps {
  onDateRangeChange?: (range: string) => void;
  onBreakdownChange?: (breakdown: string) => void;
  onMetricsChange?: (metrics: string[]) => void;
  onFiltersChange?: (filters: AdvancedFilter[]) => void;
  initialFilters?: AdvancedFilter[];
}

const METRIC_OPTIONS = [
  { value: "spend", label: "Spend", color: "bg-chart-1", tooltip: "Total amount spent on ads" },
  { value: "roas", label: "ROAS", color: "bg-chart-2", tooltip: "Return on Ad Spend" },
  { value: "cpa", label: "CPA", color: "bg-chart-3", tooltip: "Cost Per Acquisition" },
  { value: "ctr", label: "CTR", color: "bg-chart-4", tooltip: "Click-Through Rate" },
  { value: "frequency", label: "Frequency", color: "bg-chart-5", tooltip: "Average impressions per user" },
  { value: "convertScore", label: "Convert score", color: "bg-chart-1", tooltip: "Conversion performance score" },
];

export function FilterBar({ onDateRangeChange, onBreakdownChange, onMetricsChange, onFiltersChange, initialFilters = [] }: FilterBarProps) {
  const [dateRange, setDateRange] = useState("14");
  const [breakdown, setBreakdown] = useState("adName");
  const [selectedMetrics, setSelectedMetrics] = useState(["spend", "roas", "cpa", "convertScore"]);
  const [customDateFrom, setCustomDateFrom] = useState<Date>();
  const [customDateTo, setCustomDateTo] = useState<Date>();
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilter[]>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    if (value !== "custom") {
      setShowCustomDate(false);
      onDateRangeChange?.(value);
    } else {
      setShowCustomDate(true);
    }
  };

  const handleBreakdownChange = (value: string) => {
    setBreakdown(value);
    onBreakdownChange?.(value);
    console.log('Breakdown changed to:', value);
  };

  const handleRemoveMetric = (metric: string) => {
    const newMetrics = selectedMetrics.filter(m => m !== metric);
    setSelectedMetrics(newMetrics);
    onMetricsChange?.(newMetrics);
    console.log('Metric removed:', metric);
  };

  const handleAddMetric = (metric: string) => {
    if (!selectedMetrics.includes(metric)) {
      const newMetrics = [...selectedMetrics, metric];
      setSelectedMetrics(newMetrics);
      onMetricsChange?.(newMetrics);
      console.log('Metric added:', metric);
    }
  };

  const handleFiltersChange = (newFilters: AdvancedFilter[]) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
    console.log('Filters changed:', newFilters);
  };

  const availableMetrics = METRIC_OPTIONS.filter(m => !selectedMetrics.includes(m.value));

  return (
    <div className="space-y-4">
      {/* Primera fila: Date range, Group by, filtros aplicados + Add filter button */}
      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2" data-testid="button-date-range">
              <CalendarIcon className="w-4 h-4" />
              <span>
                {dateRange === "custom" && customDateFrom && customDateTo
                  ? `${format(customDateFrom, "MMM d")} - ${format(customDateTo, "MMM d")}`
                  : `Last ${dateRange} days`}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-2 space-y-2 border-b">
              <Button
                variant={dateRange === "7" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleDateRangeChange("7")}
                data-testid="button-7-days"
              >
                Last 7 days
              </Button>
              <Button
                variant={dateRange === "14" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleDateRangeChange("14")}
                data-testid="button-14-days"
              >
                Last 14 days
              </Button>
              <Button
                variant={dateRange === "30" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleDateRangeChange("30")}
                data-testid="button-30-days"
              >
                Last 30 days
              </Button>
              <Button
                variant={dateRange === "custom" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleDateRangeChange("custom")}
                data-testid="button-custom-range"
              >
                Custom range
              </Button>
            </div>
            {showCustomDate && (
              <div className="p-2">
                <Calendar
                  mode="range"
                  selected={{ from: customDateFrom, to: customDateTo }}
                  onSelect={(range) => {
                    setCustomDateFrom(range?.from);
                    setCustomDateTo(range?.to);
                    if (range?.from && range?.to) {
                      onDateRangeChange?.('custom');
                    }
                  }}
                  numberOfMonths={2}
                  data-testid="calendar-custom-range"
                />
              </div>
            )}
          </PopoverContent>
        </Popover>

        <Select value={breakdown} onValueChange={handleBreakdownChange}>
          <SelectTrigger className="w-[200px]" data-testid="select-breakdown">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adName">Group by Ad name</SelectItem>
            <SelectItem value="adSetName">Group by Ad set name</SelectItem>
            <SelectItem value="campaignName">Group by Campaign name</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtros aplicados como badges inline */}
        <AdvancedFilters filters={filters} onChange={handleFiltersChange} inline />
      </div>

      {/* Segunda fila: Métricas seleccionadas + Add metric */}
      <div className="flex flex-wrap items-center gap-2">
        {selectedMetrics.map((metricValue) => {
          const metric = METRIC_OPTIONS.find(m => m.value === metricValue);
          if (!metric) return null;
          return (
            <MetricBadge
              key={metric.value}
              label={metric.label}
              color={metric.color}
              onRemove={() => handleRemoveMetric(metric.value)}
              tooltip={metric.tooltip}
            />
          );
        })}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-7" data-testid="button-add-metric">
              <Plus className="w-3 h-3" />
              Add metric
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="space-y-1">
              {availableMetrics.map((metric) => (
                <Button
                  key={metric.value}
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => handleAddMetric(metric.value)}
                  data-testid={`button-add-${metric.value}`}
                >
                  <div className={`w-2 h-2 rounded-full ${metric.color}`} />
                  {metric.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
