import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Gift, 
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { Card } from '../components/Card';
import { rewardTransactions } from '../utils/stakingData';
import type { Transaction, TransactionType } from '../types';

export const initialDemoTransactions: Transaction[] = [
  // Pending transactions at the top
  {
    id: 'pending-1',
    type: 'top-up',
    amount: 2500,
    token: 'USDT',
    status: 'pending',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'pending-2',
    type: 'top-up',
    amount: 1000,
    token: 'USDT',
    status: 'pending',
    timestamp: new Date(Date.now() - 30 * 1000).toISOString(), // 30 seconds ago
  },
  // Completed transactions
  ...(rewardTransactions as Transaction[]),
  {
    id: '6',
    type: 'withdrawals',
    amount: 500,
    token: 'USDT',
    status: 'completed',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    type: 'top-up',
    amount: 1000,
    token: 'USDT',
    status: 'completed',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    type: 'internal',
    amount: 750,
    token: 'USDT',
    status: 'completed',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTx, setSelectedTx] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialDemoTransactions);

  // Get filter from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get('filter') as TransactionType | null;
  const [filter, setFilter] = useState<TransactionType>(filterParam || 'all');

  // Update URL when filter changes
  const handleFilterChange = (newFilter: TransactionType) => {
    setFilter(newFilter);
    if (newFilter === 'all') {
      navigate('/transactions');
    } else {
      navigate(`/transactions?filter=${newFilter}`);
    }
  };

  // Set initial filter from URL on mount
  useEffect(() => {
    if (filterParam && filterParam !== filter) {
      setFilter(filterParam);
    }
  }, [filterParam]);

  // Auto-complete demo pending transactions
  useEffect(() => {
    const timers = initialDemoTransactions
      .filter(tx => tx.status === 'pending')
      .map(tx => {
        const elapsed = Date.now() - new Date(tx.timestamp).getTime();
        const remaining = Math.max(0, 120000 - elapsed);

        return setTimeout(() => {
          setTransactions(prev =>
            prev.map(t =>
              t.id === tx.id ? { ...t, status: 'completed' } : t
            )
          );
        }, remaining);
      });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Function to add a new transaction
  const addTransaction = (amount: number, token: string, type: TransactionType = 'top-up') => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      token,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    setTransactions(prev => [newTransaction, ...prev]);

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
  };

  // Export addTransaction function to make it available to other components
  useEffect(() => {
    window.addTransaction = addTransaction;
    return () => {
      if ('addTransaction' in window) {
        delete (window as any).addTransaction;
      }
    };
  }, []);

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(tx => tx.type === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'rewards':
        return <Gift className="w-5 h-5" />;
      case 'withdrawals':
        return <ArrowDownLeft className="w-5 h-5" />;
      case 'top-up':
        return <ArrowUpRight className="w-5 h-5" />;
      case 'investment':
        return <ArrowUpRight className="w-5 h-5" />;
      case 'internal':
        return <RefreshCw className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'failed':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return '';
    }
  };

  const getTransactionLabel = (type: TransactionType) => {
    switch (type) {
      case 'top-up':
        return 'Top Up';
      case 'investment':
        return 'Investment';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {(['all', 'rewards', 'withdrawals', 'investment', 'top-up', 'internal'] as const).map((type) => (
          <button
            key={type}
            onClick={() => handleFilterChange(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === type
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {getTransactionLabel(type)}
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">Type</th>
                <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">Amount</th>
                <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">Date</th>
                <th className="pb-3 font-medium text-gray-600 dark:text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((tx) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'rewards'
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                          : tx.type === 'withdrawals'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                          : tx.type === 'investment'
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                          : tx.type === 'top-up'
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                          : 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
                      }`}>
                        {getTransactionIcon(tx.type as TransactionType)}
                      </div>
                      <span className="font-medium">
                        {getTransactionLabel(tx.type as TransactionType)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`font-medium ${
                      tx.type === 'withdrawals' 
                        ? 'text-red-600 dark:text-red-400'
                        : tx.type === 'investment'
                        ? 'text-gray-900 dark:text-gray-100'
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {tx.type === 'withdrawals' 
                        ? `-${tx.amount} ${tx.token}`
                        : tx.type === 'investment'
                        ? `${tx.amount} ${tx.token}`
                        : `+${tx.amount} ${tx.token}`}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-sm capitalize ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-600 dark:text-gray-400">
                    {formatDate(tx.timestamp)}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => setSelectedTx(selectedTx === tx.id ? null : tx.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          selectedTx === tx.id ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}