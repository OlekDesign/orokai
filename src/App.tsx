import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProfileProvider, useUserProfile } from './contexts/UserProfileContext';
import { TransactionsProvider } from './contexts/TransactionsContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { useOnboarding } from './contexts/OnboardingContext';
import { ToastProvider } from './contexts/ToastContext';
import { WidgetProvider } from './contexts/WidgetContext';
import { TooltipProvider } from './components/ui/tooltip';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Login } from './pages/Login';
import CreateProfile from './pages/CreateProfile';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import DashboardEmpty from './pages/Dashboard-empty';
import { Wallet } from './pages/Wallet';
import WalletEmpty from './pages/Wallet-empty';
import { Investments } from './pages/Investments';
import InvestmentsEmpty from './pages/Investments-empty';
import { Affiliate } from './pages/Affiliate';
import AffiliateEmpty from './pages/Affiliate-empty';
import { AffiliateProgram } from './pages/AffiliateProgram';
import { AffiliateAnalytics } from './pages/Affiliate-analytics';
import { MyNFT } from './pages/my-nft';
import { CreateInvestment } from './pages/CreateInvestment';
import { NewInvestment } from './pages/NewInvestment';
import { NewPassiveIncome } from './pages/NewPassiveIncome';
import { Transactions } from './pages/Transactions';
import TransactionsEmpty from './pages/Transactions-empty';
import { TransactionReview } from './pages/TransactionReview';
import { TypographyDemo } from './components/TypographyDemo';
import { ColorGuide } from './pages/ColorGuide';
import DesignSystem from './pages/DesignSystem';
import { TradingProvider } from './context/TradingContext';
import { CollateralProvider } from './context/CollateralContext';
import { Positions } from './pages/trading/Positions';
import { TradeBrowser } from './pages/trading/TradeBrowser';
import { OpenPosition } from './pages/trading/OpenPosition';
import { PreventLiquidation } from './pages/trading/PreventLiquidation';
import { CollateralPositions } from './pages/collateral/Positions';
import { CollateralTradeBrowser } from './pages/collateral/TradeBrowser';
import { CollateralOpenPosition } from './pages/collateral/OpenPosition';
import { CollateralPreventLiquidation } from './pages/collateral/PreventLiquidation';


function RedirectFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">
      Loading…
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <RedirectFallback />;
  }

  return <>{children}</>;
}

// Profile protected route wrapper (redirects to create profile if no profile exists)
function ProfileProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { profile } = useUserProfile();
  const { state } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (!profile) {
      navigate('/create-profile', { replace: true });
      return;
    }
    if (!state.hasCompletedIntro && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
      return;
    }
    if (state.hasCompletedIntro && location.pathname === '/onboarding') {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoading, user, profile, state.hasCompletedIntro, location.pathname, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !profile) {
    return <RedirectFallback />;
  }

  if (!state.hasCompletedIntro && location.pathname !== '/onboarding') {
    return <RedirectFallback />;
  }

  if (state.hasCompletedIntro && location.pathname === '/onboarding') {
    return <RedirectFallback />;
  }

  return <>{children}</>;
}

// Public route wrapper (redirects to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { profile } = useUserProfile();
  const { state } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      if (!profile) {
        navigate('/create-profile', { replace: true });
        return;
      }
      navigate(state.hasCompletedIntro ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [isLoading, user, profile, state.hasCompletedIntro, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <RedirectFallback />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/create-profile"
        element={
          <ProtectedRoute>
            <CreateProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProfileProtectedRoute>
            <Onboarding />
          </ProfileProtectedRoute>
        }
      />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/dashboard-empty"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <DashboardEmpty />
            </Layout>
          </ProfileProtectedRoute>
        }
      />

      {/* Wallet Routes */}
      <Route
        path="/wallet"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <Wallet />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/wallet-empty"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <WalletEmpty />
            </Layout>
          </ProfileProtectedRoute>
        }
      />

      {/* Investment Routes */}
      <Route
        path="/invest"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <Investments />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/invest-empty"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <InvestmentsEmpty />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/invest/create"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <CreateInvestment />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/invest/new"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <NewPassiveIncome />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/new-investment"
        element={
          <ProfileProtectedRoute>
            <NewInvestment />
          </ProfileProtectedRoute>
        }
      />

      {/* Transaction Routes */}
      <Route
        path="/transactions"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <Transactions />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/transactions-empty"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <TransactionsEmpty />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/transaction-review"
        element={
          <ProfileProtectedRoute>
            <TransactionReview />
          </ProfileProtectedRoute>
        }
      />

      {/* Affiliate Routes */}
      <Route
        path="/affiliate"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <Affiliate />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/affiliate-empty"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <AffiliateEmpty />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/affiliate-program"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <AffiliateProgram />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/affiliate-analytics"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <AffiliateAnalytics />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/my-nft"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <MyNFT />
            </Layout>
          </ProfileProtectedRoute>
        }
      />

      {/* Trading Routes */}
      <Route
        path="/trading"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <Positions />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/trading/trade"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <TradeBrowser />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/trading/open"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <OpenPosition />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/trading/prevent-liquidation"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <PreventLiquidation />
            </Layout>
          </ProfileProtectedRoute>
        }
      />

      {/* Collateral Routes */}
      <Route
        path="/collateral"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <CollateralPositions />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/collateral/trade"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <CollateralTradeBrowser />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/collateral/open"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <CollateralOpenPosition />
            </Layout>
          </ProfileProtectedRoute>
        }
      />
      <Route
        path="/collateral/prevent-liquidation"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <CollateralPreventLiquidation />
            </Layout>
          </ProfileProtectedRoute>
        }
      />

      {/* Typography Demo Route */}
      <Route
        path="/typography-demo"
        element={
          <ProfileProtectedRoute>
            <Layout>
              <TypographyDemo />
            </Layout>
          </ProfileProtectedRoute>
        }
      />

      {/* Color Guide Route */}
      <Route
        path="/color-guide"
        element={
          <ProfileProtectedRoute>
            <ColorGuide />
          </ProfileProtectedRoute>
        }
      />

      <Route
        path="/design-system"
        element={
          <DesignSystem />
        }
      />

      {/* Redirect root to login, profile creation, or dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProfileProvider>
          <TransactionsProvider>
            <TradingProvider>
              <CollateralProvider>
                <OnboardingProvider>
                  <ToastProvider>
                    <WidgetProvider>
                      <TooltipProvider>
                        <AppRoutes />
                      </TooltipProvider>
                    </WidgetProvider>
                  </ToastProvider>
                </OnboardingProvider>
              </CollateralProvider>
            </TradingProvider>
          </TransactionsProvider>
        </UserProfileProvider>
      </AuthProvider>
    </Router>
  );
}
