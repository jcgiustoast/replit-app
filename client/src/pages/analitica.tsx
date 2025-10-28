import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart2, TrendingUp, Target, Zap, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function AnalyticsPage() {
  // Mock data for creative formats
  const formatData = [
    { name: "BANNER", value: 54.0, count: 24 },
    { name: "VIDEO", value: 45.9, count: 20 },
    { name: "CARROUSEL", value: 0.1, count: 1 },
  ];

  // Mock data for funnel stages
  const funnelData = [
    { name: "ToFu", value: 45, count: 18 },
    { name: "MoFu", value: 35, count: 14 },
    { name: "BoFu", value: 20, count: 8 },
  ];

  // Chart colors
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

  // Mock key metrics
  const avgSpendPerAd = 87542;
  const adConcentration = 68;
  const adsEvergreen = 42;

  // Mock account health score (0-100)
  const healthScore = 75; // Good: 70-100, Average: 40-69, Poor: 0-39

  const getHealthStatus = (score: number) => {
    if (score >= 70) return { label: "Bien", color: "text-chart-2", bgColor: "bg-chart-2/10", icon: CheckCircle2 };
    if (score >= 40) return { label: "Promedio", color: "text-chart-4", bgColor: "bg-chart-4/10", icon: AlertCircle };
    return { label: "Necesita Atención", color: "text-destructive", bgColor: "bg-destructive/10", icon: AlertCircle };
  };

  const healthStatus = getHealthStatus(healthScore);
  const HealthIcon = healthStatus.icon;

  // Mock insights
  const insights = [
    {
      id: "1",
      type: "optimization",
      title: "Optimizar el hook rate",
      description: "Estos 3 anuncios tienen un hook rate bajo del 15%",
      ads: ["Static | Hybrid Deep Pans", "Static | Value Messaging", "Static | Nonstick Messaging"],
      priority: "high",
    },
    {
      id: "2",
      type: "optimization",
      title: "Optimizar hold rate",
      description: "5 anuncios tienen hold rate inferior al 40%",
      ads: ["Video | Cooking Demo", "Video | Gordon Dutch Oven", "Video | Product Testimonial", "Video | Lifestyle Content", "Static | Complete Set"],
      priority: "high",
    },
    {
      id: "3",
      type: "scale",
      title: "Repetir estructuras o variaciones",
      description: "Estos 5 anuncios tienen el mejor performance (top spend y ROAS)",
      ads: ["Video | Gordon Dutch Oven", "Static | Premium Quality", "Static | Complete Set", "Static | Limited Time Offer", "Video | Cooking Demo"],
      priority: "medium",
    },
    {
      id: "4",
      type: "diversify",
      title: "Diversificar formatos creativos",
      description: "Solo 0.1% de creativos son carruseles. Considera crear más contenido en este formato.",
      priority: "low",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Alta";
      case "medium": return "Media";
      case "low": return "Baja";
      default: return "";
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-5 h-5 text-chart-1" />
            <h1 className="text-2xl font-semibold" data-testid="text-page-title">Analítica</h1>
          </div>
          <p className="text-sm text-muted-foreground" data-testid="text-page-description">
            Análisis profundo del rendimiento de tu cuenta publicitaria
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-chart-1/10">
                <TrendingUp className="w-5 h-5 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gasto promedio por anuncio</p>
              </div>
            </div>
            <p className="text-3xl font-bold tabular-nums" data-testid="text-avg-spend">
              ${avgSpendPerAd.toLocaleString()}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-chart-2/10">
                <Target className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ad Concentration</p>
              </div>
            </div>
            <p className="text-3xl font-bold tabular-nums" data-testid="text-ad-concentration">
              {adConcentration}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {adConcentration}% del gasto en top 20% de anuncios
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-chart-3/10">
                <Zap className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ads Evergreen</p>
              </div>
            </div>
            <p className="text-3xl font-bold tabular-nums" data-testid="text-ads-evergreen">
              {adsEvergreen}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Anuncios activos más de 30 días
            </p>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Formato de Creativos Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6" data-testid="text-format-title">
              Gasto y Fracturación
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formatData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
                >
                  {formatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {formatData.map((format, index) => (
                <div key={format.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span>{format.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{format.count} anuncios</span>
                    <span className="font-semibold">{format.value.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Funnel Stages Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6" data-testid="text-funnel-title">
              Distribución por Etapa del Funnel
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={funnelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {funnelData.map((stage, index) => (
                <div key={stage.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span>{stage.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{stage.count} anuncios</span>
                    <span className="font-semibold">{stage.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Account Health Score */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6" data-testid="text-health-title">
            Salud de la Cuenta
          </h3>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              {/* Health thermometer visualization */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-8 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          healthScore >= 70 ? 'bg-chart-2' : healthScore >= 40 ? 'bg-chart-4' : 'bg-destructive'
                        }`}
                        style={{ width: `${healthScore}%` }}
                        data-testid="progress-health-score"
                      />
                    </div>                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold tabular-nums" data-testid="text-health-score">
                      {healthScore}
                    </p>
                    <p className="text-xs text-muted-foreground">de 100</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 p-4 rounded-lg ${healthStatus.bgColor}`}>
                  <HealthIcon className={`w-5 h-5 ${healthStatus.color}`} />
                  <span className={`font-semibold ${healthStatus.color}`} data-testid="text-health-status">
                    Estado: {healthStatus.label}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-3 text-sm">
                <h4 className="font-semibold mb-3">Factores evaluados:</h4>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Diversificación de formatos</span>
                  <Badge variant="secondary">85/100</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Distribución de presupuesto</span>
                  <Badge variant="secondary">70/100</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Performance promedio</span>
                  <Badge variant="secondary">78/100</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Longevidad de creativos</span>
                  <Badge variant="secondary">68/100</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Actionable Insights */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold" data-testid="text-insights-title">
                Insights Accionables
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Recomendaciones basadas en el análisis de tus reportes
              </p>
            </div>
            <Badge variant="secondary" data-testid="badge-insights-count">
              {insights.length} recomendaciones
            </Badge>
          </div>

          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 border rounded-lg hover-elevate"
                data-testid={`insight-${insight.id}`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold" data-testid={`text-insight-title-${insight.id}`}>
                        {insight.title}
                      </h4>
                      <Badge variant={getPriorityColor(insight.priority) as any} className="text-xs">
                        Prioridad {getPriorityLabel(insight.priority)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    {insight.ads && (
                      <div className="flex flex-wrap gap-2">
                        {insight.ads.slice(0, 3).map((ad, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {ad}
                          </Badge>
                        ))}
                        {insight.ads.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{insight.ads.length - 3} más
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    data-testid={`button-insight-action-${insight.id}`}
                  >
                    Ver detalles
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
