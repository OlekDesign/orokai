import { motion } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';

interface StakingOptionProps {
  title: string;
  chain: string;
  apy: number;
  minAmount: number;
  lockPeriod: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function StakingOptionCard({
  title,
  chain,
  apy,
  minAmount,
  lockPeriod,
  isSelected = false,
  onClick
}: StakingOptionProps) {
  return (
    <Card
      onClick={onClick}
      className={`relative transition-all ${
        isSelected
          ? 'border-2 border-brand shadow-lg'
          : 'hover:shadow-lg cursor-pointer'
      }`}
    >
      {isSelected && (
        <motion.div
          layoutId="selectedIndicator"
          className="absolute -top-2 -right-2 w-6 h-6 bg-brand rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-section">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            on {chain}
          </p>
        </div>

        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold text-brand">
            {apy}%
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            APY
          </span>
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Minimum Stake
            </span>
            <span className="font-medium">
              {minAmount} USDT
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Lock Period
            </span>
            <span className="font-medium">
              {lockPeriod}
            </span>
          </div>
        </div>

        {!onClick && (
          <div className="pt-4">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                // Handle view details
              }}
            >
              View Details
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
