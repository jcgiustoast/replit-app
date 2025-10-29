import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { Creative } from "@shared/schema";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CreativeDetailDialogProps {
  creative: Creative | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreativeDetailDialog({
  creative,
  open,
  onOpenChange,
}: CreativeDetailDialogProps) {

  // Mock data for video analysis chart
  const videoAnalysisData = [
    { time: "00:00", retention: 100, engagement: 95 },
    { time: "00:15", retention: 85, engagement: 88 },
    { time: "00:30", retention: 70, engagement: 75 },
    { time: "00:45", retention: 55, engagement: 60 },
    { time: "01:00", retention: 40, engagement: 45 },
  ];

  // Mock data for CTR last 30 days
  const ctrLast30DaysData = [
    { day: "1", ctr: 2.8 },
    { day: "3", ctr: 3.1 },
    { day: "5", ctr: 2.9 },
    { day: "7", ctr: 3.4 },
    { day: "9", ctr: 3.2 },
    { day: "11", ctr: 3.6 },
    { day: "13", ctr: 3.3 },
    { day: "15", ctr: 3.8 },
    { day: "17", ctr: 3.5 },
    { day: "19", ctr: 4.0 },
    { day: "21", ctr: 3.7 },
    { day: "23", ctr: 3.9 },
    { day: "25", ctr: 4.2 },
    { day: "27", ctr: 4.1 },
    { day: "29", ctr: 4.3 },
    { day: "30", ctr: 4.5 },
  ];

  // Mock data for placement breakdown
  const placementData = [
    { placement: "Feed", impressions: 19120, spend: 229 },
    { placement: "Stories", impressions: 14850, spend: 140 },
    { placement: "Reels", impressions: 22000, spend: 177 },
    { placement: "Marketplace", impressions: 18900, spend: 165 },
  ];

  const formatMetric = (metric: string, value: number) => {
    switch (metric) {
      case "spend":
      case "cpa":
        return `$${value.toFixed(0)}`;
      case "ctr":
        return `${value.toFixed(1)}%`;
      case "roas":
        return value.toFixed(1);
      default:
        return value.toString();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] p-0">
        {!creative ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">No se pudo cargar el creativo</p>
          </div>
        ) : (
          <div className="flex h-[90vh]">
            {/* Left column - Creative preview (fixed width, no scroll) */}
            <div className="w-[45%] p-6 border-r">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-xl mb-2" data-testid="text-creative-detail-title">
                  {creative.adName}
                </DialogTitle>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span data-testid="text-creative-campaign">
                    {creative.campaignName}
                  </span>
                  <span>•</span>
                  <span data-testid="text-creative-adset">
                    {creative.adSetName}
                  </span>
                  <span>•</span>
                  <span data-testid="text-creative-id">
                    #{creative.id}
                  </span>
                </div>
              </DialogHeader>

              <Card className="p-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                  <img
                    src={creative.thumbnail}
                    alt={creative.adName}
                    className="w-full h-full object-cover"
                    data-testid="img-creative-preview"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" data-testid="text-creative-preview-name">
                      Creative Preview
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {creative.campaignName}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-view-full">
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Ver completo
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right column - Analytics (scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Video Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Video analysis</h3>
                <Card className="p-4">
                  <h4 className="text-sm font-semibold mb-3">Video retention</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={videoAnalysisData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="retention"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={2}
                          name="Retention %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* CTR últimos 30 días */}
              <div>
                <h3 className="text-lg font-semibold mb-4">CTR en los últimos 30 días</h3>
                <Card className="p-4">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ctrLast30DaysData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="day" 
                          label={{ value: 'Día del mes', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          label={{ value: 'CTR (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(1)}%`, 'CTR']}
                          labelFormatter={(label) => `Día ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="ctr"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          name="CTR"
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Placement Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Placement breakdown</h3>
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium pb-2">
                      <span>Placement</span>
                      <span>Impressions</span>
                      <span>Spend</span>
                    </div>
                    {placementData.map((item) => (
                      <div
                        key={item.placement}
                        className="flex items-center justify-between py-2 border-t text-sm"
                      >
                        <span className="font-medium">{item.placement}</span>
                        <span className="text-muted-foreground">
                          {item.impressions.toLocaleString()}
                        </span>
                        <span className="font-semibold">
                          ${item.spend}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Gender & Age Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Gender & age breakdown</h3>
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm font-medium">Female 25-34</span>
                      <Badge variant="secondary">32%</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm font-medium">Male 25-34</span>
                      <Badge variant="secondary">28%</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm font-medium">Female 35-44</span>
                      <Badge variant="secondary">18%</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium">Male 35-44</span>
                      <Badge variant="secondary">22%</Badge>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Métricas Clave */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Métricas clave</h3>
                <Card className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Spend</p>
                      <p className="text-lg font-bold" data-testid="text-metric-spend">
                        {formatMetric("spend", creative.spend)}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">ROAS</p>
                      <p className="text-lg font-bold" data-testid="text-metric-roas">
                        {formatMetric("roas", creative.roas)}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">CTR</p>
                      <p className="text-lg font-bold" data-testid="text-metric-ctr">
                        {formatMetric("ctr", creative.ctr)}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">CPA</p>
                      <p className="text-lg font-bold" data-testid="text-metric-cpa">
                        {formatMetric("cpa", creative.cpa)}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
