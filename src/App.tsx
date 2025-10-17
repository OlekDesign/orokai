import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProfileProvider, useUserProfile } from './contexts/UserProfileContext';
import { TransactionsProvider } from './contexts/TransactionsContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { ToastProvider } from './contexts/ToastContext';
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
import { CreateInvestment } from './pages/CreateInvestment';
import { NewInvestment } from './pages/NewInvestment';
import { Transactions } from './pages/Transactions';
import TransactionsEmpty from './pages/Transactions-empty';
import { TransactionReview } from './pages/TransactionReview';
import { TypographyDemo } from './components/TypographyDemo';
import { ColorGuide } from './pages/ColorGuide';


// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// Profile protected route wrapper (redirects to create profile if no profile exists)
function ProfileProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { profile } = useUserProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!profile) {
    return <Navigate to="/create-profile" />;
  }

  return <>{children}</>;
}

// Public route wrapper (redirects to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
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
            <Layout>
              <TransactionReview />
            </Layout>
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
            <OnboardingProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </OnboardingProvider>
          </TransactionsProvider>
        </UserProfileProvider>
      </AuthProvider>
    </Router>
  );
}