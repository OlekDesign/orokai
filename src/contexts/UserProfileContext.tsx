import { createContext, useContext, useState, ReactNode } from 'react';

interface CreditCard {
  id: string;
  last4: string;
  bank: string;
  expiryDate: string;
}

interface Investment {
  id: string;
  amount: number;
  apy: number;
  chain: string;
  startDate: string;
  endDate: string;
  earned: number;
}

interface CryptoWallet {
  address: string;
  network: string;
  isConnected: boolean;
}

interface UserProfileContextType {
  // Payment methods
  hasSavedCard: boolean;
  creditCards: CreditCard[];
  addCreditCard: (card: CreditCard) => void;
  removeCreditCard: (cardId: string) => void;
  
  // Investments
  hasInvestments: boolean;
  investments: Investment[];
  addInvestment: (investment: Investment) => void;
  removeInvestment: (investmentId: string) => void;
  
  // Crypto
  hasCryptoWallet: boolean;
  cryptoWallet: CryptoWallet | null;
  connectCryptoWallet: (wallet: CryptoWallet) => void;
  disconnectCryptoWallet: () => void;

  // User preferences
  preferredPaymentMethod: 'card' | 'crypto' | null;
  setPreferredPaymentMethod: (method: 'card' | 'crypto' | null) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

// Demo initial state for development
const DEMO_STATE = {
  creditCards: [],
  investments: [
    {
      id: '1',
      amount: 1000,
      apy: 12.5,
      chain: 'Ethereum',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),  // 30 days from now
      earned: 10.42
    }
  ],
  cryptoWallet: null,
  preferredPaymentMethod: null,
};

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [creditCards, setCreditCards] = useState<CreditCard[]>(DEMO_STATE.creditCards);
  const [investments, setInvestments] = useState<Investment[]>(DEMO_STATE.investments);
  const [cryptoWallet, setCryptoWallet] = useState<CryptoWallet | null>(DEMO_STATE.cryptoWallet);
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<'card' | 'crypto' | null>(
    DEMO_STATE.preferredPaymentMethod
  );

  const value = {
    // Payment methods
    hasSavedCard: creditCards.length > 0,
    creditCards,
    addCreditCard: (card: CreditCard) => setCreditCards(prev => [...prev, card]),
    removeCreditCard: (cardId: string) => setCreditCards(prev => prev.filter(c => c.id !== cardId)),
    
    // Investments
    hasInvestments: investments.length > 0,
    investments,
    addInvestment: (investment: Investment) => setInvestments(prev => [...prev, investment]),
    removeInvestment: (investmentId: string) => setInvestments(prev => prev.filter(i => i.id !== investmentId)),
    
    // Crypto
    hasCryptoWallet: cryptoWallet !== null,
    cryptoWallet,
    connectCryptoWallet: (wallet: CryptoWallet) => setCryptoWallet(wallet),
    disconnectCryptoWallet: () => setCryptoWallet(null),

    // User preferences
    preferredPaymentMethod,
    setPreferredPaymentMethod,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
