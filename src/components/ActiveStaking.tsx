import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

interface Investment {
  id: string;
  amount: number;
  apy: number;
  chain: string;
  startDate: string;
  endDate: string;
  earned: number;
}

interface ActiveStakingProps {
  staking: Investment;
  onClose?: () => void;
}

export function ActiveStaking({ staking, onClose }: ActiveStakingProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = async () => {
    setIsClosing(true);
    try {
      // Simulate closing staking position
      await new Promise(resolve => setTimeout(resolve, 2000));
      onClose?.();
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h3 className="font-medium">{staking.chain} Staking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {staking.amount.toLocaleString()} USDT
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium text-brand">
            {staking.apy}% APY
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            +{staking.earned.toLocaleString()} USDT earned
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Start Date
                  </div>
                  <div className="font-medium">
                    {new Date(staking.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    End Date
                  </div>
                  <div className="font-medium">
                    {new Date(staking.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                  <Clock size={20} />
                  <div className="text-sm">
                    Time until maturity:
                    <span className="ml-1 text-gray-900 dark:text-white font-medium">
                      {/* Calculate time remaining in a real app */}
                      45 days
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowDetails(false)}
                >
                  Close Details
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  isLoading={isClosing}
                  onClick={handleClose}
                >
                  Close Position
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
