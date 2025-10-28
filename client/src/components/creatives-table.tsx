import { useState, useEffect } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import type { Creative } from "@shared/schema";

interface CreativesTableProps {
  creatives: Creative[];
  selectedMetrics: string[];
  onRowClick?: (creative: Creative) => void;
}

const ITEMS_PER_PAGE = 8;

const METRIC_LABELS: Record<string, string> = {
  spend: "Spend",
  roas: "ROAS",
  cpa: "CPA",
  ctr: "CTR",
  frequency: "Frequency",
  convertScore: "Convert Score",
  videoViews: "Video Views",
  impressions: "Impressions",
  conversions: "Conversions",
  costPerConversion: "Cost per Conversion",
  cpm: "CPM",
};

export function CreativesTable({ creatives, selectedMetrics, onRowClick }: CreativesTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const sortedCreatives = [...creatives].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = a[sortBy as keyof Creative];
    const bVal = b[sortBy as keyof Creative];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedCreatives.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCreatives = sortedCreatives.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleAll = () => {
    const currentPageIds = paginatedCreatives.map(c => c.id);
    const allCurrentPageSelected = currentPageIds.every(id => selectedIds.has(id));
    
    const newSelected = new Set(selectedIds);
    if (allCurrentPageSelected) {
      currentPageIds.forEach(id => newSelected.delete(id));
    } else {
      currentPageIds.forEach(id => newSelected.add(id));
    }
    setSelectedIds(newSelected);
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
    setCurrentPage(1);
  };

  const formatValue = (metric: string, value: number | undefined) => {
    if (value === undefined || value === null) {
      return "—";
    }
    switch (metric) {
      case "spend":
      case "cpa":
      case "costPerConversion":
      case "cpm":
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
      case "videoViews":
      case "impressions":
      case "conversions":
        return value.toString();
      default:
        return value.toString();
    }
  };

  const currentPageIds = paginatedCreatives.map(c => c.id);
  const allCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every(id => selectedIds.has(id));
  const someCurrentPageSelected = currentPageIds.some(id => selectedIds.has(id)) && !allCurrentPageSelected;
  
  const checkboxState = allCurrentPageSelected ? true : (someCurrentPageSelected ? "indeterminate" : false);

  return (
    <div className="border rounded-lg mb-8">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={checkboxState}
            onCheckedChange={toggleAll}
            aria-label="Select all"
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
            {paginatedCreatives.map((creative) => (
              <TableRow
                key={creative.id}
                className={`${selectedIds.has(creative.id) ? "bg-muted/50" : ""} ${onRowClick ? "cursor-pointer hover-elevate" : ""}`}
                data-testid={`row-creative-${creative.id}`}
                onClick={() => onRowClick?.(creative)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
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

      {totalPages > 1 && (
        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    if (currentPage === 1) {
                      e.preventDefault();
                      return;
                    }
                    setCurrentPage(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  data-testid="button-previous-page"
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                if (!showPage) return null;

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                      data-testid={`button-page-${page}`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    if (currentPage === totalPages) {
                      e.preventDefault();
                      return;
                    }
                    setCurrentPage(currentPage + 1);
                  }}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  data-testid="button-next-page"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
