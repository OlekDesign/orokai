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
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rewardTransactions } from '@/utils/stakingData';
import type { Transaction, TransactionType } from '@/types';
import { cn } from "@/lib/utils";
import { useTransactions } from '@/contexts/TransactionsContext';
import { TransactionRow } from '@/components/TransactionRow';
import { Caption } from '@/components/ui/typography';
import { TransactionDetailsDialog } from '@/components/TransactionDetailsDialog';

export const initialDemoTransactions: Transaction[] = [
  // Failed investment - most recent
  {
    id: 'failed-investment',
    type: 'investment',
    amount: 10000,
    token: 'USDT',
    status: 'failed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago (most recent)
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
    type: 'investment',
    amount: 10000,
    token: 'USDT',
    status: 'failed',
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
  const { transactions, getTransactionsByType } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

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


  const filteredTransactions = getTransactionsByType(filter);

  const getTransactionLabel = (type: TransactionType) => {
    switch (type) {
      case 'investment':
        return 'Investment';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex space-x-2 overflow-x-auto pb-2"
      >
        {(['all', 'rewards', 'withdrawals', 'investment', 'internal'] as const).map((type) => (
          <Button
            key={type}
            onClick={() => handleFilterChange(type)}
            variant={filter === type ? "default" : "secondary"}
            className="whitespace-nowrap"
          >
            {getTransactionLabel(type)}
          </Button>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{ duration: 0.2, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <CardHeader>
              <div className="flex items-center justify-between space-x-4">
                <CardDescription>
                  {filter === 'all' ? 'All transactions' : `${getTransactionLabel(filter)} transactions`}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {/* Desktop Header (full columns) */}
                <TableRow className="hidden md:table-row">
                  <TableHead><Caption>Type</Caption></TableHead>
                  <TableHead><Caption>Amount</Caption></TableHead>
                  <TableHead><Caption>Status</Caption></TableHead>
                  <TableHead><Caption>Date</Caption></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TransactionRow 
                    key={tx.id}
                    transaction={tx}
                    onClick={() => {
                      setSelectedTransaction(tx);
                      setIsTransactionDialogOpen(true);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
              </div>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>

      {/* Transaction Details Dialog */}
      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
      />
    </div>
  );
}