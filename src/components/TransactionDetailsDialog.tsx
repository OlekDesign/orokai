import { type ReactNode } from 'react';
import { Gift, ArrowDownLeft, ArrowUpRight, RefreshCw, Check, Clock, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BodyText, Caption, Heading2 } from '@/components/ui/typography';
import type { Transaction, TransactionType } from '@/types';

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) {
  if (!transaction) return null;

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'rewards':
        return <Gift className="h-6 w-6" />;
      case 'withdrawals':
        return <ArrowDownLeft className="h-6 w-6" />;
      case 'investment':
      case 'top-up':
        return <ArrowUpRight className="h-6 w-6" />;
      case 'internal':
        return <RefreshCw className="h-6 w-6" />;
      default:
        return <RefreshCw className="h-6 w-6" />;
    }
  };

  const getTransactionLabel = (type: TransactionType) => {
    switch (type) {
      case 'rewards':
        return 'Reward';
      case 'withdrawals':
        return 'Withdrawal';
      case 'investment':
        return 'Investment';
      case 'top-up':
        return 'Top Up';
      case 'internal':
        return 'Internal Transfer';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  };

  const { date, time } = formatDate(transaction.timestamp);

  const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="flex flex-row items-center justify-between gap-2 py-3 border-b border-border last:border-0">
      <Caption className="text-muted-foreground">{label}</Caption>
      <div className="text-left">{value}</div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:p-6 p-4">
        <DialogHeader className="text-left">
          <DialogTitle className="sr-only">Transaction Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              transaction.type === 'rewards' && "bg-success/10 text-success",
              transaction.type === 'withdrawals' && "bg-destructive/10 text-destructive",
              (transaction.type === 'investment' || transaction.type === 'top-up') && "bg-info/10 text-info",
              transaction.type === 'internal' && "bg-accent/30 text-muted-foreground"
            )}>
              {getTransactionIcon(transaction.type as TransactionType)}
            </div>
            <div>
              <Heading2 className="text-foreground">
                {getTransactionLabel(transaction.type as TransactionType)}
              </Heading2>
              <BodyText className="text-muted-foreground mt-1">
                {transaction.type === 'withdrawals' 
                  ? `-$${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : transaction.type === 'investment'
                  ? `$${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : `+$${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </BodyText>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-0">
            <DetailRow
              label="Status"
              value={
                <span className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
                  transaction.status === 'completed' && "text-success-foreground bg-success/10",
                  transaction.status === 'pending' && "text-warning-foreground bg-warning/10",
                  transaction.status === 'failed' && "text-destructive-foreground bg-destructive/10"
                )}>
                  {getStatusIcon(transaction.status)}
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              }
            />
            <DetailRow
              label="Date"
              value={<BodyText className="text-foreground">{date}</BodyText>}
            />
            <DetailRow
              label="Time"
              value={<BodyText className="text-foreground">{time}</BodyText>}
            />
            <DetailRow
              label="Token"
              value={<BodyText className="text-foreground">{transaction.token}</BodyText>}
            />
            <DetailRow
              label="Transaction ID"
              value={
                <BodyText className="text-foreground font-mono text-sm break-all">
                  {transaction.id}
                </BodyText>
              }
            />
            {transaction.status === 'failed' && (
              <div className="flex flex-col gap-2 py-3 border-b border-border last:border-0">
                <Caption className="text-muted-foreground">Details</Caption>
                <BodyText className="text-foreground">
                  Transaction failed due to insufficient funds or network error. Please try again.
                </BodyText>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

