import { Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './Card';

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
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Wallet Address
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Copy size={16} />
          </motion.button>
        </div>
        
        <div className="font-mono text-sm">
          {shortenAddress(address)}
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Available Balance
          </span>
          <div className="mt-1 flex items-baseline">
            <span className="text-2xl font-semibold">
              {balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            <span className="ml-1 text-gray-600 dark:text-gray-400">
              {tokenSymbol}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
