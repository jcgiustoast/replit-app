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

const LEFT_AXIS_METRICS = ["spend", "cpa"];
const RIGHT_AXIS_METRICS = ["roas", "ctr", "frequency", "convertScore"];

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
    index: number;
  };
  creativeData?: Array<{ thumbnail: string; adName: string }>;
}

const CustomXAxisTick = ({ x = 0, y = 0, payload, creativeData }: CustomTickProps) => {
  if (!payload || !creativeData) return null;
  
  const creative = creativeData[payload.index];
  if (!creative) return null;

  const shortName = creative.adName.length > 20 
    ? creative.adName.substring(0, 20) + '...' 
    : creative.adName;

  const imageSize = 70;
  const imageX = (x || 0) - imageSize / 2;
  const imageY = (y || 0);

  return (
    <g>
      {/* Border rectangle */}
      <rect
        x={imageX - 2}
        y={imageY - 2}
        width={imageSize + 4}
        height={imageSize + 4}
        rx={8}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth={2}
      />
      {/* Clip path for rounded corners */}
      <defs>
        <clipPath id={`clip-${payload.index}`}>
          <rect x={imageX} y={imageY} width={imageSize} height={imageSize} rx={6} />
        </clipPath>
      </defs>
      {/* Image */}
      <image
        href={creative.thumbnail}
        x={imageX}
        y={imageY}
        width={imageSize}
        height={imageSize}
        clipPath={`url(#clip-${payload.index})`}
        preserveAspectRatio="xMidYMid slice"
      />
      {/* Text label */}
      <text
        x={x || 0}
        y={imageY + imageSize + 10}
        textAnchor="middle"
        fontSize={11}
        fill="hsl(var(--muted-foreground))"
      >
        {shortName.split(' ').map((word, i) => (
          <tspan key={i} x={x || 0} dy={i === 0 ? 0 : 12}>
            {word}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export function ChartView({ creatives, mode, metrics }: ChartViewProps) {
  const limitedCreatives = creatives.slice(0, 6);
  
  const data = limitedCreatives.map(creative => ({
    name: creative.adName,
    spend: creative.spend,
    roas: creative.roas,
    cpa: creative.cpa,
    ctr: creative.ctr,
    frequency: creative.frequency,
    convertScore: creative.convertScore,
  }));

  const creativeData = limitedCreatives.map(c => ({
    thumbnail: c.thumbnail,
    adName: c.adName
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
    <Card className="p-4">
      <ResponsiveContainer width="100%" height={720}>
        {mode === "bar" ? (
          <BarChart data={data} data-testid="chart-bar" margin={{ bottom: 130, top: 20, left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              tick={<CustomXAxisTick creativeData={creativeData} />}
              height={105}
              interval={0}
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
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: 14, paddingTop: '20px', paddingBottom: '10px' }}
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
          <LineChart data={data} data-testid="chart-line" margin={{ bottom: 130, top: 20, left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              tick={<CustomXAxisTick creativeData={creativeData} />}
              height={105}
              interval={0}
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
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: 14, paddingTop: '20px', paddingBottom: '10px' }}
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
