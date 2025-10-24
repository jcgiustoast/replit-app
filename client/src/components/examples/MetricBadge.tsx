import { MetricBadge } from '../metric-badge';

export default function MetricBadgeExample() {
  return (
    <div className="p-8 space-y-4">
      <div className="flex gap-2 flex-wrap">
        <MetricBadge 
          label="Spend" 
          color="bg-chart-1" 
          onRemove={() => console.log('Remove Spend')}
          tooltip="Total amount spent on ads"
        />
        <MetricBadge 
          label="ROAS" 
          color="bg-chart-2" 
          onRemove={() => console.log('Remove ROAS')}
          tooltip="Return on Ad Spend"
        />
        <MetricBadge 
          label="CPA" 
          color="bg-chart-3" 
          onRemove={() => console.log('Remove CPA')}
          tooltip="Cost Per Acquisition"
        />
        <MetricBadge 
          label="Convert score" 
          color="bg-chart-4" 
          onRemove={() => console.log('Remove Convert Score')}
          tooltip="Conversion performance score"
        />
      </div>
    </div>
  );
}
