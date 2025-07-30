# CamRent Frontend - AI Coding Instructions

## Project Overview
This is a **Next.js 15** camera/dress rental marketplace frontend using **TypeScript**, **Tailwind CSS 4**, and **Framer Motion**. The app follows a **dual-dashboard architecture** (user + admin) with JWT-based authentication and a **component-first design system**.

## Architecture Patterns

### App Router Structure
- Uses Next.js App Router (`src/app/`) with TypeScript
- Route-based pages: `/dashboard`, `/admin-dashboard`, `/shop`, `/products/[id]`
- Centralized auth context wraps entire app in `layout.tsx`
- Each major section has its own tab-based sub-components

### Authentication Flow
- **Context**: `src/contexts/AuthContext.tsx` - manages user state, tokens (access/refresh), localStorage persistence
- **API Layer**: `src/api/` - centralized API calls with `apiFetch()` wrapper
- **Backend**: Points to `https://werent-backend-api.onrender.com`
- **Pattern**: Protected routes check `isAuthenticated` and redirect to `/login`

### Component System
- **Container**: `src/components/ui/Container.tsx` - responsive wrapper with max-width constraints
- **Layout**: All pages use `<Container>` + consistent header patterns with gradient backgrounds
- **Animations**: Framer Motion variants for menu animations (see `Navbar.tsx` for patterns)
- **Styling**: Tailwind with purple/pink gradient theme (`from-purple-600 to-pink-500`)

## Key Development Workflows

### Running the App
```bash
npm run dev --turbopack  # Uses Turbopack for faster builds
npm run build
npm run lint  # Next.js ESLint with TypeScript rules
```

### Component Creation Pattern
1. Create in `src/components/[FeatureName]/[ComponentName].tsx`
2. Use TypeScript interfaces for props (see `ContainerProps`, `AuthContextType`)
3. Export via `index.ts` barrel files (see `src/components/Hero/index.ts`)
4. Wrap with `Container` for consistent spacing

### Page Creation Pattern
```tsx
// Standard page structure
"use client";  // For client-side features
import Container from '@/components/ui/Container';
import { useAuth } from '@/contexts/AuthContext';

export default function PageName() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient header */}
      <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-500">
        <Container className="h-full flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white">Page Title</h1>
        </Container>
      </div>
      
      <Container className="py-8">
        {/* Page content */}
      </Container>
    </div>
  );
}
```

## Critical Conventions

### State Management
- **Auth**: Global context via `AuthProvider` - handles user, tokens, persistence
- **Local State**: React useState for component-level state (tabs, modals, forms)
- **Loading States**: Use `isLoading` pattern with spinner UI (see dashboard loading)

### API Integration
- **Centralized**: All API calls go through `src/api/` modules
- **Error Handling**: `apiFetch()` throws errors, catch in components
- **Headers**: Auto-attaches `Authorization: Bearer {token}` when token provided
- **Endpoints**: Defined in `src/api/index.ts` endpoints object

### TypeScript Patterns
- **Interfaces**: Define props and data shapes (User, AuthContextType, etc.)
- **Path Mapping**: Use `@/*` alias for `src/*` imports
- **Strict Mode**: Enabled - handle null/undefined explicitly

### Styling Conventions
- **Theme**: Purple/pink gradients (`from-purple-600 to-pink-500`)
- **Layout**: Always use `Container` wrapper for responsive design
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **Loading**: Consistent spinner with purple accent (`border-purple-600`)

### Tab-Based Dashboards
Both `/dashboard` and `/admin-dashboard` use tab patterns:
- State: `const [activeTab, setActiveTab] = useState('overview')`
- Navigation: Side nav on desktop, horizontal on mobile
- Content: Conditional rendering based on `activeTab`
- Styling: Active tab gets gradient background, inactive gets hover states

## Integration Points
- **External API**: Backend API for auth, data (check `BASE_URL` in `src/api/index.ts`)
- **Images**: Next.js Image component with Unsplash domain configured
- **Fonts**: Geist Sans/Mono loaded in `layout.tsx`
- **Icons**: SVG icons in `/public/` directory for UI elements

When adding new features, follow the established patterns: TypeScript interfaces, Container wrapper, consistent auth checks, and gradient theming.
