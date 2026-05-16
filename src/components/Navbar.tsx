import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Home, Gem, Clock8, Users, BellRing, TrendingUp, HandCoins, Wallet } from 'lucide-react';
import { MetaMaskIcon } from './MetaMaskIcon';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

const navItems: Array<{
  icon: any;
  label: string;
  mobileLabel?: string;
  path: string;
}> = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Gem, label: 'Passive Income', mobileLabel: 'Passive Income', path: '/invest' },
  { icon: TrendingUp, label: 'Trade', path: '/trading' },
  { icon: HandCoins, label: 'Collateral', path: '/collateral' },
  { icon: Users, label: 'Affiliate', path: '/affiliate' },
  { icon: Clock8, label: 'Transactions', path: '/transactions' },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isNavItemActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 flex-col">
        {/* Logo & Notifications */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link to="/dashboard">
            <img 
              src={`${import.meta.env.BASE_URL}logo-orokai-full-white.svg`}
              alt="Orokai" 
              className="h-5 w-auto"
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <div className="relative">
              <BellRing size={16} />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-background"></span>
            </div>
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full ${
                    isActive
                      ? 'bg-secondary text-foreground border-t border-primary/15'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={16} />
                  <span className={`text-xs leading-none ${isActive ? 'text-white' : 'text-muted-foreground'}`}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Wallet */}
        <div className="p-4 border-t border-border">
          <Link
            to="/wallet"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full ${
              location.pathname === '/wallet'
                ? 'bg-secondary text-foreground border-t border-primary/15'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Wallet size={16} />
            <span className={`text-xs leading-none ${location.pathname === '/wallet' ? 'text-white' : 'text-muted-foreground'}`}>Wallet</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-24 bg-background border-t border-border z-50 pb-4">
        <div className="h-full grid grid-cols-6 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-2 p-2 min-h-[44px] transition-opacity ${
                  isActive ? 'text-primary opacity-100' : 'text-muted-foreground opacity-70'
                }`}
              >
                <Icon size={20} />
                <span className={`text-xs leading-none ${isActive ? 'text-white' : 'text-muted-foreground'}`}>{item.mobileLabel || item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
