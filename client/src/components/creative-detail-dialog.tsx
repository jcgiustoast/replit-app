import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ExternalLink } from "lucide-react";
import type { Creative } from "@shared/schema";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        {!creative ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">No se pudo cargar el creativo</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
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
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  data-testid="button-close-dialog"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Left column - Creative preview */}
          <div className="space-y-4">
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

            {/* Key metrics */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Métricas clave</h3>
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

          {/* Right column - Analytics */}
          <div className="space-y-4">
            <Tabs defaultValue="video" className="w-full">
              <TabsList className="grid w-full grid-cols-2" data-testid="tabs-analytics">
                <TabsTrigger value="video" data-testid="tab-video-analysis">
                  Video analysis
                </TabsTrigger>
                <TabsTrigger value="audience" data-testid="tab-audience-retention">
                  Audience retention
                </TabsTrigger>
              </TabsList>
              <TabsContent value="video" className="space-y-4">
                <Card className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Video retention</h3>
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

                <Card className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Placement breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium">
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
              </TabsContent>
              <TabsContent value="audience" className="space-y-4">
                <Card className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Audience engagement over time</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={videoAnalysisData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="engagement"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          name="Engagement %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Gender & age breakdown</h3>
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
