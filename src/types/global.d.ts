type TransactionType = 'rewards' | 'withdrawals' | 'top-up' | 'investment' | 'internal' | 'all';

interface Window {
  addTransaction: (amount: number, token: string, type?: TransactionType) => void;
}