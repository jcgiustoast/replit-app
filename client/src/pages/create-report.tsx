import { useState } from "react";
import { Star, Save } from "lucide-react";
import { CreativeCard } from "@/components/creative-card";
import { FilterBar } from "@/components/filter-bar";
import { ViewModeToggle, type ViewMode } from "@/components/view-mode-toggle";
import { ChartView } from "@/components/chart-view";
import { CreativesTable } from "@/components/creatives-table";
import { SaveReportDialog } from "@/components/save-report-dialog";
import { Button } from "@/components/ui/button";
import type { Creative } from "@shared/schema";
import type { AdvancedFilter } from "@/components/advanced-filters";

// TODO: remove mock functionality - this data should come from the API
import panImage from '@assets/generated_images/Black_hybrid_sauté_pan_82f22d3b.png';
import dutchOvenImage from '@assets/generated_images/Orange_dutch_oven_pot_c05b89f0.png';
import fryingPanImage from '@assets/generated_images/Nonstick_frying_pan_silver_9bca4fc1.png';
import wokImage from '@assets/generated_images/Stainless_steel_wok_pan_2f68c519.png';
import skilletImage from '@assets/generated_images/Cast_iron_skillet_cooking_9df0a0dc.png';
import potSetImage from '@assets/generated_images/Copper_bottom_pot_set_ebf34e45.png';

// TODO: remove mock data - replace with API call
const MOCK_CREATIVES: Creative[] = [
  {
    id: '1',
    adName: 'Static | Hybrid Deep Pans',
    adSetName: 'Product Focus',
    campaignName: 'Fall Campaign',
    thumbnail: panImage,
    spend: 58309,
    roas: 2.3,
    cpa: 39,
    ctr: 2.1,
    frequency: 1.8,
    convertScore: 74,
    date: new Date(),
  },
  {
    id: '2',
    adName: 'Video | Gordon Dutch Oven',
    adSetName: 'Influencer Content',
    campaignName: 'Fall Campaign',
    thumbnail: dutchOvenImage,
    spend: 177985,
    roas: 3.5,
    cpa: 36,
    ctr: 3.2,
    frequency: 2.1,
    convertScore: 61,
    date: new Date(),
  },
  {
    id: '3',
    adName: 'Static | Value Messaging',
    adSetName: 'Value Proposition',
    campaignName: 'Winter Sale',
    thumbnail: fryingPanImage,
    spend: 103649,
    roas: 2.7,
    cpa: 43,
    ctr: 1.9,
    frequency: 2.3,
    convertScore: 65,
    date: new Date(),
  },
  {
    id: '4',
    adName: 'Static | Nonstick Messaging',
    adSetName: 'Product Benefits',
    campaignName: 'Fall Campaign',
    thumbnail: wokImage,
    spend: 80076,
    roas: 2.1,
    cpa: 45,
    ctr: 1.7,
    frequency: 1.9,
    convertScore: 58,
    date: new Date(),
  },
  {
    id: '5',
    adName: 'Video | Cooking Demo',
    adSetName: 'Educational Content',
    campaignName: 'Winter Sale',
    thumbnail: skilletImage,
    spend: 92340,
    roas: 2.9,
    cpa: 34,
    ctr: 2.8,
    frequency: 2.0,
    convertScore: 71,
    date: new Date(),
  },
  {
    id: '6',
    adName: 'Static | Complete Set',
    adSetName: 'Bundle Promotion',
    campaignName: 'Holiday Campaign',
    thumbnail: potSetImage,
    spend: 125890,
    roas: 3.2,
    cpa: 38,
    ctr: 2.5,
    frequency: 1.7,
    convertScore: 68,
    date: new Date(),
  },
  {
    id: '7',
    adName: 'Video | Product Testimonial',
    adSetName: 'Social Proof',
    campaignName: 'Spring Campaign',
    thumbnail: panImage,
    spend: 67234,
    roas: 2.8,
    cpa: 42,
    ctr: 2.4,
    frequency: 1.6,
    convertScore: 72,
    date: new Date(),
  },
  {
    id: '8',
    adName: 'Static | Limited Time Offer',
    adSetName: 'Urgency Messaging',
    campaignName: 'Flash Sale',
    thumbnail: dutchOvenImage,
    spend: 89450,
    roas: 3.1,
    cpa: 35,
    ctr: 3.0,
    frequency: 2.2,
    convertScore: 76,
    date: new Date(),
  },
  {
    id: '9',
    adName: 'Video | Lifestyle Content',
    adSetName: 'Brand Awareness',
    campaignName: 'Spring Campaign',
    thumbnail: fryingPanImage,
    spend: 54120,
    roas: 2.0,
    cpa: 48,
    ctr: 1.8,
    frequency: 2.4,
    convertScore: 59,
    date: new Date(),
  },
  {
    id: '10',
    adName: 'Static | Premium Quality',
    adSetName: 'Premium Positioning',
    campaignName: 'Holiday Campaign',
    thumbnail: wokImage,
    spend: 112670,
    roas: 3.4,
    cpa: 33,
    ctr: 2.9,
    frequency: 1.5,
    convertScore: 79,
    date: new Date(),
  },
];

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("bar");
  const [selectedMetrics, setSelectedMetrics] = useState(["spend", "roas", "cpa", "convertScore"]);
  const [sortBy, setSortBy] = useState<keyof Creative>("spend");
  const [sortedCreatives, setSortedCreatives] = useState(MOCK_CREATIVES);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilter[]>([]);

  const handleMetricsChange = (metrics: string[]) => {
    setSelectedMetrics(metrics);
    console.log('Selected metrics:', metrics);
  };

  const handleFiltersChange = (filters: AdvancedFilter[]) => {
    setAdvancedFilters(filters);
    console.log('Advanced filters changed:', filters);
  };

  const handleSortChange = (metric: string) => {
    setSortBy(metric as keyof Creative);
    const sorted = [...MOCK_CREATIVES].sort((a, b) => {
      const aVal = a[metric as keyof Creative];
      const bVal = b[metric as keyof Creative];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return bVal - aVal;
      }
      return 0;
    });
    setSortedCreatives(sorted);
    console.log('Sorted by:', metric);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-chart-4 fill-chart-4" />
            <h1 className="text-2xl font-semibold" data-testid="text-page-title">Reporte Personalizado</h1>
          </div>
          <p className="text-sm text-muted-foreground" data-testid="text-page-description">
            Crea tus propios reportes
          </p>
        </div>

        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <FilterBar
              onDateRangeChange={(range) => console.log('Date range:', range)}
              onBreakdownChange={(breakdown) => console.log('Breakdown:', breakdown)}
              onMetricsChange={handleMetricsChange}
              onFiltersChange={handleFiltersChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setSaveDialogOpen(true)}
              data-testid="button-save-report"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Reporte
            </Button>
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </div>
        </div>

        <div className="mb-8">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCreatives.map((creative) => (
                <CreativeCard key={creative.id} creative={creative} />
              ))}
            </div>
          ) : (
            <ChartView 
              creatives={sortedCreatives} 
              mode={viewMode} 
              metrics={selectedMetrics}
            />
          )}
        </div>

        <div>
          <CreativesTable 
            creatives={sortedCreatives} 
            selectedMetrics={selectedMetrics}
          />
        </div>
      </div>

      <SaveReportDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        metrics={selectedMetrics}
      />
    </div>
  );
}
