import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '@/contexts/TransactionsContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useWidget } from '@/contexts/WidgetContext';
import { ExternalLink, ArrowRight, Gift, ArrowUpRight, ArrowDownLeft, RefreshCw, Check, Info, X, Play, ChevronDown, ChevronRight, Loader2, Settings2, User } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { SegmentedSwitch } from '@/components/SegmentedSwitch';
import { Avatar } from '@/components/Avatar';
import { generateChartData, rewardTransactions } from '@/utils/stakingData';
import type { Transaction, TransactionType } from '@/types';
import { cn } from "@/lib/utils";
import { Heading1, Heading2, BodyText, BodyTextSmall, Label, Caption } from '@/components/ui/typography';
import { TransactionRow } from '@/components/TransactionRow';
import { CurrencySelect } from "@/components/CurrencySelect";
import { InfoTooltip } from "@/components/InfoTooltip";
import { CryptoIcon } from "@/components/CryptoIcon";
import { TransactionDetailsDialog } from '@/components/TransactionDetailsDialog';

// Exchange rates relative to USD
const exchangeRates = {
  USD: 1,
  ETH: 0.0004, // 1 USD = 0.0004 ETH (assuming ETH ~$2500)
  ATOM: 0.1, // 1 USD = 0.1 ATOM (assuming ATOM ~$10)
  SOL: 0.007, // 1 USD = 0.007 SOL (assuming SOL ~$140)
};

// Currency data with card numbers and balances
const currencies = [
  { symbol: 'USD', name: 'USD', type: 'fiat', cardNumber: '···· 4242', balance: null },
  { symbol: 'ETH', name: 'ETH', type: 'crypto', cardNumber: null, balance: '2.42 ETH' },
  { symbol: 'ATOM', name: 'ATOM', type: 'crypto', cardNumber: null, balance: '10,242.49 ATOM' },
  { symbol: 'SOL', name: 'SOL', type: 'crypto', cardNumber: null, balance: '39,312.09 SOL' }
];

// Investment options data
const investmentOptions = [
  {
    id: 'ethereum',
    chain: 'Ethereum',
    tags: ['Low Fee', 'High Frequency'],
    rewardFrequency: '24h',
    rewardValue: '$2.43',
    apy: '7.8%',
    estimatedAnnualReturn: '$780',
    transactionFee: '2.5%',
    isPersonalized: true
  },
  {
    id: 'solana',
    chain: 'Solana',
    tags: ['High Frequency', 'High APY'],
    rewardFrequency: '12h',
    rewardValue: '$3.21',
    apy: '9.2%',
    estimatedAnnualReturn: '$920',
    transactionFee: '1.8%',
    isPersonalized: false
  },
  {
    id: 'agoric',
    chain: 'Agoric',
    tags: ['High APY'],
    rewardFrequency: '24h',
    rewardValue: '$2.89',
    apy: '8.5%',
    estimatedAnnualReturn: '$850',
    transactionFee: '3.2%',
    isPersonalized: false
  },
  {
    id: 'aptos',
    chain: 'Aptos',
    tags: ['High Frequency'],
    rewardFrequency: '8h',
    rewardValue: '$1.95',
    apy: '7.1%',
    estimatedAnnualReturn: '$710',
    transactionFee: '2.8%',
    isPersonalized: false
  },
  {
    id: 'avalanche',
    chain: 'Avalanche',
    tags: ['Low Fee'],
    rewardFrequency: '24h',
    rewardValue: '$2.67',
    apy: '8.1%',
    estimatedAnnualReturn: '$810',
    transactionFee: '1.5%',
    isPersonalized: false
  },
  {
    id: 'axelar',
    chain: 'Axelar',
    tags: ['High APY'],
    rewardFrequency: '24h',
    rewardValue: '$3.45',
    apy: '10.2%',
    estimatedAnnualReturn: '$1020',
    transactionFee: '3.8%',
    isPersonalized: false
  },
  {
    id: 'bnb',
    chain: 'BNB Smart Chain',
    tags: ['Low Fee', 'High Frequency'],
    rewardFrequency: '6h',
    rewardValue: '$2.12',
    apy: '7.6%',
    estimatedAnnualReturn: '$760',
    transactionFee: '1.2%',
    isPersonalized: false
  },
  {
    id: 'cardano',
    chain: 'Cardano',
    tags: ['Low Fee'],
    rewardFrequency: '24h',
    rewardValue: '$2.34',
    apy: '7.4%',
    estimatedAnnualReturn: '$740',
    transactionFee: '2.1%',
    isPersonalized: false
  },
  {
    id: 'celo',
    chain: 'Celo',
    tags: ['High Frequency'],
    rewardFrequency: '12h',
    rewardValue: '$2.78',
    apy: '8.3%',
    estimatedAnnualReturn: '$830',
    transactionFee: '2.7%',
    isPersonalized: false
  },
  {
    id: 'cosmos',
    chain: 'Cosmos',
    tags: ['High APY'],
    rewardFrequency: '24h',
    rewardValue: '$3.12',
    apy: '9.5%',
    estimatedAnnualReturn: '$950',
    transactionFee: '3.1%',
    isPersonalized: false
  },
  {
    id: 'flow',
    chain: 'Flow',
    tags: ['Low Fee', 'High APY'],
    rewardFrequency: '24h',
    rewardValue: '$2.98',
    apy: '8.9%',
    estimatedAnnualReturn: '$890',
    transactionFee: '2.3%',
    isPersonalized: false
  }
];

export function Dashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [investAmount, setInvestAmount] = useState('10000');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showBanner, setShowBanner] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [showEstimatedReturn, setShowEstimatedReturn] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(investmentOptions[0]);
  const [sortBy, setSortBy] = useState<'provider' | 'frequency' | 'rewards' | 'apy' | 'annualReturn' | 'fee'>('annualReturn');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const { transactions } = useTransactions();
  const { profile } = useUserProfile();
  const { showWidget } = useWidget();
  const [chartData, setChartData] = useState(generateChartData(timeRange));
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  const selectedCurrencyData = currencies.find(c => c.symbol === selectedCurrency) || currencies[0];


  // Update chart data when time range changes
  useEffect(() => {
    setChartData(generateChartData(timeRange));
  }, [timeRange]);

  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

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
    setIsDropdownOpen(false);
  };

  const handleEstimateReturns = async () => {
    const currentAmount = Number(investAmount) || (selectedCurrency === 'USD' ? 10000 : convertCurrency(10000, 'USD', selectedCurrency));
    
    // Start loading state
    setIsEstimating(true);
    
    // Simulate 2-second delay
    setTimeout(() => {
      setIsEstimating(false);
      setShowEstimatedReturn(true);
    }, 2000);
  };

  const handleContinueSetup = () => {
    const currentAmount = Number(investAmount) || (selectedCurrency === 'USD' ? 10000 : convertCurrency(10000, 'USD', selectedCurrency));
    navigate('/transaction-review', { 
      state: { amount: currentAmount } 
    });
  };

  const handleShowDifferentOptions = () => {
    setIsModalOpen(true);
  };

  const handleModalContinue = () => {
    setIsModalOpen(false);
    // The selected option is already stored in selectedOption state
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortedOptions = () => {
    const currentAmount = Number(investAmount) || 10000;
    
    return [...investmentOptions].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'provider':
          aValue = a.chain;
          bValue = b.chain;
          break;
        case 'frequency':
          // Convert frequency to hours for sorting
          aValue = parseInt(a.rewardFrequency.replace('h', ''));
          bValue = parseInt(b.rewardFrequency.replace('h', ''));
          break;
        case 'rewards':
          aValue = parseFloat(a.rewardValue.replace('$', ''));
          bValue = parseFloat(b.rewardValue.replace('$', ''));
          break;
        case 'apy':
          aValue = parseFloat(a.apy.replace('%', ''));
          bValue = parseFloat(b.apy.replace('%', ''));
          break;
        case 'annualReturn':
          const aAPY = parseFloat(a.apy.replace('%', '')) / 100;
          const bAPY = parseFloat(b.apy.replace('%', '')) / 100;
          aValue = currentAmount + (currentAmount * aAPY);
          bValue = currentAmount + (currentAmount * bAPY);
          break;
        case 'fee':
          aValue = parseFloat(a.transactionFee.replace('%', ''));
          bValue = parseFloat(b.transactionFee.replace('%', ''));
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
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
      
      // Add year to label if it's missing (for week view)
      let timestampWithYear = label;
      if (!label.match(/\d{4}/)) {
        // If no year found, add current year
        const currentYear = new Date().getFullYear();
        timestampWithYear = `${label}, ${currentYear}`;
      }
      
      return (
        <div className="bg-card text-card-foreground p-3 rounded-lg shadow-lg border border-border flex flex-col gap-1">
          <BodyTextSmall className="text-foreground">
            ${data.value.toLocaleString()}
          </BodyTextSmall>
          {data.reward > 0 && (
            <Caption style={{ color: 'hsl(var(--faded))' }}>
              +${data.reward.toLocaleString()}
            </Caption>
          )}
          <Caption style={{ color: 'hsl(var(--faded))' }}>
            {timestampWithYear}
          </Caption>
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
            className="h-12 rounded-lg border border-border flex items-center justify-between px-2 bg-cover md:bg-[length:100%] bg-center bg-no-repeat bg-primary cursor-pointer relative group overflow-hidden"
            style={{
              backgroundImage: 'url("./banner.png")',
              transition: 'background-size 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
            onMouseEnter={(e) => {
              const isMobile = window.innerWidth < 768;
              e.currentTarget.style.backgroundSize = isMobile ? 'cover' : '105%';
            }}
            onMouseLeave={(e) => {
              const isMobile = window.innerWidth < 768;
              e.currentTarget.style.backgroundSize = isMobile ? 'cover' : '100%';
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

      {/* Do these first Card */}
      <Card>
        <CardHeader>
          <CardDescription>Do these first</CardDescription>
        </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-between"
                  disabled
                >
                  <span className="line-through">Label 1</span>
                  <Check size={16} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => showWidget({
                    title: 'Label 2',
                    subtitle: 'Complete this task to continue',
                    progress: 60
                  })}
                >
                  <span>Label 2</span>
                  <ChevronRight size={16} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => showWidget({
                    title: 'Label 3',
                    subtitle: 'Complete this task to continue',
                    progress: 30
                  })}
                >
                  <span>Label 3</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 sm:gap-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="lg:col-span-5"
        >
          <Card className="h-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              transition={{ duration: 0.2, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full flex flex-col"
            >
              <CardHeader className="flex-shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardDescription>Total rewards</CardDescription>
                    <Heading1 className="mt-1">
                      ${totalRewards.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </Heading1>
                    <BodyText className="mt-1 text-success">
                      +$17.49
                    </BodyText>
                  </div>
                  <div className="hidden md:block scale-90 origin-top-right">
                    <SegmentedSwitch
                      value={timeRange}
                      onChange={setTimeRange}
                      options={[
                        { value: 'week', label: 'Week' },
                        { value: 'month', label: 'Month' },
                        { value: 'all', label: 'All' },
                      ]}
                    />
                  </div>
                  {/* Mobile Avatar - Top right corner */}
                  <div className="md:hidden">
                    {profile?.avatar ? (
                      <div 
                        className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate('/wallet')}
                      >
                        <img 
                          src={profile.avatar} 
                          alt={profile.name || "Profile"} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <Avatar 
                        name={profile?.name || "User"} 
                        size="md" 
                        className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity"
                        singleLetter={true}
                        onClick={() => navigate('/wallet')}
                      />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6">
            <div className="flex-1 min-h-[130px] md:min-h-[200px]">
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
                    hide={isMobile}
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
                    animationDuration={300}
                    animationBegin={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Mobile TimeRangeSelector - Below chart, centered */}
            <div className="md:hidden flex justify-center">
              <SegmentedSwitch
                value={timeRange}
                onChange={setTimeRange}
                options={[
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                  { value: 'all', label: 'All' },
                ]}
              />
            </div>

            <div className="space-y-4 flex-shrink-0">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next reward</span>
                <span className="text-muted-foreground">21h 32min</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.2, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="lg:col-span-3 hidden md:block"
        >
          <Card className="h-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              transition={{ duration: 0.2, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full flex flex-col"
            >
              <CardHeader className="flex-shrink-0">
                <CardDescription>Passive income</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-0 sm:pt-0">
                {/* Amount Input - Top Position (when showEstimatedReturn is true) */}
                {showEstimatedReturn && (
                  <div className="mb-4 space-y-2">
                    {/* Currency Selector - Above Amount Input */}
                    <div className="relative" ref={dropdownRef}>
                      <div className="relative h-auto pt-6 pb-2 bg-background border border-input rounded-md flex items-center px-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent/50 transition-colors">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-2">
                            <CryptoIcon symbol={selectedCurrencyData.symbol} size={20} />
                            <span className="text-sm font-medium text-foreground">{selectedCurrencyData.symbol}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {selectedCurrencyData.type === 'fiat' 
                                ? selectedCurrencyData.cardNumber 
                                : selectedCurrencyData.balance
                              }
                            </span>
                            <ChevronDown size={16} className={`transition-transform text-muted-foreground ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        <Caption className="absolute left-4 top-2">
                          Currency
                        </Caption>
                      </div>
                      
                      {/* Dropdown */}
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="absolute top-full left-0 right-0 mt-1 bg-popover rounded-lg shadow-lg border border-border py-1 z-50"
                          >
                            {currencies.map(currency => (
                              <button
                                key={currency.symbol}
                                onClick={() => handleCurrencyChange(currency.symbol)}
                                className={cn(
                                  "w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted transition-colors",
                                  currency.symbol === selectedCurrency && "bg-muted"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <CryptoIcon symbol={currency.symbol} size={20} />
                                  <div className="flex flex-col items-start">
                                    <span className="text-sm font-medium text-foreground">{currency.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {currency.type === 'fiat' ? currency.cardNumber : currency.balance}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Amount Input */}
                    <div className="relative">
                      <div className="relative h-auto pt-6 pb-2 bg-background border border-input rounded-md flex items-center px-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent/50 transition-colors">
                        <input
                          ref={inputRef}
                          type="text"
                          value={investAmount ? (selectedCurrency === 'USD' ? `$${Number(investAmount).toLocaleString()}` : `${Number(investAmount).toLocaleString()} ${selectedCurrency}`) : ''}
                          placeholder="$0"
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setInvestAmount(value);
                          }}
                          className="flex-1 bg-transparent text-xl font-semibold outline-none placeholder:opacity-40 text-foreground"
                          autoFocus
                        />
                        
                        {/* Amount Label */}
                        <Caption className="absolute left-4 top-2">
                          Amount
                        </Caption>
                      </div>
                    </div>
                  </div>
                )}
            <div className="flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
              <div className="space-y-4">

                {/* Estimated Return Section */}
                {showEstimatedReturn && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="space-y-4"
                  >
                    {/* Estimated Return Display */}
                    <div>
                      <div className="relative w-full h-auto pt-6 pb-2 px-4 text-xl font-semibold bg-accent/50 rounded-md flex items-center text-primary">
                        {(() => {
                          const defaultAmount = selectedCurrency === 'USD' ? 10000 : convertCurrency(10000, 'USD', selectedCurrency);
                          const currentAmount = Number(investAmount) || defaultAmount;
                          const returnAmount = currentAmount * 1.078;
                          
                          return selectedCurrency === 'USD' 
                            ? `$${returnAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
                            : `${returnAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${selectedCurrency}`;
                        })()}
                        
                        {/* Estimated Return Label */}
                        <Caption className="absolute left-4 top-2">
                          Estimated Return
                        </Caption>
                      </div>
                    </div>

                    {/* Investment Details Table */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Caption>APY</Caption>
                          <InfoTooltip 
                            content="Annual Percentage Yield - your yearly returns including compound interest"
                            iconClassName="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200 delay-100"
                          />
                        </div>
                        <Caption className="!text-white">7.8%</Caption>
                      </div>
                      
                      <div className="h-[1px] bg-border opacity-30" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Caption>Reward</Caption>
                          <InfoTooltip 
                            content="The amount you earn every 24 hours based on your investment"
                            iconClassName="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200 delay-100"
                          />
                        </div>
                        <Caption className="!text-white">
                          {(() => {
                            const defaultAmount = selectedCurrency === 'USD' ? 10000 : convertCurrency(10000, 'USD', selectedCurrency);
                            const currentAmount = Number(investAmount) || defaultAmount;
                            const dailyReturn = (currentAmount * 0.078) / 365;
                            const rewardValue = selectedCurrency === 'USD' 
                              ? `$${dailyReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}` 
                              : `${dailyReturn.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${selectedCurrency}`;
                            return `${rewardValue} every 24h`;
                          })()} 
                        </Caption>
                      </div>
                      
                      <div className="h-[1px] bg-border opacity-30" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Caption>Transaction fee</Caption>
                          <InfoTooltip 
                            content="One-time fee charged when you start your investment"
                            iconClassName="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200 delay-100"
                          />
                        </div>
                        <Caption className="!text-white">2.5%</Caption>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
                <div className="space-y-6 flex-shrink-0">
                {/* Amount Input - Bottom Position (when showEstimatedReturn is false) */}
                {!showEstimatedReturn && (
                  <div className="space-y-2">
                    {/* Currency Selector - Above Amount Input */}
                    <div className="relative" ref={dropdownRef}>
                      <div className="relative h-auto pt-6 pb-2 bg-background border border-input rounded-md flex items-center px-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent/50 transition-colors">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-2">
                            <CryptoIcon symbol={selectedCurrencyData.symbol} size={20} />
                            <span className="text-sm font-medium text-foreground">{selectedCurrencyData.symbol}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {selectedCurrencyData.type === 'fiat' 
                                ? selectedCurrencyData.cardNumber 
                                : selectedCurrencyData.balance
                              }
                            </span>
                            <ChevronDown size={16} className={`transition-transform text-muted-foreground ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        <Caption className="absolute left-4 top-2">
                          Currency
                        </Caption>
                      </div>
                      
                      {/* Dropdown */}
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="absolute top-full left-0 right-0 mt-1 bg-popover rounded-lg shadow-lg border border-border py-1 z-50"
                          >
                            {currencies.map(currency => (
                              <button
                                key={currency.symbol}
                                onClick={() => handleCurrencyChange(currency.symbol)}
                                className={cn(
                                  "w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted transition-colors",
                                  currency.symbol === selectedCurrency && "bg-muted"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <CryptoIcon symbol={currency.symbol} size={20} />
                                  <div className="flex flex-col items-start">
                                    <span className="text-sm font-medium text-foreground">{currency.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {currency.type === 'fiat' ? currency.cardNumber : currency.balance}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Amount Input */}
                    <div className="relative">
                      <div className="relative h-auto pt-6 pb-2 bg-background border border-input rounded-md flex items-center px-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent/50 transition-colors">
                        <input
                          ref={inputRef}
                          type="text"
                          value={investAmount ? (selectedCurrency === 'USD' ? `$${Number(investAmount).toLocaleString()}` : `${Number(investAmount).toLocaleString()} ${selectedCurrency}`) : ''}
                          placeholder="$0"
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setInvestAmount(value);
                          }}
                          className="flex-1 bg-transparent text-xl font-semibold outline-none placeholder:opacity-40 text-foreground"
                          autoFocus
                        />
                        
                        {/* Amount Label */}
                        <Caption className="absolute left-4 top-2">
                          Amount
                        </Caption>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-3 items-center">
                  <Button 
                    variant="secondary"
                    size="lg"
                    className="h-12 w-12 md:h-12 md:w-12 p-0 flex-shrink-0"
                    onClick={handleShowDifferentOptions}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={showEstimatedReturn ? handleContinueSetup : handleEstimateReturns}
                    disabled={isEstimating}
                    className="flex-1 h-12 md:h-12"
                    variant="default"
                    size="lg">
                    {isEstimating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Estimating...
                      </>
                    ) : showEstimatedReturn ? (
                      'Continue Setup'
                    ) : (
                      'Estimate My Returns'
                    )}
                  </Button>
                </div>

              </div>
            </div>
              </CardContent>
            </motion.div>
          </Card>
        </motion.div>

        {/* Mobile New Investment Button - Replaces Passive Income card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.2, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="lg:col-span-3 md:hidden"
        >
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/invest')}
              className="w-full h-12"
              variant="default"
              size="lg"
            >
              New Investment
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{ duration: 0.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <CardHeader>
              <div className="flex items-center justify-between space-x-4">
                <CardDescription>Latest transactions</CardDescription>
                <Button
                  onClick={() => navigate('/transactions')}
                  variant="ghost"
                  className="font-normal"
                >
                  See all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="overflow-x-auto">
            <Table>
              <TableHeader>
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
                    onClick={() => {
                      setSelectedTransaction(tx);
                      setIsTransactionDialogOpen(true);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
              </div>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>

      {/* Investment Options Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="md:w-auto md:max-w-fit md:max-h-[85vh] max-h-[90vh] overflow-y-auto md:p-6 p-4">
          <DialogHeader>
            <DialogTitle>
              Calculated for {(() => {
                const amount = Number(investAmount) || 10000;
                return selectedCurrency === 'USD' 
                  ? `$${amount.toLocaleString()}` 
                  : `${amount.toLocaleString()} ${selectedCurrency}`;
              })()}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 md:min-w-[288px]">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                        onClick={() => handleSort('provider')}
                      >
                        <Caption 
                          className="whitespace-nowrap"
                          style={{ color: sortBy === 'provider' ? 'white' : undefined }}
                        >
                          Provider
                        </Caption>
                        <InfoTooltip 
                          content="The blockchain network where your investment will be deployed"
                          iconClassName="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200 delay-100"
                        />
                      </div>
                    </th>
                    <th className="text-left p-4 min-w-[140px] md:min-w-[168px]">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                        onClick={() => handleSort('rewards')}
                      >
                        <Caption 
                          className="whitespace-nowrap"
                          style={{ color: sortBy === 'rewards' ? 'white' : undefined }}
                        >
                          Rewards
                        </Caption>
                        <InfoTooltip 
                          content="The amount you earn per reward period and how often you receive rewards"
                          iconClassName="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200 delay-100"
                        />
                      </div>
                    </th>
                    <th className="text-left p-4 min-w-[80px]">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                        onClick={() => handleSort('apy')}
                      >
                        <Caption 
                          className="whitespace-nowrap"
                          style={{ color: sortBy === 'apy' ? 'white' : undefined }}
                        >
                          APY
                        </Caption>
                        <InfoTooltip 
                          content="Annual Percentage Yield - your yearly returns including compound interest"
                          iconClassName="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200 delay-100"
                        />
                      </div>
                    </th>
                    <th className="text-left p-4 min-w-[120px]">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                        onClick={() => handleSort('annualReturn')}
                      >
                        <Caption 
                          className="whitespace-nowrap"
                          style={{ color: sortBy === 'annualReturn' ? 'white' : undefined }}
                        >
                          Annual return
                        </Caption>
                        <InfoTooltip 
                          content="Your total expected returns for one year based on your investment amount"
                          iconClassName="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200 delay-100"
                        />
                      </div>
                    </th>
                    <th className="text-left p-4">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                        onClick={() => handleSort('fee')}
                      >
                        <Caption 
                          className="whitespace-nowrap"
                          style={{ color: sortBy === 'fee' ? 'white' : undefined }}
                        >
                          Fee
                        </Caption>
                        <InfoTooltip 
                          content="One-time fee charged when you start your investment"
                          iconClassName="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200 delay-100"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedOptions().map((option) => (
                    <tr 
                      key={option.id}
                      className={cn(
                        "border-b border-border cursor-pointer transition-all duration-200",
                        "hover:bg-muted/50 hover:border-white/20",
                        selectedOption.id === option.id && "bg-primary/10"
                      )}
                      onClick={() => setSelectedOption(option)}
                    >
                      <td className="p-4 md:min-w-[288px]">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <div className="relative">
                              <input
                                type="radio"
                                name="investment-option"
                                checked={selectedOption.id === option.id}
                                onChange={() => setSelectedOption(option)}
                                className="w-4 h-4 opacity-0 absolute cursor-pointer"
                              />
                              <div 
                                className={cn(
                                  "w-4 h-4 rounded-full border-2 border-muted-foreground flex items-center justify-center cursor-pointer",
                                  selectedOption.id === option.id ? "bg-transparent" : "bg-white/5"
                                )}
                              >
                                {selectedOption.id === option.id && (
                                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{option.chain}</span>
                            {option.isPersonalized && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                Our reccomendation
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm min-w-[140px] md:min-w-[168px]">{option.rewardValue} every {option.rewardFrequency}</td>
                      <td className="p-4 text-sm min-w-[80px]">{option.apy}</td>
                      <td className="p-4 text-sm font-bold min-w-[120px]">
                        {(() => {
                          const currentAmount = Number(investAmount) || 10000;
                          const apyValue = parseFloat(option.apy.replace('%', '')) / 100;
                          const totalReturn = currentAmount + (currentAmount * apyValue);
                          
                          return selectedCurrency === 'USD' 
                            ? `$${totalReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
                            : `${totalReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${selectedCurrency}`;
                        })()}
                      </td>
                      <td className="p-4 text-sm">{option.transactionFee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleModalContinue} className="w-full sm:w-auto">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Details Dialog */}
      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
      />
    </div>
  );
}