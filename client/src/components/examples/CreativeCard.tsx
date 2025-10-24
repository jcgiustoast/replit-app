import { CreativeCard } from '../creative-card';
import panImage from '@assets/generated_images/Black_hybrid_sauté_pan_82f22d3b.png';

export default function CreativeCardExample() {
  const mockCreative = {
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
  };

  return (
    <div className="p-8 max-w-sm">
      <CreativeCard creative={mockCreative} />
    </div>
  );
}
