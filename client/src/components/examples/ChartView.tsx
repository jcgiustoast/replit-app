import { ChartView } from '../chart-view';
import panImage from '@assets/generated_images/Black_hybrid_sauté_pan_82f22d3b.png';
import dutchOvenImage from '@assets/generated_images/Orange_dutch_oven_pot_c05b89f0.png';

export default function ChartViewExample() {
  const mockCreatives = [
    {
      id: '1',
      adName: 'Hybrid Deep Pan',
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
      adName: 'Dutch Oven',
      adSetName: 'Product Focus',
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
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Bar Chart</h3>
        <ChartView creatives={mockCreatives} mode="bar" metrics={["spend", "roas"]} />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Line Chart</h3>
        <ChartView creatives={mockCreatives} mode="line" metrics={["spend", "roas", "cpa"]} />
      </div>
    </div>
  );
}
