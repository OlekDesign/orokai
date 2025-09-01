import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowRight, Gift, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip,
  ReferenceLine
} from 'recharts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TimeRangeSelector } from '../components/TimeRangeSelector';
import { ProgressBar } from '../components/ProgressBar.tsx';
import { generateChartData, rewardTransactions } from '../utils/stakingData';
import { initialDemoTransactions } from '../pages/Transactions';
import type { Transaction, TransactionType } from '../types';

export function Dashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [investAmount, setInvestAmount] = useState(10000);
  const [transactions, setTransactions] = useState<Transaction[]>(initialDemoTransactions);
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(generateChartData(timeRange));

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

  // Update chart data when time range changes
  useEffect(() => {
    setChartData(generateChartData(timeRange));
  }, [timeRange]);

  // Calculate total rewards (sum of all rewards)
  const totalRewards = rewardTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate rewards in the last 24 hours
  const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
  const rewardsLast24h = rewardTransactions
    .filter(tx => new Date(tx.timestamp).getTime() > last24Hours)
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate time until next reward
  const lastRewardTime = new Date(rewardTransactions[0].timestamp);
  const nextRewardTime = new Date(lastRewardTime.getTime() + 24 * 60 * 60 * 1000);
  const timeUntilNextReward = Math.max(0, nextRewardTime.getTime() - Date.now());
  const totalRewardPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const progressPercentage = ((totalRewardPeriod - timeUntilNextReward) / totalRewardPeriod) * 100;
  
  // Format time until next reward
  const daysUntilReward = Math.floor(timeUntilNextReward / (1000 * 60 * 60 * 24));
  const hoursUntilReward = Math.floor((timeUntilNextReward % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const timeUntilRewardFormatted = daysUntilReward > 0 
    ? `${daysUntilReward}d ${hoursUntilReward}h`
    : `${hoursUntilReward}h`;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <p className="font-medium">
            Total: ${data.value.toLocaleString()}
          </p>
          {data.reward > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              +${data.reward.toLocaleString()} reward
            </p>
          )}
        </div>
      );
    }
    return null;
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
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        <Card className="lg:col-span-5">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Rewards</h2>
                <h1 className="text-4xl font-bold mt-1">
                  ${totalRewards.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  +${rewardsLast24h.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} in the last 24h
                </p>
              </div>
              <div className="scale-90 origin-top-right">
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
              </div>
            </div>

            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#26A17B" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#26A17B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    tickMargin={8}
                    tick={{ fill: '#888888', fontSize: 12 }}
                  />

                  <Tooltip content={<CustomTooltip />} />
                  {/* Add reference lines for rewards */}
                  {chartData.map((entry, index) => 
                    entry.reward > 0 ? (
                      <ReferenceLine
                        key={index}
                        x={entry.date}
                        stroke="#26A17B"
                        strokeDasharray="3 3"
                        opacity={0.5}
                      />
                    ) : null
                  )}
                  <Area
                    type="stepAfter"
                    dataKey="value"
                    stroke="#26A17B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationBegin={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <ProgressBar
              progress={progressPercentage}
              label="Next reward"
              rightLabel={timeUntilRewardFormatted}
            />

            <button
              onClick={() => navigate('/transactions?filter=rewards')}
              className="flex items-center text-sm text-brand hover:text-brand/80 transition-colors"
            >
              <span>See rewards history</span>
              <ExternalLink size={14} className="ml-1" />
            </button>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <div className="h-full flex flex-col">
            <div>
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Invest</h2>
              <div className="mt-8 space-y-6">
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
              </div>
            </div>
            
            <div className="mt-auto pt-8">
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
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Latest transactions</h2>
          <button
            onClick={() => navigate('/transactions')}
            className="text-sm text-brand hover:text-brand/80 transition-colors flex items-center"
          >
            See all
            <ExternalLink size={14} className="ml-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">Type</th>
                <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">Amount</th>
                <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.slice(0, 3).map((tx) => (
                <tr
                  key={tx.id}
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
                        {tx.type === 'rewards' ? <Gift className="w-5 h-5" />
                          : tx.type === 'withdrawals' ? <ArrowDownLeft className="w-5 h-5" />
                          : tx.type === 'investment' ? <ArrowUpRight className="w-5 h-5" />
                          : tx.type === 'top-up' ? <ArrowUpRight className="w-5 h-5" />
                          : <RefreshCw className="w-5 h-5" />}
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
                    <span className={`px-2 py-1 rounded-full text-sm capitalize ${
                      tx.status === 'completed'
                        ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                        : tx.status === 'pending'
                        ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
                        : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-600 dark:text-gray-400">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}