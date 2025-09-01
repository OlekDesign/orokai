import { useNavigate } from 'react-router-dom';
import { Plus, Wallet, ArrowRight } from 'lucide-react';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { useUserProfile } from '../contexts/UserProfileContext';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function Investments() {
  const navigate = useNavigate();
  const { investments, removeInvestment } = useUserProfile();
  const [investAmount, setInvestAmount] = useState(10000);

  const handleWithdraw = (investmentId: string) => {
    removeInvestment(investmentId);
  };

  // Helper function to calculate time since investment start
  const getTimeSince = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  };

  // Calculate next reward time (similar to Dashboard.tsx)
  const calculateNextReward = (startDate: string) => {
    const lastRewardTime = new Date(startDate);
    const nextRewardTime = new Date(lastRewardTime.getTime() + 24 * 60 * 60 * 1000);
    const timeUntilNextReward = Math.max(0, nextRewardTime.getTime() - Date.now());
    const totalRewardPeriod = 24 * 60 * 60 * 1000;
    const progressPercentage = ((totalRewardPeriod - timeUntilNextReward) / totalRewardPeriod) * 100;
    
    const hoursUntilReward = Math.floor(timeUntilNextReward / (1000 * 60 * 60));
    return { progressPercentage, hoursUntilReward };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Your Investments</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {investments.length} active {investments.length === 1 ? 'investment' : 'investments'}
        </div>
      </div>
      
      {investments.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-8">Create your first investment</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Investment</label>
                <input
                  type="text"
                  value={`$${investAmount.toLocaleString()}`}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setInvestAmount(Number(value) || 0);
                  }}
                  className="w-full h-14 px-4 text-2xl font-semibold bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50"
                />
              </div>

              <div className="flex justify-start">
                <ArrowRight className="text-gray-400 rotate-90" size={24} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Estimated Return (APY 7.8%)</label>
                <div className="w-full h-14 px-4 text-2xl font-semibold bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center text-brand">
                  ${(investAmount * 1.078).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button 
                onClick={() => navigate('/transaction-review', { 
                  state: { amount: investAmount } 
                })} 
                className="w-full h-14 rounded-xl">
                Review Order
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
          {/* New Investment Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              onClick={() => navigate('/transaction-review')}
              className="min-w-[300px] h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-brand dark:hover:border-brand transition-colors cursor-pointer group"
            >
              <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 group-hover:text-brand transition-colors">
                <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center mb-4">
                  <Plus size={24} />
                </div>
                <span className="font-medium">New Investment</span>
              </div>
            </Card>
          </motion.div>

          {/* Active Investment Cards */}
          {[...investments]
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
          .map((investment) => {
          const timeSince = getTimeSince(investment.startDate);
          const { progressPercentage, hoursUntilReward } = calculateNextReward(investment.startDate);
          
          return (
            <motion.div
              key={investment.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="min-w-[300px] h-[400px] p-6 flex flex-col">
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Rewards</h2>
                    <p className="text-3xl font-bold mt-1 text-brand">
                      ${investment.earned.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Since</h2>
                    <p className="text-lg font-medium mt-1">
                      {timeSince.days}d {timeSince.hours}h
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Invested Amount</h2>
                    <p className="text-lg font-medium mt-1">
                      ${investment.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      APY {investment.apy}%
                    </p>
                  </div>

                  <div className="h-[1px] bg-gray-200 dark:bg-gray-700" />

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Chain</span>
                    <span className="font-medium">{investment.chain}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <ProgressBar
                    progress={progressPercentage}
                    label="Next reward"
                    rightLabel={`${hoursUntilReward}h`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWithdraw(investment.id)}
                    className="w-full mt-4 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Wallet size={16} />
                    Withdraw Funds
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>)}
    </motion.div>
  );
}