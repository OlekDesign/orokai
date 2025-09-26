import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTransactions } from '@/contexts/TransactionsContext';
import { ExternalLink, ArrowRight, Gift, ArrowUpRight, ArrowDownLeft, RefreshCw, Check, Info, X, Play } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip as RechartsTooltip,
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
import { CurrencySelect } from "@/components/CurrencySelect";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Exchange rates relative to USD
const exchangeRates = {
  USD: 1,
  ETH: 0.0004, // 1 USD = 0.0004 ETH (assuming ETH ~$2500)
  ATOM: 0.1, // 1 USD = 0.1 ATOM (assuming ATOM ~$10)
  SOL: 0.007, // 1 USD = 0.007 SOL (assuming SOL ~$140)
};

export function Dashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [investAmount, setInvestAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showBanner, setShowBanner] = useState(true);
  const navigate = useNavigate();
  const { transactions, addTransaction } = useTransactions();
  const [chartData, setChartData] = useState(generateChartData(timeRange));


  // Update chart data when time range changes
  useEffect(() => {
    setChartData(generateChartData(timeRange));
  }, [timeRange]);

  // Convert amount between currencies
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (!amount || fromCurrency === toCurrency) return amount;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / exchangeRates[fromCurrency as keyof typeof exchangeRates];
    const convertedAmount = usdAmount * exchangeRates[toCurrency as keyof typeof exchangeRates];
    
    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
  };

  const handleCurrencyChange = (newCurrency: string) => {
    if (investAmount && selectedCurrency !== newCurrency) {
      const currentAmount = Number(investAmount.replace(/[^0-9]/g, ''));
      if (currentAmount > 0) {
        const convertedAmount = convertCurrency(currentAmount, selectedCurrency, newCurrency);
        setInvestAmount(convertedAmount.toString());
      }
    }
    setSelectedCurrency(newCurrency);
  };

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
    <div className="space-y-4 sm:space-y-6">
      {/* Banner */}
        {showBanner && (
          <div 
            className="h-12 rounded-lg border border-border flex items-center justify-between px-2 bg-cover bg-center bg-no-repeat bg-primary cursor-pointer relative group overflow-hidden"
            style={{
              backgroundImage: 'url("./banner.png")',
              backgroundSize: '100%',
              transition: 'background-size 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundSize = '105%';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundSize = '100%';
            }}
            onClick={() => {
              // Banner click handler - add your navigation logic here
              console.log('Banner clicked');
            }}
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded-lg pointer-events-none"></div>
            
            <div className="flex-1 flex items-center justify-center relative z-10">
              <div className="flex items-center gap-2">
                <Play className="h-3 w-3 text-white" />
                <span className="text-caption text-white">Get Started with Orokai</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10 h-8 px-3 relative z-10"
              onClick={(e) => {
                e.stopPropagation(); // Prevent banner click when closing
                setShowBanner(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 sm:gap-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="lg:col-span-5"
        >
          <Card className="h-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              className="h-full flex flex-col"
            >
              <CardHeader className="flex-shrink-0">
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
              <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6">
            <div className="flex-1 min-h-[200px]">
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
                  <RechartsTooltip content={<CustomTooltip />} />
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

            <div className="space-y-2 flex-shrink-0">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next reward</span>
                <span className="text-muted-foreground">21h 32min</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>

            <Button
              onClick={() => navigate('/transactions?filter=rewards')}
              variant="link"
              className="text-primary hover:text-primary/80 p-0 h-auto font-normal flex-shrink-0"
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
          <Card className="h-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              className="h-full flex flex-col"
            >
              <CardHeader className="flex-shrink-0">
                <CardDescription>Passive Income</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
              <div className="space-y-4">
                <div>
                  <CurrencySelect 
                    value={selectedCurrency} 
                    onChange={handleCurrencyChange}
                  />
                </div>
                
                <div>
                  <div className="relative">
                    <Input
                      type="text"
                      value={investAmount ? (selectedCurrency === 'USD' ? `$${Number(investAmount).toLocaleString()}` : `${Number(investAmount).toLocaleString()} ${selectedCurrency}`) : ''}
                      placeholder={(() => {
                        const defaultAmount = selectedCurrency === 'USD' ? 10000 : convertCurrency(10000, 'USD', selectedCurrency);
                        return selectedCurrency === 'USD' 
                          ? `$${defaultAmount.toLocaleString()}` 
                          : `${defaultAmount.toLocaleString()} ${selectedCurrency}`;
                      })()}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setInvestAmount(value);
                      }}
                      className="h-auto pt-6 pb-2 text-lg sm:text-xl font-semibold px-4 placeholder:opacity-50"
                      autoFocus
                    />
                    <span className="text-xs text-muted-foreground font-medium absolute left-4 top-2">
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
                    <div className="w-full h-auto pt-6 pb-2 px-4 text-xl font-semibold bg-accent/50 rounded-md flex items-center text-primary">
                      {(() => {
                        const defaultAmount = selectedCurrency === 'USD' ? 10000 : convertCurrency(10000, 'USD', selectedCurrency);
                        const currentAmount = Number(investAmount) || defaultAmount;
                        const returnAmount = currentAmount * 1.078;
                        
                        return selectedCurrency === 'USD' 
                          ? `$${returnAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
                          : `${returnAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${selectedCurrency}`;
                      })()}
                    </div>
                    <div className="flex items-center gap-2 absolute left-4 top-2">
                      <Caption className="font-medium">
                        Estimated Return (APY 7.8%)
                      </Caption>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-foreground p-4">
                            <div>
                              <p className="text-sm mb-2">
                                APY (Annual Percentage Yield) shows your total yearly returns including compound interest. 
                                This is an estimated return based on current market conditions.
                              </p>
                              <a 
                                href="#" 
                                className="text-primary-foreground text-sm underline hover:no-underline"
                                onClick={(e) => e.preventDefault()}
                              >
                                Learn more
                              </a>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
              
                <div className="space-y-4 sm:space-y-6 flex-shrink-0">
                <Button 
                  onClick={() => navigate('/transaction-review', { 
                    state: { amount: investAmount ? Number(investAmount) : 10000 } 
                  })} 
                  className="w-full h-12 min-h-[44px]"
                  variant="default"
                  size="lg">
                  Continue Setup
                </Button>

                <div className=" rounded-lg space-y-4">
                  <div className="flex items-center gap-3 ">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <Caption>You'll receive {(() => {
                      const defaultAmount = selectedCurrency === 'USD' ? 10000 : convertCurrency(10000, 'USD', selectedCurrency);
                      const currentAmount = Number(investAmount) || defaultAmount;
                      const dailyReturn = (currentAmount * 0.078) / 365; // Daily return from 7.8% APY
                      
                      return selectedCurrency === 'USD' 
                        ? `$${dailyReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}` 
                        : `${dailyReturn.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${selectedCurrency}`;
                    })()} every 24h</Caption>
                  </div>
                  <div className="flex items-center gap-3 ">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <Caption>Your funds are securely stored</Caption>
                  </div>
                  <div className="flex items-center gap-3 ">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <Caption>You can withdraw your funds anytime</Caption>
                  </div>
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
                {/* Mobile Header (simplified single column) */}
                <TableRow className="md:hidden">
                  <TableHead><Caption>Recent Transactions</Caption></TableHead>
                </TableRow>
                {/* Desktop Header (full columns) */}
                <TableRow className="hidden md:table-row">
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