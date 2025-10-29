import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreativeDetailDialog } from "./creative-detail-dialog";
import type { Creative } from "@shared/schema";

interface InsightDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insight: {
    id: string;
    title: string;
    description: string;
    ads: string[];
    priority: string;
  };
}

const AVAILABLE_METRICS = [
  { id: "spend", label: "Spend", color: "blue" },
  { id: "roas", label: "ROAS", color: "green" },
  { id: "cpa", label: "CPA", color: "purple" },
  { id: "ctr", label: "CTR", color: "orange" },
  { id: "frequency", label: "Frequency", color: "pink" },
  { id: "convert_score", label: "Convert Score", color: "yellow" },
];

export function InsightDetailDialog({
  open,
  onOpenChange,
  insight,
}: InsightDetailDialogProps) {
  // Default metrics based on insight type
  const defaultMetrics = useMemo(() => {
    if (insight.title.toLowerCase().includes("hook")) {
      return ["spend", "ctr", "convert_score"];
    } else if (insight.title.toLowerCase().includes("hold")) {
      return ["spend", "frequency", "ctr"];
    } else if (insight.title.toLowerCase().includes("performance")) {
      return ["spend", "roas", "cpa"];
    }
    return ["spend", "roas", "cpa"];
  }, [insight.id, insight.title]);

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(defaultMetrics);
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [isCreativeDialogOpen, setIsCreativeDialogOpen] = useState(false);

  // Reset metrics and state when insight changes
  useEffect(() => {
    setSelectedMetrics(defaultMetrics);
    setSelectedCreative(null);
    setIsCreativeDialogOpen(false);
  }, [insight.id, defaultMetrics]);

  const { data: creatives = [] } = useQuery<Creative[]>({
    queryKey: ["/api/creatives"],
  });

  // Filter creatives based on insight's ads list
  // If no matches found, show first few creatives as examples
  const insightCreatives = useMemo(() => {
    if (!insight.ads || insight.ads.length === 0) {
      return creatives.slice(0, 5);
    }

    const filtered = creatives.filter((creative) =>
      insight.ads.some((adName) => 
        creative.adName.toLowerCase().includes(adName.toLowerCase()) || 
        adName.toLowerCase().includes(creative.adName.toLowerCase())
      )
    );
    
    // If no matches, show first 5 creatives as examples
    if (filtered.length === 0 && creatives.length > 0) {
      return creatives.slice(0, 5);
    }
    
    return filtered;
  }, [insight.ads, creatives]);

  const handleAddMetric = (metricId: string) => {
    if (!selectedMetrics.includes(metricId)) {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  const handleRemoveMetric = (metricId: string) => {
    setSelectedMetrics(selectedMetrics.filter((m) => m !== metricId));
  };

  const handleCreativeClick = (creative: Creative, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedCreative(creative);
    setIsCreativeDialogOpen(true);
  };

  const getMetricValue = (creative: Creative, metricId: string) => {
    switch (metricId) {
      case "spend":
        return `$${creative.spend.toLocaleString()}`;
      case "roas":
        return creative.roas.toFixed(1);
      case "cpa":
        return `$${creative.cpa}`;
      case "ctr":
        return `${creative.ctr}%`;
      case "frequency":
        return creative.frequency.toFixed(2);
      case "convert_score":
        return creative.convertScore;
      default:
        return "-";
    }
  };

  const getMetricLabel = (metricId: string) => {
    return AVAILABLE_METRICS.find((m) => m.id === metricId)?.label || metricId;
  };

  const getMetricColor = (metricId: string) => {
    return AVAILABLE_METRICS.find((m) => m.id === metricId)?.color || "blue";
  };

  const availableMetricsToAdd = AVAILABLE_METRICS.filter(
    (metric) => !selectedMetrics.includes(metric.id)
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>{insight.title}</span>
              <Badge variant={insight.priority === "high" ? "destructive" : "secondary"}>
                Prioridad {insight.priority === "high" ? "Alta" : insight.priority === "medium" ? "Media" : "Baja"}
              </Badge>
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {insight.description}
            </p>
          </DialogHeader>

          {/* Metrics Selector */}
          <div className="flex flex-wrap items-center gap-2 py-4 border-t border-b">
            <span className="text-sm font-medium mr-2">Métricas:</span>
            {selectedMetrics.map((metricId) => (
              <Badge
                key={metricId}
                variant="secondary"
                className="gap-1"
                data-testid={`badge-metric-${metricId}`}
              >
                <span className={`w-2 h-2 rounded-full bg-${getMetricColor(metricId)}-500`} />
                {getMetricLabel(metricId)}
                <button
                  onClick={() => handleRemoveMetric(metricId)}
                  className="ml-1 hover:text-destructive"
                  data-testid={`button-remove-metric-${metricId}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}

            {availableMetricsToAdd.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 h-6 text-xs"
                    data-testid="button-add-metric"
                  >
                    <Plus className="w-3 h-3" />
                    Agregar métrica
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {availableMetricsToAdd.map((metric) => (
                    <DropdownMenuItem
                      key={metric.id}
                      onClick={() => handleAddMetric(metric.id)}
                      data-testid={`menuitem-${metric.id}`}
                    >
                      <span className={`w-2 h-2 rounded-full bg-${metric.color}-500 mr-2`} />
                      {metric.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Ads Table */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-3">
              Anuncios a optimizar ({insightCreatives.length})
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full" data-testid="table-insight-ads">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Anuncio</th>
                    {selectedMetrics.map((metricId) => (
                      <th key={metricId} className="text-right p-3 text-sm font-medium">
                        {getMetricLabel(metricId)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {insightCreatives.length === 0 ? (
                    <tr>
                      <td
                        colSpan={selectedMetrics.length + 1}
                        className="p-6 text-center text-muted-foreground"
                      >
                        No se encontraron anuncios relacionados
                      </td>
                    </tr>
                  ) : (
                    insightCreatives.map((creative) => (
                      <tr
                        key={creative.id}
                        className="border-t cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={(e) => handleCreativeClick(creative, e)}
                        data-testid={`row-creative-${creative.id}`}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={creative.thumbnail}
                              alt={creative.adName}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-sm">{creative.adName}</p>
                              <p className="text-xs text-muted-foreground">
                                {creative.campaignName}
                              </p>
                            </div>
                          </div>
                        </td>
                        {selectedMetrics.map((metricId) => (
                          <td
                            key={metricId}
                            className="p-3 text-right text-sm tabular-nums"
                            data-testid={`cell-${metricId}-${creative.id}`}
                          >
                            {getMetricValue(creative, metricId)}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedCreative && (
        <CreativeDetailDialog
          open={isCreativeDialogOpen}
          onOpenChange={setIsCreativeDialogOpen}
          creative={selectedCreative}
        />
      )}
    </>
  );
}
