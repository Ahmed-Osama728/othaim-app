# Othaim Market - Modern E-commerce Application

A high-performance, scalable e-commerce web application built with Next.js. This application enables users to browse products, add them to a shopping cart, and complete orders with a focus on performance, clean code, and excellent user experience.

## Features

### Product List Page
- Fetches product data from the Fake Store API
- Displays products in a responsive grid view
- Allows users to add products to the shopping cart
- Includes search functionality and category filtering
- Displays product details including images, prices, and ratings

### Shopping Cart Page
- Lists all added products with their details
- Allows modifying quantities with intuitive controls
- Provides a confirmation dialog when removing products
- Updates cart state in real-time
- Shows order summary with subtotal, shipping, and tax

### Order Confirmation Page
- Displays a summary of the order after checkout
- Shows order ID, date, items, and total amount
- Provides a seamless post-purchase experience

## Technical Implementation

### State Management
- Uses Zustand for efficient state management
- Implements persistent storage with localStorage
- Manages product fetching, cart state, and order management

### Performance Optimization
- Server Components for initial data fetching
- Client Components for interactive elements
- Image optimization with Next.js Image component
- Lazy loading and code splitting

### Offline Functionality
- Caches product data using localStorage
- Provides offline browsing capability
- Syncs with remote API when the app comes back online
- Graceful degradation when offline

### Error Handling
- Comprehensive error boundaries
- Fallback UI for network errors
- Graceful handling of API failures
- User-friendly error messages

### UI/UX Design
- Modern, clean, and responsive design
- Smooth animations and transitions
- Dark mode support
- Accessible UI components

## Architecture

The application follows a clean architecture with separation of concerns:

### UI Layer
- Components for presentation
- Pages for routing and layout

### Business Logic Layer
- Zustand stores for state management
- Utility functions for business logic

### Data Layer
- API service for data fetching
- Caching mechanisms for offline support

## 🧪 Testing

The application includes comprehensive testing:

### Unit Tests
- Tests for state management (Zustand stores)
- Tests for utility functions
- Tests for API service functions

## Getting Started

### Prerequisites
- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/Ahmed-Osama728/othaim-app.git
cd othaim-app
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Running Tests
\`\`\`bash
npm test
# or
yarn test
\`\`\`

## 📁 Project Structure

\`\`\`
othaim-app/
│
├── __tests__/                          # Test files
│   ├── api.test.ts                     # API functions tests
│   ├── cart-store.test.ts              # Cart store tests
│   ├── order-store.test.ts             # Order store tests
│   └── utils.test.ts                   # Utility functions tests
│
├── app/                                # Next.js App Router
│   ├── cart/
│   │   └── page.tsx                    # Cart page
│   ├── confirmation/
│   │   └── page.tsx                    # Order confirmation page
│   ├── globals.css                     # Global styles
│   ├── layout.tsx                      # Root layout
│   ├── loading.tsx                     # Global loading component
│   ├── not-found.tsx                   # 404 page
│   ├── error.tsx                       # Error boundary
│   └── page.tsx                        # Home page
│
├── components/                         # Reusable components
│   ├── banner/                         # Hero banner components
│   │   └── hero-banner.tsx
│   │
│   ├── cart/                           # Cart-related components
│   │   └── cart-content.tsx
│   │
│   ├── filters/                        # Search and filter components
│   │   ├── category-filter.tsx
│   │   └── search-bar.tsx
│   │
│   ├── layout/                         # Layout components
│   │   ├── header.tsx
│   │   └── footer.tsx
│   │
│   ├── order/                          # Order-related components
│   │   └── order-confirmation.tsx
│   │
│   ├── product/                        # Product components
│   │   ├── product-card.tsx
│   │   ├── product-card-skeleton.tsx
│   │   ├── product-list.tsx
│   │   ├── product-list-client.tsx
│   │   └── product-list-skeleton.tsx
│   │
│   ├── ui/                             # UI components (shadcn/ui)
│   │   ├── alert.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── network-status.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── toggle.tsx
│   │   └── use-mobile.tsx
│   │
│   ├── error-boundry.tsx               # Error boundary component
│   ├── theme-provider.tsx              # Theme context provider
│   └── theme-toggle.tsx                # Theme switcher
│
├── hooks/                              # Custom React hooks
│   └── use-toast.ts                    # Toast notification hook
│
├── lib/                                # Utility libraries
│   ├── api.ts                          # API functions with caching
│   ├── types.ts                        # TypeScript type definitions
│   └── utils.ts                        # Utility functions
│
├── providers/                          # Context providers
│   ├── store-provider.tsx              # Store initialization
│   └── theme-provider.tsx              # Theme provider wrapper
│
├── public/                             # Static assets
│   ├── banner-electronics.webp         # Hero banner images
│   ├── banner-fashion.webp
│   ├── banner-jewelery.webp
│   └── othaim-logo.svg                 # Application logo
│
├── store/                              # Zustand state management
│   ├── cart-store.ts                   # Shopping cart state
│   └── order-store.ts                  # Order management state
│
├── styles/                             # Additional styles
│   └── globals.css                     # Legacy global styles
│
├── components.json                     # shadcn/ui configuration
├── next.config.mjs                     # Next.js configuration
├── package.json                        # Dependencies and scripts
├── postcss.config.mjs                  # PostCSS configuration
├── tailwind.config.ts                  # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript configuration
└── vitest.config.mts                   # Vitest testing configuration
\`\`\`

## External Packages

### Core Dependencies
- **Next.js**: React framework for server-rendered applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript

### State Management
- **Zustand**: Simple state management solution
  - Chosen for its simplicity, performance, and minimal boilerplate compared to Redux
  - Provides built-in persistence middleware for localStorage integration

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
  - Chosen for rapid development and consistent design system
  - Provides responsive utilities out of the box
- **Radix UI**: Unstyled, accessible UI components
  - Chosen for accessibility and customizability
- **Framer Motion**: Animation library
  - Chosen for high-performance animations and simple API

### Testing
- **Vitest**: Fast unit test framework
  - Chosen for its speed, ESM support, and compatibility with TypeScript
- **React Testing Library**: Testing utilities for React
  - Chosen for its user-centric testing approach

## Accessibility

- Semantic HTML structure
- ARIA attributes where necessary
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly content

## Areas Covered by TDD

The application was developed following Test-Driven Development principles:

1. **State Management**: Tests for cart and order stores were written first, defining the expected behavior before implementation.
2. **API Services**: Tests for API functions defined the expected behavior for fetching, caching, and error handling.
3. **Utility Functions**: Tests for utility functions ensured correct behavior for formatting, ID generation, and performance optimizations.

## 🔧 Configuration Files

### Next.js Configuration (\`next.config.mjs\`)
- Image optimization settings
- Webpack optimizations
- Performance enhancements
- Build optimizations

### Tailwind Configuration (\`tailwind.config.ts\`)
- Custom color scheme
- Component-specific utilities
- Responsive breakpoints
- Plugin configurations

### TypeScript Configuration (\`tsconfig.json\`)
- Strict type checking
- Path aliases for imports
- Modern JavaScript features
- Build optimizations

### Image Optimization
- Next.js Image component with WebP/AVIF support
- Lazy loading for non-critical images
- Proper sizing and quality settings
- Preloading for critical images

### Caching Strategy
- Local storage for cart persistence
- API response caching
- Image caching with proper headers
- Service worker ready

## 🌐 API Integration

The application uses the [Fake Store API](https://fakestoreapi.com/) for demo data:
- Products endpoint: \`/products\`
- Categories endpoint: \`/products/categories\`
- Single product: \`/products/{id}\`

### Caching Implementation
- 24-hour cache for products
- 7-day cache for categories
- Offline fallback support
- Automatic cache invalidation