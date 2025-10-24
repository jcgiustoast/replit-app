import { useState } from 'react';
import { ViewModeToggle, type ViewMode } from '../view-mode-toggle';

export default function ViewModeToggleExample() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <div className="p-8 space-y-4">
      <ViewModeToggle 
        value={viewMode} 
        onChange={(mode) => {
          setViewMode(mode);
          console.log('View mode changed to:', mode);
        }} 
      />
      <p className="text-sm text-muted-foreground">Current view: {viewMode}</p>
    </div>
  );
}
