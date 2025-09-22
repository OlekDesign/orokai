import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTransactions } from '@/contexts/TransactionsContext';
import { ExternalLink, ArrowRight, Gift, ArrowUpRight, ArrowDownLeft, RefreshCw, Check } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip,
  ReferenceLine
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { generateChartData, rewardTransactions } from '@/utils/stakingData';
import { initialDemoTransactions } from '@/pages/Transactions';
import type { Transaction, TransactionType } from '@/types';
import { cn } from "@/lib/utils";
import { Heading1, Heading2, BodyText, BodyTextSmall, Label, Caption } from '@/components/ui/typography';
import { TransactionRow } from '@/components/TransactionRow';

export function Dashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [investAmount, setInvestAmount] = useState('');
  const navigate = useNavigate();
  const { transactions, addTransaction } = useTransactions();
  const [chartData, setChartData] = useState(generateChartData(timeRange));


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
        <div className="bg-card text-card-foreground p-3 rounded-lg shadow-lg border border-border">
          <span className="text-caption mb-1">{label}</span>
          <BodyTextSmall className="font-medium">
            Total: ${data.value.toLocaleString()}
          </BodyTextSmall>
          {data.reward > 0 && (
            <BodyTextSmall className="text-success mt-1">
              +${data.reward.toLocaleString()} reward
            </BodyTextSmall>
          )}
        </div>
      );
    }
    return null;
  };


  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="lg:col-span-5"
        >
          <Card>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardDescription>Total Rewards</CardDescription>
                    <h1 className="text-heading-1 text-foreground mt-1">
                      ${totalRewards.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </h1>
                    <BodyText className="mt-1 text-success">
                      +$17.49
                    </BodyText>
                  </div>
                  <div className="scale-90 origin-top-right">
                    <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="white" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="white" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    tickMargin={8}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {chartData.map((entry, index) => 
                    entry.reward > 0 ? (
                      <ReferenceLine
                        key={index}
                        x={entry.date}
                        stroke="hsl(var(--primary))"
                        strokeDasharray="3 3"
                        opacity={0.5}
                      />
                    ) : null
                  )}
                  <Area
                    type="stepAfter"
                    dataKey="value"
                    stroke="white"
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

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next reward</span>
                <span className="text-muted-foreground">21h 32min</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>

            <Button
              onClick={() => navigate('/transactions?filter=rewards')}
              variant="link"
              className="text-primary hover:text-primary/80 p-0 h-auto font-normal"
            >
              <span>See rewards history</span>
              <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
              </CardContent>
            </motion.div>
          </Card>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="lg:col-span-3"
        >
          <Card>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
            >
              <CardHeader>
                <CardDescription>Passive Income</CardDescription>
              </CardHeader>
              <CardContent>
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Input
                    type="text"
                    value={investAmount ? `$${Number(investAmount).toLocaleString()}` : ''}
                    placeholder="$10,000"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setInvestAmount(value);
                    }}
                    className="h-auto pt-6 pb-2 text-xl font-semibold px-4 placeholder:opacity-50"
                    autoFocus
                  />
                  <span className="text-caption absolute left-4 top-2 font-medium">
                    Amount
                  </span>
                </div>
              </div>

              <div className="relative -my-6">
                <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[calc(50%+8px)] bg-card rounded-full p-2 z-50">
                  <ArrowRight className="text-primary rotate-90" size={18} />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="w-full h-auto pt-6 pb-2 px-4 text-xl font-semibold bg-muted rounded-md flex items-center text-primary">
                    {investAmount ? `$${(Number(investAmount) * 1.078).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '$10,780'}
                  </div>
                  <span className="text-caption absolute left-4 top-2 font-medium">
                    Estimated Return (APY 7.8%)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-6">
              <Button 
                onClick={() => navigate('/transaction-review', { 
                  state: { amount: investAmount ? Number(investAmount) : 10000 } 
                })} 
                className="w-full h-12"
                variant="default"
                size="lg">
                Review Order
              </Button>

              <div className=" rounded-lg space-y-4">
                <div className="flex items-center gap-3 ">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-caption">You'll receive $2,13 every 24h</span>
                </div>
                <div className="flex items-center gap-3 ">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-caption">Your funds are securely stored</span>
                </div>
                <div className="flex items-center gap-3 ">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-caption">You can withdraw your funds anytime</span>
                </div>
              </div>
            </div>
              </CardContent>
            </motion.div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
        <Card>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
          >
            <CardHeader>
              <div className="flex items-center justify-between space-x-4">
                <CardDescription>Latest transactions</CardDescription>
                <Button
                  onClick={() => navigate('/transactions')}
                  variant="link"
                  className="text-primary hover:text-primary/80 p-0 h-auto font-normal"
                >
                  See all
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Caption>Type</Caption></TableHead>
                  <TableHead><Caption>Amount</Caption></TableHead>
                  <TableHead><Caption>Status</Caption></TableHead>
                  <TableHead><Caption>Date</Caption></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 3).map((tx) => (
                  <TransactionRow 
                    key={tx.id} 
                    transaction={tx} 
                  />
                ))}
              </TableBody>
            </Table>
              </div>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}