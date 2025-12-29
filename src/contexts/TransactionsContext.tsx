import { createContext, useContext, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, TransactionType } from '@/types';
import { initialDemoTransactions } from '@/pages/Transactions';

interface TransactionContextValue {
  transactions: Transaction[];
  addTransaction: (type: TransactionType, amount: number, token: string, timeoutMs?: number) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  completeTransaction: (id: string) => void;
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
  // Store timeout IDs so we can cancel them
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addTransaction = (type: TransactionType, amount: number, token: string, timeoutMs?: number) => {
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

    // Determine timeout: 20s for withdrawals, 10s for others (or use provided timeout)
    const timeout = timeoutMs ?? (type === 'withdrawals' ? 20000 : 10000);

    // Update status to completed after timeout
    const timeoutId = setTimeout(() => {
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === newTransaction.id
            ? { ...tx, status: 'completed' }
            : tx
        )
      );
      timeoutRefs.current.delete(newTransaction.id);
    }, timeout);

    timeoutRefs.current.set(newTransaction.id, timeoutId);

    return newTransaction;
  };

  const completeTransaction = (id: string) => {
    // Clear the timeout if it exists
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }

    // Update transaction status to completed immediately
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id
          ? { ...tx, status: 'completed' }
          : tx
      )
    );
  };

  const removeTransaction = (id: string) => {
    // Clear the timeout if it exists
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }

    setTransactions(prev => prev.filter(tx => tx.id !== id));
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
        removeTransaction,
        completeTransaction,
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
