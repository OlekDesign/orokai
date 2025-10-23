# Orokai Crypto Platform - Product Requirements Document (PRD)

## Table of Contents
1. [Product Overview](#product-overview)
2. [Target Audience](#target-audience)
3. [Core Features](#core-features)
4. [Technical Architecture](#technical-architecture)
5. [User Experience & Design](#user-experience--design)
6. [Development Requirements](#development-requirements)
7. [Deployment & Infrastructure](#deployment--infrastructure)
8. [Success Metrics](#success-metrics)

## Product Overview

### Vision
Orokai is a modern, user-friendly crypto investment platform that simplifies passive income generation through staking and yield farming. The platform bridges the gap between traditional finance and decentralized finance (DeFi) by providing an intuitive interface for crypto investments.

### Mission
To democratize access to crypto passive income opportunities by providing a secure, transparent, and easy-to-use platform that allows users to earn rewards on their crypto holdings.

### Key Value Propositions
- **Simplified DeFi Access**: Remove complexity from crypto staking and yield farming
- **Passive Income Focus**: Automated reward generation with minimal user intervention
- **Multi-Chain Support**: Support for multiple blockchain networks (Ethereum, Solana, Cosmos, etc.)
- **Traditional Finance Integration**: Credit card integration for easy onboarding
- **Affiliate Program**: Built-in referral system for user growth

## Target Audience

### Primary Users
- **Crypto Beginners**: New to crypto seeking simple passive income opportunities
- **Retail Investors**: Looking for alternative investment options beyond traditional markets
- **DeFi Curious**: Users interested in DeFi but intimidated by complexity

### Secondary Users
- **Crypto Enthusiasts**: Experienced users seeking convenient staking solutions
- **Affiliate Marketers**: Users interested in earning through referrals

### User Personas
1. **Sarah, 28, Marketing Professional**: New to crypto, wants simple passive income
2. **Mike, 35, Software Engineer**: Tech-savvy but wants streamlined DeFi experience
3. **Alex, 42, Financial Advisor**: Exploring crypto for clients, needs professional interface

## Core Features

### 1. Authentication & Onboarding
- **Multiple Login Options**:
  - Email/password authentication
  - Social logins (Google, Twitter, Apple)
  - Wallet connections (MetaMask, WalletConnect, 480+ wallets)
- **Profile Creation**: Name, avatar, preferences
- **Guided Onboarding**: Step-by-step introduction to platform features

### 2. Dashboard
- **Portfolio Overview**: Total rewards, investment performance
- **Interactive Charts**: Time-based performance visualization (week/month/all-time)
- **Reward Tracking**: Real-time reward accumulation with progress indicators
- **Quick Actions**: Fast access to investment and withdrawal functions
- **Recent Transactions**: Latest activity summary

### 3. Investment Management
- **Investment Calculator**: Real-time return estimation
- **Multi-Currency Support**: USD, ETH, ATOM, SOL with automatic conversion
- **Investment Options Comparison**:
  - Provider comparison table
  - APY, frequency, fees comparison
  - Sortable by multiple criteria
- **Active Investment Tracking**: Performance monitoring, time since start
- **Investment Closure**: Withdraw investments with confirmation flows

### 4. Wallet Integration
- **Crypto Wallet Management**:
  - MetaMask integration
  - Multi-asset portfolio display
  - Address copying functionality
- **Fiat Payment Methods**:
  - Credit card management
  - Multiple card support
  - Secure payment processing
- **Fund Management**:
  - Withdrawal to cards
  - Reinvestment options
  - Available cash tracking

### 5. Transaction History
- **Comprehensive Tracking**:
  - All transaction types (rewards, withdrawals, investments, internal)
  - Filterable by type and status
  - Real-time status updates
- **Transaction Details**: Amount, token, timestamp, status
- **Export Capabilities**: Transaction history export (implied)

### 6. Affiliate System
- **Referral Link Generation**: Unique affiliate links
- **Multi-Level Tracking**: 3-level affiliate structure
- **Reward Calculation**: Percentage-based commission system
- **Affiliate Dashboard**:
  - Total rewards earned
  - Referral performance tracking
  - Level-based filtering
- **Social Sharing**: Easy link sharing capabilities

### 7. Notification System
- **Toast Notifications**: Success, error, warning, info messages
- **Real-time Updates**: Investment status, reward notifications
- **User Feedback**: Clear confirmation messages for actions

## Technical Architecture

### Frontend Stack
- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router DOM 7.8.1
- **Styling**: Tailwind CSS 3.3.0 with custom design system
- **UI Components**: 
  - Radix UI primitives for accessibility
  - Custom component library with consistent typography
- **Animations**: Framer Motion 12.23.12
- **Charts**: Recharts 3.1.2 for data visualization
- **State Management**: React Context API with custom hooks

### Component Architecture
```
src/
├── components/
│   ├── ui/           # Base UI components (Button, Input, Typography, etc.)
│   ├── Layout.tsx    # Main layout wrapper
│   ├── Navbar.tsx    # Navigation component
│   └── ...           # Feature-specific components
├── contexts/         # React Context providers
├── pages/           # Route-specific page components
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── lib/             # Third-party library configurations
```

### State Management
- **AuthContext**: User authentication and session management
- **UserProfileContext**: Profile data, investments, payment methods
- **TransactionsContext**: Transaction history and management
- **OnboardingContext**: User onboarding progress tracking
- **ToastContext**: Notification system

### Responsive Design
- **Mobile-First Approach**: Optimized for mobile devices
- **Breakpoints**: Tailwind CSS responsive utilities
- **Navigation**: 
  - Desktop: Fixed sidebar navigation
  - Mobile: Bottom tab navigation
- **Touch-Friendly**: Minimum 44px touch targets on mobile

### Data Flow
1. **Authentication**: JWT-based session management (simulated)
2. **API Integration**: RESTful API structure (currently mocked)
3. **Real-time Updates**: WebSocket connections for live data (planned)
4. **Local Storage**: Persistent user preferences and session data

## User Experience & Design

### Design System
- **Color Palette**: 
  - Primary: Blue (#0EA5E9)
  - Success: Green (#059669)
  - Warning: Yellow (#EAB308)
  - Error: Red (#DC2626)
- **Typography Scale**: 
  - Display, Heading (1-4), Body (Large, Regular, Small), Label, Caption
- **Spacing**: Consistent 4px grid system
- **Border Radius**: Consistent rounded corners (0.5rem default)

### User Flows
1. **Onboarding Flow**:
   - Login/Registration → Profile Creation → Investment Setup → First Investment
2. **Investment Flow**:
   - Amount Input → Provider Selection → Confirmation → Transaction Processing
3. **Withdrawal Flow**:
   - Investment Selection → Confirmation → Processing → Completion

### Accessibility
- **WCAG 2.1 AA Compliance**: Color contrast, keyboard navigation
- **Screen Reader Support**: Semantic HTML, ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Clear focus indicators

### Performance
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format, responsive images
- **Bundle Size**: Optimized with tree shaking
- **Loading States**: Skeleton screens, progress indicators

## Development Requirements

### Prerequisites
- **Node.js**: Version 18+ 
- **Package Manager**: npm or yarn
- **Git**: Version control
- **Modern Browser**: Chrome, Firefox, Safari, Edge

### Development Environment
```bash
# Clone repository
git clone <repository-url>
cd crypto-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality
- **ESLint**: Code linting with React-specific rules
- **TypeScript**: Strict type checking
- **Prettier**: Code formatting (implied)
- **Husky**: Git hooks for quality gates (recommended)

### Testing Strategy
- **Unit Tests**: Jest + React Testing Library (to be implemented)
- **Integration Tests**: Cypress or Playwright (to be implemented)
- **E2E Tests**: Critical user flows (to be implemented)

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+

## Deployment & Infrastructure

### Current Deployment
- **Platform**: GitHub Pages
- **Build Process**: GitHub Actions (implied)
- **Domain**: Custom domain support
- **SSL**: HTTPS enabled

### Production Architecture (Recommended)
```
Frontend (React SPA)
├── CDN (CloudFront/Cloudflare)
├── Static Hosting (S3/Netlify/Vercel)
└── API Gateway
    ├── Authentication Service
    ├── Investment Service
    ├── Transaction Service
    ├── Notification Service
    └── Database (PostgreSQL/MongoDB)
```

### Environment Configuration
- **Development**: Local development with mock data
- **Staging**: Pre-production testing environment
- **Production**: Live environment with real integrations

### Security Requirements
- **HTTPS**: All communications encrypted
- **CSP**: Content Security Policy headers
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Token-based protection
- **Wallet Security**: Secure wallet integration practices

## Success Metrics

### Key Performance Indicators (KPIs)
1. **User Acquisition**:
   - Monthly Active Users (MAU)
   - User registration rate
   - Conversion from visitor to user

2. **User Engagement**:
   - Session duration
   - Pages per session
   - Return user rate
   - Feature adoption rates

3. **Financial Metrics**:
   - Total Value Locked (TVL)
   - Average investment amount
   - Revenue per user
   - Transaction volume

4. **Product Metrics**:
   - Investment completion rate
   - Withdrawal success rate
   - Support ticket volume
   - User satisfaction score

### Analytics Implementation
- **Google Analytics**: User behavior tracking
- **Mixpanel/Amplitude**: Event-based analytics
- **Error Tracking**: Sentry or similar service
- **Performance Monitoring**: Core Web Vitals tracking

### A/B Testing Framework
- **Investment Flow Optimization**: Test different UX flows
- **Onboarding Optimization**: Improve user activation
- **Feature Testing**: Validate new feature effectiveness

## Technical Considerations

### Blockchain Integration
- **Web3 Libraries**: ethers.js or web3.js for blockchain interaction
- **Multi-Chain Support**: Abstract chain-specific logic
- **Transaction Monitoring**: Real-time transaction status updates
- **Gas Optimization**: Efficient smart contract interactions

### Scalability
- **Component Reusability**: Modular component architecture
- **Code Splitting**: Lazy loading for performance
- **State Management**: Scalable context architecture
- **API Design**: RESTful with GraphQL consideration

### Maintenance
- **Documentation**: Comprehensive component documentation
- **Version Control**: Semantic versioning
- **Dependency Management**: Regular security updates
- **Monitoring**: Application performance monitoring

## Future Enhancements

### Phase 2 Features
- **Advanced Analytics**: Detailed portfolio analytics
- **Mobile App**: Native iOS/Android applications
- **DeFi Integration**: Direct protocol integrations
- **Social Features**: Community and social trading

### Phase 3 Features
- **Institutional Features**: Bulk operations, reporting
- **Advanced Trading**: Limit orders, stop-loss
- **Governance**: Platform governance token
- **API Access**: Public API for third-party integrations

---

## Conclusion

This PRD provides a comprehensive blueprint for recreating the Orokai crypto platform. The document covers all essential aspects from technical implementation to user experience design, ensuring that developers have all the information needed to build a production-ready crypto investment platform.

The platform successfully combines modern web development practices with crypto-specific functionality, creating an accessible entry point for users interested in passive crypto income generation.

