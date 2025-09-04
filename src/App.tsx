import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Wallet } from './pages/Wallet';
import { Investments } from './pages/Investments';
import { CreateInvestment } from './pages/CreateInvestment';
import { Transactions } from './pages/Transactions';
import { TransactionReview } from './pages/TransactionReview';


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
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Layout>
              <Wallet />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/invest"
        element={
          <ProtectedRoute>
            <Layout>
              <Investments />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/invest/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateInvestment />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Layout>
              <Transactions />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transaction-review"
        element={
          <ProtectedRoute>
            <Layout>
              <TransactionReview />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Redirect root to login or dashboard */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProfileProvider>
          <AppRoutes />
        </UserProfileProvider>
      </AuthProvider>
    </Router>
  );
}