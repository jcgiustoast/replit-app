import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Creative } from "@shared/schema";

interface ChartViewProps {
  creatives: Creative[];
  mode: "bar" | "line";
  metrics: string[];
}

const METRIC_COLORS: Record<string, string> = {
  spend: "hsl(var(--chart-1))",
  roas: "hsl(var(--chart-2))",
  cpa: "hsl(var(--chart-3))",
  ctr: "hsl(var(--chart-4))",
  frequency: "hsl(var(--chart-5))",
  convertScore: "hsl(var(--chart-1))",
};

const METRIC_LABELS: Record<string, string> = {
  spend: "Spend",
  roas: "ROAS",
  cpa: "CPA",
  ctr: "CTR",
  frequency: "Frequency",
  convertScore: "Convert Score",
};

// Métricas que van en el eje izquierdo (valores grandes, moneda)
const LEFT_AXIS_METRICS = ["spend", "cpa"];
// Métricas que van en el eje derecho (valores pequeños, ratios, porcentajes)
const RIGHT_AXIS_METRICS = ["roas", "ctr", "frequency", "convertScore"];

export function ChartView({ creatives, mode, metrics }: ChartViewProps) {
  const data = creatives.slice(0, 10).map(creative => ({
    name: creative.adName.length > 20 ? creative.adName.substring(0, 20) + '...' : creative.adName,
    spend: creative.spend,
    roas: creative.roas,
    cpa: creative.cpa,
    ctr: creative.ctr,
    frequency: creative.frequency,
    convertScore: creative.convertScore,
  }));

  const leftAxisMetrics = metrics.filter(m => LEFT_AXIS_METRICS.includes(m));
  const rightAxisMetrics = metrics.filter(m => RIGHT_AXIS_METRICS.includes(m));

  const formatYAxisLeft = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatYAxisRight = (value: number) => {
    return value.toFixed(1);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-popover-border rounded-lg shadow-lg p-3">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {METRIC_LABELS[entry.dataKey]}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <ResponsiveContainer width="100%" height={400}>
        {mode === "bar" ? (
          <BarChart data={data} data-testid="chart-bar">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            {leftAxisMetrics.length > 0 && (
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={formatYAxisLeft}
              />
            )}
            {rightAxisMetrics.length > 0 && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={formatYAxisRight}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: 14 }}
              iconType="circle"
            />
            {leftAxisMetrics.map((metric) => (
              <Bar
                key={metric}
                dataKey={metric}
                name={METRIC_LABELS[metric]}
                fill={METRIC_COLORS[metric]}
                radius={[4, 4, 0, 0]}
                yAxisId="left"
              />
            ))}
            {rightAxisMetrics.map((metric) => (
              <Bar
                key={metric}
                dataKey={metric}
                name={METRIC_LABELS[metric]}
                fill={METRIC_COLORS[metric]}
                radius={[4, 4, 0, 0]}
                yAxisId="right"
              />
            ))}
          </BarChart>
        ) : (
          <LineChart data={data} data-testid="chart-line">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            {leftAxisMetrics.length > 0 && (
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={formatYAxisLeft}
              />
            )}
            {rightAxisMetrics.length > 0 && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={formatYAxisRight}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: 14 }}
              iconType="circle"
            />
            {leftAxisMetrics.map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                name={METRIC_LABELS[metric]}
                stroke={METRIC_COLORS[metric]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                yAxisId="left"
              />
            ))}
            {rightAxisMetrics.map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                name={METRIC_LABELS[metric]}
                stroke={METRIC_COLORS[metric]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                yAxisId="right"
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
