import { Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';

interface WalletCardProps {
  address: string;
  balance: number;
  tokenSymbol: string;
}

export function WalletCard({ address, balance, tokenSymbol }: WalletCardProps) {
  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      // In a real app, show a toast notification
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-brand/10 to-accent/10">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Wallet Address
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="text-muted-foreground hover:text-foreground"
          >
            <Copy size={16} />
          </motion.button>
        </div>
        
        <div className="font-mono text-sm">
          {shortenAddress(address)}
        </div>

        <div className="pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Available Balance
          </span>
          <div className="mt-1 flex items-baseline">
            <span className="text-2xl font-semibold">
              {balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            <span className="ml-1 text-muted-foreground">
              {tokenSymbol}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
