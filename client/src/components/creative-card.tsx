import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Creative } from "@shared/schema";

interface CreativeCardProps {
  creative: Creative;
}

export function CreativeCard({ creative }: CreativeCardProps) {
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

  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-creative-${creative.id}`}>
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
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Spend</p>
            <p className="text-lg font-semibold tabular-nums" data-testid="text-spend">
              {formatCurrency(creative.spend)}
            </p>
          </div>
          
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">ROAS</p>
            <p className="text-lg font-semibold tabular-nums text-chart-2" data-testid="text-roas">
              {formatNumber(creative.roas)}
            </p>
          </div>
          
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">CPA</p>
            <p className="text-lg font-semibold tabular-nums" data-testid="text-cpa">
              {formatCurrency(creative.cpa)}
            </p>
          </div>
          
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">CTR</p>
            <p className="text-lg font-semibold tabular-nums" data-testid="text-ctr">
              {formatNumber(creative.ctr)}%
            </p>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Convert score</p>
            <p className="text-sm font-medium tabular-nums" data-testid="text-convert-score">
              {creative.convertScore}
            </p>
          </div>
          <Progress value={creative.convertScore} className="h-2" data-testid="progress-convert-score" />
        </div>
      </div>
    </Card>
  );
}
