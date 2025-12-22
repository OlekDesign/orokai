import { Gift, ArrowDownLeft, ArrowUpRight, RefreshCw, ChevronDown } from 'lucide-react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BodyText, Caption } from "@/components/ui/typography";
import type { Transaction, TransactionType } from '@/types';

interface TransactionRowProps {
  transaction: Transaction;
  showExpandButton?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClick?: () => void;
}

export function TransactionRow({ 
  transaction, 
  showExpandButton = false, 
  isExpanded = false, 
  onToggleExpand,
  onClick
}: TransactionRowProps) {
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'rewards':
        return <Gift className="h-4 w-4" />;
      case 'withdrawals':
        return <ArrowDownLeft className="h-4 w-4" />;
      case 'investment':
      case 'top-up':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'internal':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
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
        return 'Internal';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile Layout (default) */}
      <TableRow 
        className={cn(
          "md:hidden transition-colors",
          isExpanded && "bg-accent/30",
          onClick && "cursor-pointer hover:bg-accent/20"
        )}
        onClick={onClick}
      >
        <TableCell className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                transaction.type === 'rewards' && "bg-success/10 text-success",
                transaction.type === 'withdrawals' && "bg-destructive/10 text-destructive",
                (transaction.type === 'investment' || transaction.type === 'top-up') && "bg-info/10 text-info",
                transaction.type === 'internal' && "bg-accent/30 text-muted-foreground"
              )}>
                {getTransactionIcon(transaction.type as TransactionType)}
              </div>
              <div>
                <BodyText className="text-foreground font-medium">
                  {getTransactionLabel(transaction.type as TransactionType)}
                </BodyText>
                <Caption className="text-muted-foreground">
                  {formatDate(transaction.timestamp)}
                </Caption>
              </div>
            </div>
            <div className="text-right">
              <BodyText className="text-foreground font-medium">
                {transaction.type === 'withdrawals' 
                  ? `-$${transaction.amount.toLocaleString()}`
                  : transaction.type === 'investment'
                  ? `$${transaction.amount.toLocaleString()}`
                  : `+$${transaction.amount.toLocaleString()}`}
              </BodyText>
              <div className="flex justify-end mt-1">
                <span className={cn(
                  "inline-block px-2 py-1 rounded-full capitalize w-fit text-xs font-light leading-none",
                  transaction.status === 'completed' && "text-success-foreground bg-success/10",
                  transaction.status === 'pending' && "text-white bg-warning/10",
                  transaction.status === 'failed' && "text-destructive-foreground bg-destructive/10"
                )}>
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>

      {/* Desktop Layout (md and up) */}
      <TableRow 
        className={cn(
          "hidden md:table-row transition-colors",
          isExpanded && "bg-accent/30",
          onClick && "cursor-pointer hover:bg-accent/20"
        )}
        onClick={onClick}
      >
        <TableCell>
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              transaction.type === 'rewards' && "bg-success/10 text-success",
              transaction.type === 'withdrawals' && "bg-destructive/10 text-destructive",
              (transaction.type === 'investment' || transaction.type === 'top-up') && "bg-info/10 text-info",
              transaction.type === 'internal' && "bg-accent/30 text-muted-foreground"
            )}>
              {getTransactionIcon(transaction.type as TransactionType)}
            </div>
            <BodyText className="text-foreground">
              {getTransactionLabel(transaction.type as TransactionType)}
            </BodyText>
          </div>
        </TableCell>
        <TableCell>
          <BodyText className="text-foreground">
            {transaction.type === 'withdrawals' 
              ? `-$${transaction.amount.toLocaleString()}`
              : transaction.type === 'investment'
              ? `$${transaction.amount.toLocaleString()}`
              : `+$${transaction.amount.toLocaleString()}`}
          </BodyText>
        </TableCell>
        <TableCell>
          <span className={cn(
            "inline-block px-2 py-1 rounded-full capitalize w-fit text-xs font-light leading-none",
            transaction.status === 'completed' && "text-success-foreground bg-success/10",
            transaction.status === 'pending' && "text-white bg-warning/10",
            transaction.status === 'failed' && "text-destructive-foreground bg-destructive/10"
          )}>
            {transaction.status}
          </span>
        </TableCell>
        <TableCell>
          <BodyText className="text-muted-foreground">
            {formatDate(transaction.timestamp)}
          </BodyText>
        </TableCell>
        {showExpandButton && (
          <TableCell>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleExpand}
              className="rounded-full"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            </Button>
          </TableCell>
        )}
      </TableRow>
    </>
  );
}
