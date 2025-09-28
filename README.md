# Orokai - Crypto Trading Platform

A modern, production-ready cryptocurrency trading and investment platform built with React, TypeScript, and Vite.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/OlekDesign/orokai.git
cd orokai

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   └── ...             # Feature-specific components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── pages/              # Page components (routes)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and data
└── lib/                # Library configurations
```

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint

# Deployment
npm run predeploy    # Build before deploy
npm run deploy       # Deploy to GitHub Pages
```

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow React functional components with hooks
- Use Tailwind CSS for styling
- Implement responsive design (mobile-first)
- Use shadcn/ui components when possible

### Component Structure

```tsx
// components/ExampleComponent.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ExampleComponentProps {
  title: string;
  onAction?: () => void;
}

export function ExampleComponent({ title, onAction }: ExampleComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button onClick={onAction} disabled={isLoading}>
        Action
      </Button>
    </div>
  );
}
```

### State Management

- Use React Context for global state
- Use local state (useState) for component-specific state
- Consider useReducer for complex state logic

## 🌐 Environment Configuration

Create environment files for different stages:

- `.env.local` - Local development
- `.env.staging` - Staging environment  
- `.env.production` - Production environment

### Environment Variables

```bash
# API Configuration
VITE_API_BASE_URL=https://api.example.com
VITE_WS_URL=wss://ws.example.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# Third-party Services
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_SENTRY_DSN=https://...
```

## 🚀 Production Deployment

### Build Optimization

The project is configured for optimal production builds:

- Tree shaking for smaller bundles
- Code splitting for better loading performance
- Asset optimization and compression
- TypeScript compilation with strict checks

### Deployment Options

1. **GitHub Pages** (Current)
   ```bash
   npm run deploy
   ```

2. **Vercel** (Recommended for production)
   - Connect your GitHub repository
   - Auto-deploys on push to main branch
   - Environment variables in dashboard

3. **Netlify**
   - Drag and drop `dist` folder
   - Or connect GitHub repository

4. **AWS S3 + CloudFront**
   - Upload `dist` folder to S3
   - Configure CloudFront distribution

## 🔐 Security Considerations

- Never commit API keys or secrets
- Use environment variables for configuration
- Implement proper input validation
- Use HTTPS in production
- Implement proper error boundaries
- Add rate limiting for API calls

## 🧪 Testing Strategy

### Recommended Testing Stack

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom
```

### Test Structure

```
src/
├── __tests__/          # Test files
├── components/
│   └── __tests__/      # Component tests
└── utils/
    └── __tests__/      # Utility tests
```

## 📊 Performance Monitoring

### Recommended Tools

- **Sentry** - Error tracking and performance monitoring
- **Google Analytics** - User analytics
- **Lighthouse** - Performance auditing
- **Bundle Analyzer** - Bundle size analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Pull Request Guidelines

- Include a clear description of changes
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass
- Request review from team members

## 📝 API Integration

### API Client Setup

```typescript
// lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiClient {
  private baseURL: string;
  private token?: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options?.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

## 🔄 State Management Patterns

### Context Pattern

```typescript
// contexts/AppContext.tsx
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

interface AppContextType extends AppState {
  login: (user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
  addNotification: (notification: Notification) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

## 📱 Mobile Responsiveness

The platform is built mobile-first with responsive breakpoints:

- `sm`: 640px and up
- `md`: 768px and up  
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

## 🎨 Design System

### Colors

The platform uses a consistent color palette defined in Tailwind config:

- Primary: Blue shades for main actions
- Secondary: Gray shades for secondary elements
- Success: Green for positive actions
- Warning: Yellow for caution
- Error: Red for errors

### Typography

- Headings: Font weights 600-700
- Body: Font weight 400
- Captions: Font weight 300

## 📈 Roadmap

### Phase 1: Foundation (Current)
- ✅ Basic UI components
- ✅ Routing and navigation
- ✅ Responsive design
- ✅ State management

### Phase 2: Core Features
- [ ] User authentication
- [ ] Real-time data integration
- [ ] Trading functionality
- [ ] Portfolio management

### Phase 3: Advanced Features
- [ ] Advanced charting
- [ ] Social features
- [ ] Mobile app
- [ ] API for third-party integrations

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Team Chat**: [Add your team communication channel]

## 📄 License

This project is proprietary. All rights reserved.

---

**Happy coding! 🚀**