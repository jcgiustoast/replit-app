# Design Guidelines: Meta Ads Creative Analytics Dashboard

## Design Approach
**Reference-Based Approach**: Drawing inspiration from MotionApp and Linear for data-heavy productivity tools, combined with Notion's clean information hierarchy and Apple's HIG principles for clarity and focus.

### Core Design Principles
1. **Data First**: Every design decision prioritizes data legibility and actionable insights
2. **Professional Restraint**: Clean, sophisticated aesthetic without decorative elements
3. **Purposeful Hierarchy**: Clear visual weight distinguishes primary metrics from supporting data
4. **Breathing Room**: Strategic whitespace prevents cognitive overload in data-dense views

---

## Typography System

### Font Family
- **Primary**: Inter or SF Pro Display via Google Fonts CDN
- **Monospace**: JetBrains Mono for numeric data and metrics

### Hierarchy
- **Page Titles**: text-2xl font-semibold (⭐ Reporte Personalizado, Reports)
- **Section Headers**: text-lg font-medium (filter group labels, card section titles)
- **Metric Labels**: text-sm font-medium tracking-tight (ROAS, CPA, Spend labels)
- **Metric Values**: text-2xl font-semibold tabular-nums for large metrics, text-lg font-semibold tabular-nums for card metrics
- **Body Text**: text-sm font-normal (descriptions, tooltips)
- **Small Labels**: text-xs font-medium tracking-wide uppercase (date ranges, dropdown labels)

---

## Layout System

### Spacing Primitives
**Core Units**: Use Tailwind units of **2, 4, 6, 8, 12, 16** (as in p-2, gap-4, mb-6, px-8, py-12, mt-16)

### Grid Structure
- **Sidebar**: Fixed width w-64 on desktop, collapsible on mobile
- **Main Content Area**: max-w-7xl mx-auto with px-6 lg:px-8
- **Dashboard Grid**: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 for creative cards
- **Filter Bar**: Flex layout with gap-4 for horizontal spacing between controls

### Container Strategy
- **Full App**: Two-column layout (sidebar + main) with sidebar bg slightly differentiated
- **Content Sections**: Contained within max-w-7xl with consistent px-6 padding
- **Cards**: Individual containers with defined padding p-6 and consistent rounded-xl corners

---

## Component Library

### Sidebar Navigation
- **Structure**: Fixed vertical nav with icon + label items
- **Items**: py-3 px-4 rounded-lg with hover states
- **Active State**: Subtle background treatment with font-medium
- **Icons**: Heroicons (outline for inactive, solid for active)
- **Grouping**: Logical sections separated by py-4 gaps

### Filter Controls
**Date Range Selector**
- Segmented control style with predefined options (7d, 14d, 30d, Custom)
- Custom opens popover with calendar picker
- Size: h-10 with px-4 for button segments

**Dropdown Selectors** (Breakdown Level, Metrics)
- Standard select height h-10
- Multi-select shows count badge when collapsed
- Checkboxes for multi-metric selection with clear visual checks

**Filter Bar Layout**
- Horizontal flex layout with gap-4
- Wraps responsively on smaller screens
- Sticky position top-0 when scrolling

### Creative Performance Cards
**Card Structure**
- Container: rounded-xl border with p-6
- Shadow: shadow-sm on default, shadow-md on hover
- Layout: Grid with thumbnail on left, metrics on right

**Card Components**:
- **Thumbnail Area**: aspect-video rounded-lg overflow-hidden (16:9 ratio)
- **Ad Name**: text-base font-medium mb-4 with truncate
- **Metrics Grid**: grid grid-cols-2 gap-4 for 4 main metrics
- **Metric Item**: 
  - Label: text-xs uppercase tracking-wide mb-1
  - Value: text-xl font-semibold tabular-nums
- **Convert Score Bar**: 
  - Full width progress bar h-2 rounded-full
  - Score displayed as text-sm font-medium above bar

### Data Visualization
**Chart Containers**
- Minimum height: h-80 for line/bar charts
- Padding: p-6 within card container
- Responsive: Full width with proper aspect ratio maintenance

**Chart Components** (Recharts)
- Grid lines: Minimal, subtle visual weight
- Axes: Clear labels with text-sm
- Tooltips: Compact design with white background, border, shadow-lg
- Legend: Positioned top-right, horizontal layout with gap-4

### View Mode Toggle
- Segmented control with 3 options: Grid, Bar Chart, Line Chart
- Icons: Use Heroicons (Squares2X2Icon, ChartBarIcon, ChartLineIcon)
- Size: h-10 with px-3 per segment
- Active state: Solid background fill

### Sort Controls
- Dropdown selector with metric options
- Ascending/descending toggle button adjacent
- Combined width maintains alignment with other filters

### Empty States
- Centered layout with icon (ChartBarSquareIcon size-16)
- Heading: text-lg font-medium
- Description: text-sm max-w-sm with muted treatment
- Action button if applicable (Import Data, Clear Filters)

### Tooltips
- Trigger: Hover on metric labels or info icons
- Content: Compact, single-line definitions
- Style: text-xs with p-2, rounded-md, shadow-lg
- Positioning: Bottom-center or top-center based on proximity to edges

---

## Page Layouts

### Main Dashboard View
**Structure**:
1. **Header Section** (mb-8):
   - Page title with icon
   - Subtitle/description text-sm
   
2. **Filter Bar** (mb-6):
   - Horizontal layout with all filter controls
   - View mode toggle on far right
   
3. **Results Container**:
   - Dynamic content area that switches between grid/chart views
   - Empty state when no data matches filters

4. **Stats Summary Bar** (optional, above results):
   - 4-column grid showing aggregate metrics
   - Total Spend, Avg ROAS, Avg CPA, Active Creatives count

### Sidebar Sections Layout
- **Top**: Logo/brand area (py-6 px-4)
- **Navigation**: Main menu items with consistent spacing
- **Bottom**: Settings/user profile (mt-auto, py-4)

---

## Responsive Behavior

### Breakpoint Strategy
- **Mobile** (base): Single column, stacked layout, collapsed sidebar
- **Tablet** (md:): 2-column grid for cards, expandable sidebar
- **Desktop** (lg:): 3-column grid, persistent sidebar

### Mobile Adaptations
- Sidebar: Overlay drawer from left, toggle button in header
- Filters: Stacked vertically in dropdown/drawer
- Cards: Full width with optimized spacing (p-4 instead of p-6)
- Charts: Maintain aspect ratio, reduce height to h-64

---

## Interactive States

### Hover Treatments
- **Cards**: Subtle shadow elevation (shadow-sm → shadow-md), slight border weight increase
- **Buttons/Controls**: Slight background opacity change, no dramatic color shifts
- **Chart Elements**: Highlight data point, show detailed tooltip

### Focus States
- Visible focus rings on all interactive elements
- ring-2 ring-offset-2 for keyboard navigation
- Maintains accessibility standards

### Loading States
- Skeleton screens for card grid using pulse animation
- Spinner overlay for chart updates
- Disabled state for controls during data fetch

---

## Images

### Creative Thumbnails
**Location**: Left side of each performance card  
**Description**: Mockup images representing Meta Ads creatives - product photos, lifestyle imagery, or video thumbnails. Should showcase variety (cookware products, lifestyle shots, different formats). Use placeholder images with aspect-video ratio showing professional product photography or video stills.

**Specifications**:
- Aspect ratio: 16:9 (aspect-video)
- Size: Responsive within card, approximately 280-320px width on desktop
- Treatment: rounded-lg corners, contained within card structure
- Quality: High-resolution, professional product/advertising imagery

**No Hero Image**: This dashboard is utility-focused. The main view immediately shows the filter controls and creative performance data without a traditional hero section.

---

## Animation Guidelines

**Minimal Motion**: Animations used only for functional feedback
- Filter/view changes: Subtle fade transition (200ms)
- Card hover: Smooth shadow transition (150ms)
- Tooltip appearance: Fade in (100ms)
- Chart updates: Data point transitions (300ms ease-in-out)

**No decorative animations**: Focus remains on data comprehension, not visual flair