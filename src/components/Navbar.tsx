import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Home, Gem, Clock8, LogOut, Users, User } from 'lucide-react';
import { MetaMaskIcon } from './MetaMaskIcon';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../contexts/UserProfileContext';

const navItems: Array<{
  icon: any;
  label: string;
  mobileLabel?: string;
  path: string;
}> = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Gem, label: 'Passive Income', mobileLabel: 'Passive Income', path: '/invest' },
  { icon: Clock8, label: 'Transactions', path: '/transactions' },
  { icon: Users, label: 'Affiliate', path: '/affiliate' },
];

const DEMO_WALLET = {
  address: '0x1234567890123456789012345678901234567890',
};

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile } = useUserProfile();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/dashboard">
            <img 
              src="/logo-orokai-full.png" 
              alt="Orokai" 
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

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

        {/* Wallet Info & Logout */}
        <div className="p-4 border-t border-border">
          <div 
            className={`flex items-center space-x-3 px-4 py-3 cursor-pointer rounded-lg transition-colors w-full ${
              location.pathname === '/wallet'
                ? 'bg-secondary text-foreground border-t border-primary/15'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            onClick={() => navigate('/wallet')}
          >
              <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-muted">
                {profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name || "Profile"} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={16} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col">
                {profile?.name && (
                  <span className={`text-xs font-medium ${
                    location.pathname === '/wallet' ? 'text-white' : 'text-foreground'
                  }`}>
                    {profile.name}
                  </span>
                )}
                <span className={`text-xs ${
                  location.pathname === '/wallet' ? 'text-white' : 'text-muted-foreground'
                }`}>
                  {DEMO_WALLET.address.slice(0, 6)}...{DEMO_WALLET.address.slice(-4)}
                </span>
              </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-24 bg-background border-t border-border z-50 pb-4">
        <div className="h-full grid grid-cols-4 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-2 p-2 min-h-[44px] min-w-[112px] transition-opacity ${
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