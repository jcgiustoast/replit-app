import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Creative } from "@shared/schema";

interface CreativeCardProps {
  creative: Creative;
  selectedMetrics?: string[];
  onClick?: () => void;
}

export function CreativeCard({ creative, selectedMetrics, onClick }: CreativeCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 1) => {
    return value.toFixed(decimals);
  };

  // Map metric keys to display info
  const metricConfig: Record<string, { label: string; format: (val: number) => string; testId: string; color?: string }> = {
    spend: {
      label: 'Spend',
      format: formatCurrency,
      testId: 'text-spend',
    },
    roas: {
      label: 'ROAS',
      format: (val) => formatNumber(val),
      testId: 'text-roas',
      color: 'text-chart-2',
    },
    cpa: {
      label: 'CPA',
      format: formatCurrency,
      testId: 'text-cpa',
    },
    ctr: {
      label: 'CTR',
      format: (val) => `${formatNumber(val)}%`,
      testId: 'text-ctr',
    },
    frequency: {
      label: 'Frequency',
      format: (val) => formatNumber(val),
      testId: 'text-frequency',
    },
    convertScore: {
      label: 'Convert Score',
      format: (val) => val.toString(),
      testId: 'text-convert-score',
    },
  };

  // Determine which metrics to display
  const metricsToShow = selectedMetrics && selectedMetrics.length > 0
    ? selectedMetrics.filter(m => m !== 'convertScore') // Handle convertScore separately
    : ['spend', 'roas', 'cpa', 'ctr'];

  const showConvertScore = !selectedMetrics || selectedMetrics.length === 0 || selectedMetrics.includes('convertScore');

  return (
    <Card 
      className="overflow-hidden hover-elevate cursor-pointer" 
      data-testid={`card-creative-${creative.id}`}
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={creative.thumbnail}
          alt={creative.adName}
          className="w-full h-full object-cover"
          data-testid="img-creative-thumbnail"
        />
      </div>
      
      <div className="p-6">
        <h3 className="font-medium text-base mb-4 truncate" data-testid="text-ad-name">
          {creative.adName}
        </h3>
        
        {metricsToShow.length > 0 && (
          <div className={`grid gap-4 mb-4 ${metricsToShow.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {metricsToShow.map((metricKey) => {
              const config = metricConfig[metricKey];
              if (!config) return null;
              
              const value = creative[metricKey as keyof Creative] as number;
              
              return (
                <div key={metricKey}>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    {config.label}
                  </p>
                  <p className={`text-lg font-semibold tabular-nums ${config.color || ''}`} data-testid={config.testId}>
                    {config.format(value)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        
        {showConvertScore && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Convert score</p>
              <p className="text-sm font-medium tabular-nums" data-testid="text-convert-score">
                {creative.convertScore}
              </p>
            </div>
            <Progress value={creative.convertScore} className="h-2" data-testid="progress-convert-score" />
          </div>
        )}
      </div>
    </Card>
  );
}
