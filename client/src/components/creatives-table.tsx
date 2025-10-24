import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Creative } from "@shared/schema";

interface CreativesTableProps {
  creatives: Creative[];
  selectedMetrics: string[];
}

const METRIC_LABELS: Record<string, string> = {
  spend: "Spend",
  roas: "ROAS",
  cpa: "CPA",
  ctr: "CTR",
  frequency: "Frequency",
  convertScore: "Convert Score",
};

export function CreativesTable({ creatives, selectedMetrics }: CreativesTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const toggleAll = () => {
    if (selectedIds.size === creatives.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(creatives.map(c => c.id)));
    }
  };

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSort = (metric: string) => {
    if (sortBy === metric) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(metric);
      setSortOrder("desc");
    }
    console.log('Sorting by:', metric, sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedCreatives = [...creatives].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = a[sortBy as keyof Creative];
    const bVal = b[sortBy as keyof Creative];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const formatValue = (metric: string, value: number) => {
    switch (metric) {
      case "spend":
      case "cpa":
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "ctr":
        return `${value.toFixed(1)}%`;
      case "roas":
      case "frequency":
        return value.toFixed(1);
      case "convertScore":
        return value.toString();
      default:
        return value.toString();
    }
  };

  const allSelected = selectedIds.size === creatives.length && creatives.length > 0;
  const someSelected = selectedIds.size > 0 && selectedIds.size < creatives.length;

  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={toggleAll}
            aria-label="Select all"
            className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
            data-testid="checkbox-select-all"
          />
          <span className="text-sm font-medium">
            {selectedIds.size > 0 ? `${selectedIds.size} Ads selected` : "Select all"}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-[300px]">Creative</TableHead>
              {selectedMetrics.map((metric, index) => (
                <TableHead key={metric} className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort(metric)}
                    className="gap-1 hover-elevate -mx-3"
                    data-testid={`button-sort-${metric}`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded flex items-center justify-center text-xs font-semibold text-white bg-chart-${((index % 5) + 1)}`}>
                        {index + 1}
                      </div>
                      {METRIC_LABELS[metric]}
                    </span>
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCreatives.map((creative) => (
              <TableRow
                key={creative.id}
                className={selectedIds.has(creative.id) ? "bg-muted/50" : ""}
                data-testid={`row-creative-${creative.id}`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(creative.id)}
                    onCheckedChange={() => toggleRow(creative.id)}
                    aria-label={`Select ${creative.adName}`}
                    data-testid={`checkbox-creative-${creative.id}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={creative.thumbnail}
                      alt={creative.adName}
                      className="w-16 h-9 object-cover rounded"
                      data-testid="img-table-thumbnail"
                    />
                    <div>
                      <p className="font-medium text-sm" data-testid="text-table-ad-name">
                        {creative.adName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {creative.adSetName}
                      </p>
                    </div>
                  </div>
                </TableCell>
                {selectedMetrics.map((metric) => (
                  <TableCell key={metric} className="text-right font-medium tabular-nums" data-testid={`cell-${metric}`}>
                    {formatValue(metric, creative[metric as keyof Creative] as number)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
