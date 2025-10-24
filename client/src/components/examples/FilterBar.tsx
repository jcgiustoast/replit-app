import { FilterBar } from '../filter-bar';

export default function FilterBarExample() {
  return (
    <div className="p-8">
      <FilterBar
        onDateRangeChange={(range) => console.log('Date range:', range)}
        onBreakdownChange={(breakdown) => console.log('Breakdown:', breakdown)}
        onMetricsChange={(metrics) => console.log('Metrics:', metrics)}
      />
    </div>
  );
}
