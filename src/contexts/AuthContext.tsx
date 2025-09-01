import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type WalletType = 'walletconnect' | 'metamask' | 'other' | null;

interface User {
  id: string;
  email: string;
  hasWallet: boolean;
  hasFunds: boolean;
  isWalletUser: boolean;
  walletType: WalletType;
  walletAddress: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithWallet: (walletType: WalletType) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  connectWallet: (walletType: string) => Promise<void>;
  addFunds: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const user = {
        id: Math.random().toString(36).slice(2),
        email,
        hasWallet: false,
        hasFunds: false,
        isWalletUser: false,
        walletType: null,
        walletAddress: null,
      };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithWallet = async (walletType: WalletType) => {
    setIsLoading(true);
    try {
      // Simulate wallet connection and address retrieval
      const mockWalletAddress = '0x' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      
      const user = {
        id: Math.random().toString(36).slice(2),
        email: `${mockWalletAddress.slice(0, 10)}@wallet.user`,
        hasWallet: true,
        hasFunds: false,
        isWalletUser: true,
        walletType: walletType,
        walletAddress: mockWalletAddress,
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    // Similar to login for this demo
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const connectWallet = async (walletType: string) => {
    if (!user) return;
    
    // Simulate wallet connection
    const updatedUser = { ...user, hasWallet: true };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const addFunds = async (amount: number) => {
    if (!user) return;
    
    // Simulate adding funds
    const updatedUser = { ...user, hasFunds: true };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      loginWithWallet,
      signup,
      logout,
      connectWallet,
      addFunds,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
