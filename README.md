# EduDiscover Frontend

A modern, responsive education discovery web application that helps students search, compare, and apply to universities and programs worldwide with AI-powered recommendations.

## 🚀 Features

### Core Functionality
- **Advanced Search & Filtering**: Search programs by country, degree level, discipline, tuition range, language requirements, and more
- **AI-Powered Recommendations**: Get personalized program suggestions based on your profile and preferences
- **Program Comparison**: Compare up to 4 programs side-by-side with detailed metrics
- **Smart Shortlisting**: Save favorite programs with notes and tags, sync across devices
- **Application Assistance**: Lead capture forms with application guidance

### User Experience
- **Responsive Design**: Mobile-first design that works beautifully on all devices
- **Accessibility**: WCAG 2.1 AA compliant with focus management and screen reader support
- **Progressive Enhancement**: Works with JavaScript disabled, enhanced with JS enabled
- **Performance Optimized**: Lazy loading, code splitting, and optimized images
- **SEO Friendly**: Server-side rendering, structured data, and meta tags

### Technical Features
- **TypeScript**: Full type safety across the application
- **Modern React**: Built with React 18, Next.js 14, and App Router
- **State Management**: Zustand for global state with persistence
- **API Integration**: Feature-flagged mock/real API switching
- **Analytics Ready**: Event tracking with pluggable analytics adapters
- **Internationalization**: i18n-ready with RTL layout support

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── search/            # Search results page
│   ├── program/           # Program detail pages
│   ├── compare/           # Program comparison
│   ├── shortlist/         # User shortlist
│   ├── ai-advisor/        # AI chat interface
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles and CSS variables
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── home/              # Homepage specific components
│   ├── search/            # Search page components
│   ├── programs/          # Program-related components
│   └── forms/             # Form components
├── lib/                   # Utility libraries
│   ├── api.ts            # Real API client
│   ├── mockApi.ts        # Mock API implementation
│   ├── apiWrapper.ts     # API abstraction layer
│   ├── utils.ts          # Common utilities
│   ├── analytics.ts      # Analytics adapter
│   └── featureFlags.ts   # Feature flag system
├── store/                 # Zustand state management
│   ├── authStore.ts      # Authentication state
│   ├── searchStore.ts    # Search and filters state
│   ├── shortlistStore.ts # User shortlist state
│   └── compareStore.ts   # Program comparison state
├── types/                 # TypeScript type definitions
│   └── index.ts
├── hooks/                 # Custom React hooks
└── data/                  # Static data and fixtures
    └── mockData.ts
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Quick Start

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd edu-discovery-frontend
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env.local
```

3. **Configure environment variables**
```env
# API Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_BASE_URL=http://localhost:8000/api

# Feature Flags
NEXT_PUBLIC_FEATURE_FLAG_USE_MOCK_API=true
NEXT_PUBLIC_ANALYTICS_ENABLED=false

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token

# SEO (Optional)
GOOGLE_SITE_VERIFICATION=your_verification_code
```

4. **Start development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build production application
npm run start        # Start production server
npm run lint         # Run ESLint for code quality
npm run type-check   # Run TypeScript type checking

# Testing
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🔧 API Integration

The application supports both mock and real API backends through feature flags.

### Mock API (Default)
Set `NEXT_PUBLIC_FEATURE_FLAG_USE_MOCK_API=true` to use the built-in mock API with realistic sample data.

### Real API Integration
1. Set `NEXT_PUBLIC_FEATURE_FLAG_USE_MOCK_API=false`
2. Configure `API_BASE_URL` to point to your backend
3. Ensure your backend implements the expected endpoints:

```
GET    /api/programs/search    # Program search with filters
GET    /api/programs/:id       # Program details
GET    /api/programs/:id/similar # Similar programs
POST   /api/auth/login         # User authentication
POST   /api/auth/register      # User registration
GET    /api/auth/me           # Current user info
GET    /api/shortlist         # User shortlist
POST   /api/shortlist         # Add to shortlist
DELETE /api/shortlist/:id     # Remove from shortlist
POST   /api/recommendations   # AI recommendations
POST   /api/ai/chat          # AI chat
POST   /api/leads            # Lead submission
GET    /api/metadata/countries    # Available countries
GET    /api/metadata/disciplines  # Available disciplines
GET    /api/metadata/universities # University list
```

## 📊 Analytics Integration

The application includes a flexible analytics system supporting multiple providers:

### Supported Providers
- **Google Analytics 4**: Set `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Mixpanel**: Set `NEXT_PUBLIC_MIXPANEL_TOKEN`
- **Console Logging**: Enabled in development

### Event Tracking
Key events automatically tracked:
- `search_submitted` - User performs search
- `filter_applied` - User applies filters
- `program_viewed` - User views program details
- `shortlist_added/removed` - Shortlist actions
- `compare_opened/added` - Comparison actions
- `ai_message_sent` - AI advisor interactions
- `lead_submitted` - Application leads
- `user_registered/logged_in` - Authentication events

### Custom Events
```typescript
import analytics from '@/lib/analytics';

// Track custom event
analytics.track('custom_event', {
  property1: 'value1',
  property2: 'value2'
});

// Identify user
analytics.identify('user-id', {
  email: 'user@example.com',
  plan: 'premium'
});
```

## 🌐 Internationalization

The application is built with i18n support:

### RTL Language Support
- CSS is RTL-safe with direction-aware utilities
- Layout components adapt to text direction
- Icons and images flip appropriately

### Adding New Languages
1. Create language files in `src/locales/`
2. Update the i18n configuration
3. Add language switcher to header
4. Test RTL layout if applicable

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: Meets AA standards (4.5:1 ratio)
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks

### Testing Accessibility
```bash
# Run accessibility tests
npm run test:a11y

# Manual testing checklist:
# 1. Navigate with keyboard only
# 2. Test with screen reader
# 3. Verify color contrast
# 4. Check focus indicators
```

## 📱 Mobile Optimization

### Responsive Design Features
- **Mobile-First**: Designed for mobile, enhanced for desktop
- **Touch-Friendly**: Appropriate tap targets (44px minimum)
- **Gesture Support**: Swipe navigation where appropriate
- **Offline Capability**: Service worker for basic offline functionality

### Performance
- **Lazy Loading**: Images and components load on demand
- **Code Splitting**: Route-based and component-based splitting
- **Optimized Images**: Next.js Image component with WebP support
- **Minimal JavaScript**: Essential functionality without JS bloat

## 🧪 Testing

### Test Structure
```
__tests__/
├── components/        # Component unit tests
├── pages/            # Page integration tests
├── lib/              # Utility function tests
└── __mocks__/        # Test mocks and fixtures
```

### Key Test Files
- `SearchBar.test.tsx` - Search functionality
- `ProgramCard.test.tsx` - Program display component
- `SearchFilters.test.tsx` - Filter functionality
- `api.test.ts` - API client tests

### Running Tests
```bash
npm run test                    # Run all tests
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report
npm run test -- --testNamePattern="SearchBar"  # Specific tests
```

## 🚀 Deployment

### Build Optimization
```bash
npm run build
npm run start
```

### Environment-Specific Builds
- **Development**: Hot reload, detailed errors, mock API
- **Staging**: Production build, real API, limited analytics
- **Production**: Optimized build, full analytics, error tracking

### Deployment Checklist
- [ ] Set production environment variables
- [ ] Configure API endpoints
- [ ] Set up analytics tracking
- [ ] Configure error monitoring
- [ ] Test responsive design
- [ ] Verify accessibility
- [ ] Check SEO meta tags
- [ ] Test performance (Lighthouse)

## 🔍 SEO & Performance

### SEO Features
- **Meta Tags**: Dynamic title, description, and OG tags
- **Structured Data**: JSON-LD for programs and universities
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine guidance
- **Canonical URLs**: Prevent duplicate content

### Performance Monitoring
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Lighthouse Score**: Target 90+ for all metrics
- **Bundle Analysis**: Use `npm run analyze` to check bundle size

## 🤝 Contributing

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Extended configuration with accessibility rules
- **Prettier**: Automatic code formatting
- **Conventional Commits**: Standardized commit messages

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Run linting and type checking
4. Ensure accessibility compliance
5. Create pull request with description
6. Address review feedback
7. Merge to main

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json
npm install
```

**Type Errors**
```bash
# Check TypeScript configuration
npm run type-check

# Regenerate type definitions
npm run build
```

**Styling Issues**
```bash
# Rebuild Tailwind CSS
npm run build:css
```

### Performance Issues
- Check bundle size with `npm run analyze`
- Optimize images using Next.js Image component
- Implement code splitting for large components
- Use React.memo for expensive components

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from modern education platforms
- UI components built with Tailwind CSS and Radix UI
- Icons provided by Lucide React
- Sample images from Unsplash

---

**Built with ❤️ for students worldwide**

For additional support or questions, please open an issue or contact the development team.