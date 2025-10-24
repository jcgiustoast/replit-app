# Meta Ads Creative Analytics Dashboard

## Overview

This is a full-stack web application for analyzing Meta Ads creative performance. The dashboard provides comprehensive metrics visualization (Spend, ROAS, CPA, CTR, Frequency, Convert Score) with multiple view modes including grid cards, bar charts, and line charts. Users can filter data by date ranges, breakdown levels (Ad name, Ad set name, Campaign name), and save custom reports with names and descriptions for future reference.

The application is inspired by MotionApp's clean design principles and HexClad's dashboard UI, emphasizing data clarity, professional aesthetics, and purposeful visual hierarchy.

### Key Features

**Saved Reports System**
- Save custom metric combinations with descriptive names
- Optional descriptions that appear as tooltips in the sidebar
- Quick access to saved reports from the sidebar navigation
- Each saved report preserves the selected metrics for consistent analysis
- Dedicated saved report pages showing the configured view

**Dark/Light Mode Toggle**
- Theme toggle button in the top-right corner of the header
- Seamless switching between light and dark themes
- Theme preference persists across sessions via localStorage
- All UI components automatically adapt to the selected theme
- Smooth color transitions throughout the application

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing

**UI Component System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Design system follows "new-york" style variant with neutral base color
- Custom CSS variables for theming with full light/dark mode support
- ThemeProvider component manages global theme state via React Context
- Typography: Inter/SF Pro Display for UI, JetBrains Mono for numeric data

**State Management**
- TanStack Query (React Query) for server state management and caching
- Query client configured with infinite stale time and no automatic refetching
- React Context for global theme state management (ThemeProvider)
- Local component state with React hooks for UI interactions

**Data Visualization**
- Recharts library for bar and line chart components
- Custom chart configurations with dual Y-axes (left for currency values, right for ratios/percentages)
- Grid card view for creative thumbnails with key metrics
- Custom X-axis ticks displaying creative thumbnail images alongside ad names
- foreignObject-based rendering for rich X-axis labels with images (50x50px thumbnails, rounded corners, borders)

**Form Handling**
- React Hook Form for form state management
- Zod schema validation with @hookform/resolvers integration
- Type-safe form data with TypeScript inference

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with TypeScript
- ESM (ES Modules) configuration throughout the stack
- Custom middleware for request logging and JSON response capture

**API Design**
- RESTful API endpoints prefixed with `/api`
- CRUD operations for saved reports:
  - `GET /api/saved-reports` - List all saved reports
  - `GET /api/saved-reports/:id` - Get single report by ID
  - `POST /api/saved-reports` - Create new report with name, description, and metrics
  - `DELETE /api/saved-reports/:id` - Delete a saved report
- JSON request/response format with proper error handling
- Request body validation using Zod schemas from shared types

**Development Environment**
- Vite middleware mode for HMR (Hot Module Replacement) during development
- Custom error overlays and dev banners via Replit plugins
- Separate production build process bundling server code with esbuild

### Data Storage

**Database**
- PostgreSQL as the primary database (configured via DATABASE_URL)
- Neon serverless driver (@neondatabase/serverless) for database connectivity
- Drizzle ORM for type-safe database queries and schema management

**Schema Design**
- `users` table: Authentication and user management
- `creatives` table: Meta Ads creative data with metrics (spend, ROAS, CPA, CTR, frequency, convertScore)
- `saved_reports` table: User-saved report configurations
  - `id`: UUID primary key
  - `name`: Report name (required)
  - `description`: Optional description shown in tooltips
  - `metrics`: Array of selected metric names
  - `createdAt`: Timestamp of report creation
- UUID primary keys using `gen_random_uuid()`
- Timestamp tracking for records

**Storage Abstraction**
- IStorage interface defining CRUD operations for users, creatives, and saved reports
- MemStorage implementation for in-memory development/testing
  - `getSavedReports()`: List all reports sorted by creation date (newest first)
  - `getSavedReport(id)`: Get single report by ID
  - `createSavedReport(report)`: Create new report
  - `deleteSavedReport(id)`: Delete report by ID
- Database storage implementation using Drizzle ORM (production)

### External Dependencies

**Third-Party UI Libraries**
- Radix UI: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- Lucide React: Icon library for consistent iconography
- cmdk: Command palette component
- embla-carousel-react: Carousel/slider functionality
- recharts: Chart rendering library
- react-day-picker: Calendar/date picker component
- date-fns: Date manipulation and formatting

**Database & ORM**
- @neondatabase/serverless: PostgreSQL client for Neon database
- drizzle-orm: Type-safe ORM and query builder
- drizzle-kit: CLI tools for migrations and schema management
- drizzle-zod: Zod schema generation from Drizzle tables

**Development Tools**
- @replit/vite-plugin-runtime-error-modal: Error overlay during development
- @replit/vite-plugin-cartographer: Code mapping tool (Replit-specific)
- @replit/vite-plugin-dev-banner: Development environment indicators

**Form & Validation**
- react-hook-form: Form state management
- zod: Runtime type validation and schema definition
- @hookform/resolvers: Integration between react-hook-form and zod

**Styling**
- tailwindcss: Utility-first CSS framework
- autoprefixer: CSS vendor prefixing
- class-variance-authority: Component variant management
- tailwind-merge + clsx: Conditional className handling

**Routing & State**
- wouter: Lightweight routing (alternative to React Router)
- @tanstack/react-query: Server state management and caching

**Session Management**
- express-session: Server-side session handling
- connect-pg-simple: PostgreSQL session store

**Build Tools**
- vite: Frontend build tool and dev server
- @vitejs/plugin-react: React Fast Refresh support
- esbuild: Server-side code bundling
- tsx: TypeScript execution for development
- typescript: Type checking and compilation