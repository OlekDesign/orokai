import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface OnboardingState {
  // Payment methods
  hasAddedPaymentMethod: boolean;
  
  // Investments
  hasFirstInvestment: boolean;
  hasReceivedReward: boolean;
  hasWithdrawn: boolean;
  
  // Affiliate
  hasFirstAffiliate: boolean;
}

interface OnboardingContextType {
  // State
  state: OnboardingState;
  
  // Actions
  completePaymentMethodStep: () => void;
  completeFirstInvestmentStep: () => void;
  completeFirstRewardStep: () => void;
  completeFirstWithdrawalStep: () => void;
  completeFirstAffiliateStep: () => void;
  
  // Utility methods
  resetOnboarding: () => void;
  
  // Computed properties
  isOnboardingComplete: boolean;
}

const STORAGE_KEY = 'onboarding_state';

const DEFAULT_STATE: OnboardingState = {
  hasAddedPaymentMethod: false,
  hasFirstInvestment: false,
  hasReceivedReward: false,
  hasWithdrawn: false,
  hasFirstAffiliate: false,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or default
  const [state, setState] = useState<OnboardingState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Action handlers
  const completePaymentMethodStep = () => {
    setState(prev => ({ ...prev, hasAddedPaymentMethod: true }));
  };

  const completeFirstInvestmentStep = () => {
    setState(prev => ({ ...prev, hasFirstInvestment: true }));
  };

  const completeFirstRewardStep = () => {
    setState(prev => ({ ...prev, hasReceivedReward: true }));
  };

  const completeFirstWithdrawalStep = () => {
    setState(prev => ({ ...prev, hasWithdrawn: true }));
  };

  const completeFirstAffiliateStep = () => {
    setState(prev => ({ ...prev, hasFirstAffiliate: true }));
  };

  const resetOnboarding = () => {
    setState(DEFAULT_STATE);
  };

  // Computed property
  const isOnboardingComplete = Object.values(state).every(Boolean);

  const value = {
    state,
    completePaymentMethodStep,
    completeFirstInvestmentStep,
    completeFirstRewardStep,
    completeFirstWithdrawalStep,
    completeFirstAffiliateStep,
    resetOnboarding,
    isOnboardingComplete,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
