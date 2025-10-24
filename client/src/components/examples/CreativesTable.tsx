import { CreativesTable } from '../creatives-table';
import panImage from '@assets/generated_images/Black_hybrid_sauté_pan_82f22d3b.png';
import dutchOvenImage from '@assets/generated_images/Orange_dutch_oven_pot_c05b89f0.png';
import fryingPanImage from '@assets/generated_images/Nonstick_frying_pan_silver_9bca4fc1.png';

export default function CreativesTableExample() {
  const mockCreatives = [
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
  ];

  return (
    <div className="p-8">
      <CreativesTable 
        creatives={mockCreatives} 
        selectedMetrics={["spend", "roas", "cpa", "convertScore"]} 
      />
    </div>
  );
}
