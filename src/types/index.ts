export type TransactionType = 'all' | 'rewards' | 'withdrawals' | 'investment' | 'internal' | 'top-up' | 'closure';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  token: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

declare global {
  interface Window {
    addTransaction: (amount: number, token: string, type?: TransactionType) => void;
  }
}

export {}