import type { ReactNode } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PiggyBank, History, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { MetaMaskIcon } from './MetaMaskIcon';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: PiggyBank, label: 'Investments', path: '/invest' },
  { icon: History, label: 'Transactions', path: '/transactions' },
];

const DEMO_WALLET = {
  address: '0x1234567890123456789012345678901234567890',
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isWiderLayout = location.pathname === '/transactions';
  const isTransactionReview = location.pathname === '/transaction-review';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop & Mobile Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-elevation z-20">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="text-xl font-semibold text-brand">
              Orokai
            </Link>

            {/* Navigation */}
            {!isTransactionReview && (
              <div className="hidden md:flex items-center space-x-6">
                <nav className="flex items-center space-x-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-brand text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-xs">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Wallet Info */}
                <div className="flex items-center pl-6 border-l border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <MetaMaskIcon size={32} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {DEMO_WALLET.address.slice(0, 6)}...{DEMO_WALLET.address.slice(-4)}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-red-500"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20 md:pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className={`mx-auto px-4 py-6 ${isWiderLayout ? 'container' : 'max-w-[900px]'}`}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-elevation">
        <div className="h-full grid grid-cols-5 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 ${
                  isActive ? 'text-brand' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}