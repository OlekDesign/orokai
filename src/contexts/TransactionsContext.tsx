import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, TransactionType } from '@/types';
import { initialDemoTransactions } from '@/pages/Transactions';

interface TransactionContextValue {
  transactions: Transaction[];
  addTransaction: (type: TransactionType, amount: number, token: string) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  getRecentTransactions: (limit?: number) => Transaction[];
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getPendingTransactions: () => Transaction[];
}

const TransactionsContext = createContext<TransactionContextValue | undefined>(undefined);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  // Sort transactions by timestamp (most recent first)
  const sortedInitialTransactions = [...initialDemoTransactions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const [transactions, setTransactions] = useState<Transaction[]>(sortedInitialTransactions);

  const addTransaction = (type: TransactionType, amount: number, token: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      token,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    setTransactions(prev => {
      const updated = [newTransaction, ...prev];
      // Sort by timestamp (most recent first)
      return updated.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    });

    // Update status to completed after 10 seconds
    setTimeout(() => {
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === newTransaction.id
            ? { ...tx, status: 'completed' }
            : tx
        )
      );
    }, 10000);

    return newTransaction;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id
          ? { ...tx, ...updates }
          : tx
      )
    );
  };

  const getRecentTransactions = (limit = 3) => {
    return transactions
      .filter(tx => tx.type !== 'top-up')
      .slice(0, limit);
  };

  const getTransactionsByType = (type: TransactionType) => {
    // First filter out any top-up transactions
    const filteredTransactions = transactions.filter(tx => tx.type !== 'top-up');
    
    // Then apply the type filter if not 'all'
    return type === 'all'
      ? filteredTransactions
      : filteredTransactions.filter(tx => tx.type === type);
  };

  const getPendingTransactions = () => {
    return transactions.filter(tx => 
      tx.status === 'pending' && tx.type !== 'top-up'
    );
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        getRecentTransactions,
        getTransactionsByType,
        getPendingTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
}
