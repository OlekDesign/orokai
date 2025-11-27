import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Shield, Clock, ChevronDown, Loader2, X } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading1, Heading2, Heading3, Heading4, BodyTextLarge, BodyTextSmall, Caption, Label } from '@/components/ui/typography';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { CryptoIcon } from "@/components/CryptoIcon";
import { InfoTooltip } from "@/components/InfoTooltip";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useUserProfile } from '../contexts/UserProfileContext';
import { useToast } from '../contexts/ToastContext';
import { InvestmentCard } from "@/components/InvestmentCard";

export function Investments() {
  const navigate = useNavigate();
  const { investments, removeInvestment, setClosedInvestmentAmount } = useUserProfile();
  const { showToast } = useToast();

  // State for investment input functionality
  const [investAmount, setInvestAmount] = useState<number | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showWarning, setShowWarning] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [showEstimatedReturn, setShowEstimatedReturn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'provider' | 'frequency' | 'rewards' | 'apy' | 'annualReturn' | 'fee'>('annualReturn');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [investmentToClose, setInvestmentToClose] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileSortBy, setMobileSortBy] = useState<'annualReturn' | 'frequency' | 'rewards' | 'apy' | 'fee'>('annualReturn');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Currency data with card numbers and balances
  const currencies = [
    { symbol: 'USD', name: 'USD', type: 'fiat', cardNumber: '···· 4242', balance: null },
    { symbol: 'ETH', name: 'ETH', type: 'crypto', cardNumber: null, balance: '2.42 ETH' },
    { symbol: 'ATOM', name: 'ATOM', type: 'crypto', cardNumber: null, balance: '10,242.49 ATOM' },
    { symbol: 'SOL', name: 'SOL', type: 'crypto', cardNumber: null, balance: '39,312.09 SOL' }
  ];

  const selectedCurrencyData = currencies.find(c => c.symbol === selectedCurrency) || currencies[0];

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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const handleWithdraw = (investmentId: string) => {
    setInvestmentToClose(investmentId);
    setIsCloseModalOpen(true);
  };

  const handleCloseModalCancel = () => {
    setIsCloseModalOpen(false);
    setInvestmentToClose(null);
  };

  const handleCloseModalConfirm = async () => {
    if (!investmentToClose) return;
    
    setIsClosing(true);
    
    // Simulate API call delay
    setTimeout(() => {
    // Find the investment before removing it to store its amount
      const investment = investments.find(inv => inv.id === investmentToClose);
    if (investment) {
      setClosedInvestmentAmount(investment.amount);
        removeInvestment(investmentToClose);
        
        // Show success toast
        showToast(
          'success',
          'Investment Closed',
          'Your funds will be available in your wallet within a couple of minutes.'
        );
      }
      
      setIsClosing(false);
      setIsCloseModalOpen(false);
      setInvestmentToClose(null);
    }, 1500);
  };

  // Effects for investment input functionality
  useEffect(() => {
    inputRef.current?.focus();
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

  // Handle body scroll lock when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      // Prevent body scroll when drawer is open, but allow drawer content to scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when drawer is closed
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  // Currency conversion handler (simplified for demo)
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (!amount || fromCurrency === toCurrency) return amount;
    // Simplified conversion - in real app, use actual exchange rates
    return amount;
  };

  const handleCurrencyChange = (newCurrency: string) => {
    if (investAmount && selectedCurrency !== newCurrency) {
      const convertedAmount = convertCurrency(investAmount, selectedCurrency, newCurrency);
      setInvestAmount(convertedAmount);
    }
    setSelectedCurrency(newCurrency);
    setIsDropdownOpen(false);
  };

  const handleEstimateReturns = async () => {
    if (!investAmount) {
      setShowWarning(true);
      inputRef.current?.focus();
      return;
    }

    // Start loading state
    setIsEstimating(true);
    
    // Simulate 2-second delay
    setTimeout(() => {
      setIsEstimating(false);
      setShowEstimatedReturn(true);
    }, 2000);
  };

  const handleContinueSetup = () => {
    navigate('/transaction-review', { 
      state: { amount: investAmount } 
    });
  };

  const handleShowDifferentOptions = () => {
    // Check if mobile (screen width < 768px)
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsMobileDrawerOpen(true);
    } else {
      setIsModalOpen(true);
    }
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

  const getSortedOptions = (useMobileSorting = false) => {
    const currentAmount = investAmount || 0;
    const currentSortBy = useMobileSorting ? mobileSortBy : sortBy;
    const currentSortOrder = useMobileSorting ? 'desc' : sortOrder;
    
    return [...investmentOptions].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (currentSortBy) {
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
          // For fee, we want ascending order for "lowest fee"
          if (useMobileSorting && currentSortBy === 'fee') {
            return (aValue as number) - (bValue as number);
          }
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return currentSortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return currentSortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  };

  // Initialize selectedOption with first investment option
  if (!selectedOption && investmentOptions.length > 0) {
    setSelectedOption(investmentOptions[0]);
  }

  // Helper function to calculate time since investment start
  const getTimeSince = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  };

  // Passive income options data
  const passiveIncomeOptions = [
    {
      id: 1,
      title: "DeFi Staking",
      description: "Stake your crypto assets in decentralized protocols for consistent returns",
      apy: "7.8%",
      minAmount: 1000,
      risk: "Medium",
      duration: "Flexible",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/5"
    },
    {
      id: 2,
      title: "Liquidity Pools",
      description: "Provide liquidity to DEX pools and earn fees from trading activity",
      apy: "12.4%",
      minAmount: 2500,
      risk: "High",
      duration: "30+ days",
      icon: Shield,
      color: "text-info",
      bgColor: "bg-info/5"
    },
    {
      id: 3,
      title: "Yield Farming",
      description: "Maximize returns through automated yield optimization strategies",
      apy: "15.2%",
      minAmount: 5000,
      risk: "High",
      duration: "60+ days",
      icon: Clock,
      color: "text-primary",
      bgColor: "bg-primary/5"
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Investment Setup Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="space-y-6"
      >
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2 text-left md:text-center">
            <h1 className="text-heading-1">Let's put your assets to work</h1>
            
          </div>
          <div className="space-y-6">
            {/* Merged Currency Select + Investment Input */}
            <div className="space-y-2">
                <Label className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Choose your amount
                </Label>
                <div className="relative" ref={dropdownRef}>
                  {/* Main Input Field */}
                  <div className="relative h-16 bg-background border border-input rounded-md flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent/50 transition-colors">
                    {/* Amount Input */}
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="$0"
                      value={investAmount ? investAmount.toLocaleString() : ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setInvestAmount(Number(value) || null);
                        setShowWarning(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEstimateReturns();
                        }
                      }}
                      className="flex-1 bg-transparent text-xl font-semibold outline-none placeholder:text-muted-foreground placeholder:opacity-40 text-foreground"
                    />
                    
                    {/* Currency Selector */}
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex flex-col items-end ml-4 hover:bg-muted p-2 rounded transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <CryptoIcon symbol={selectedCurrencyData.symbol} size={20} />
                        <span className="text-sm font-medium text-foreground">{selectedCurrencyData.symbol}</span>
                        <ChevronDown size={16} className={`transition-transform text-muted-foreground ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                      <span className="text-xs text-muted-foreground ">
                        {selectedCurrencyData.type === 'fiat' 
                          ? selectedCurrencyData.cardNumber 
                          : selectedCurrencyData.balance
                        }
                      </span>
                    </button>
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
                              "w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors",
                              currency.symbol === selectedCurrency && "bg-muted"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <CryptoIcon symbol={currency.symbol} size={20} />
                              <div className="flex flex-col items-start">
                                <span className="font-medium text-foreground">{currency.name}</span>
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
                {showWarning && (
                  <Caption className="text-warning mt-2">
                    Fill in your investment
                  </Caption>
                )}
                
              </div>
            
            {/* Estimated Return Section */}
            {showEstimatedReturn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-6"
              >
                {/* Estimated Return Display */}
                <div className="space-y-2">
                  <Label className="leading-none">
                    Estimated Return
                  </Label>
                  <div className="w-full h-14 px-4 text-xl font-semibold bg-accent/50 rounded-md flex items-center text-primary">
                    {(() => {
                      const currentAmount = investAmount || 0;
                      const returnAmount = currentAmount * 1.078;
                      
                      return selectedCurrency === 'USD' 
                        ? `$${returnAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
                        : `${returnAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${selectedCurrency}`;
                    })()}
                  </div>
                </div>

                {/* Investment Details Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">APY</span>
                      <InfoTooltip 
                        content="Annual Percentage Yield - your yearly returns including compound interest"
                        iconClassName="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help"
                      />
                    </div>
                    <span className="font-medium">7.8%</span>
                  </div>
                  
                  <div className="h-[1px] bg-border opacity-30" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Reward frequency</span>
                      <InfoTooltip 
                        content="How often you receive your investment rewards"
                        iconClassName="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help"
                      />
                    </div>
                    <span className="font-medium">24h</span>
                  </div>
                  
                  <div className="h-[1px] bg-border opacity-30" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Reward value</span>
                      <InfoTooltip 
                        content="The amount you earn every 24 hours based on your investment"
                        iconClassName="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help"
                      />
                    </div>
                    <span className="font-medium">
                      {(() => {
                        const currentAmount = investAmount || 0;
                        const dailyReturn = (currentAmount * 0.078) / 365;
                        return selectedCurrency === 'USD' 
                          ? `$${dailyReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}` 
                          : `${dailyReturn.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${selectedCurrency}`;
                      })()} 
                    </span>
                  </div>
                  
                  <div className="h-[1px] bg-border opacity-30" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Transaction fee</span>
                      <InfoTooltip 
                        content="One-time fee charged when you start your investment"
                        iconClassName="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help"
                      />
                    </div>
                    <span className="font-medium">2.5%</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Buttons Stack */}
            <div className="flex flex-col-reverse md:flex-col space-y-reverse space-y-3 md:space-y-reverse-0 md:space-y-3">
              {/* Show Different Options Button */}
              {showEstimatedReturn && (
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={handleShowDifferentOptions}
                >
                  Show different options
                </Button>
              )}
              
              {/* Main Action Button */}
              <Button 
                onClick={showEstimatedReturn ? handleContinueSetup : handleEstimateReturns}
                disabled={isEstimating}
                className="w-full"
              >
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
      </motion.div>

      {/* Passive Income Cards Grid - Hidden */}
      {false && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <Heading2>Investment Options</Heading2>
            <BodyTextSmall className="text-muted-foreground">
              {investments.length} active {investments.length === 1 ? 'investment' : 'investments'}
            </BodyTextSmall>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {passiveIncomeOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full"
                >
                  <Card 
                    className="h-full cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
                    onClick={() => navigate('/transaction-review', { 
                      state: { 
                        selectedOption: option,
                        amount: option.minAmount 
                      } 
                    })}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl ${option.bgColor}`}>
                          <IconComponent className={`h-6 w-6 ${option.color}`} />
                        </div>
                        <div className="text-right">
                          <Heading2 className="text-primary">{option.apy}</Heading2>
                          <Caption>APY</Caption>
                        </div>
                      </div>
                      <CardTitle className="text-heading-3">{option.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm leading-relaxed">
                        {option.description}
                      </CardDescription>
                      
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Minimum</span>
                          <span className="font-medium">${option.minAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Risk Level</span>
                          <span className={`font-medium ${
                            option.risk === 'Low' ? 'text-success' :
                            option.risk === 'Medium' ? 'text-warning' :
                            'text-destructive'
                          }`}>
                            {option.risk}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">{option.duration}</span>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-4" variant="secondary">
                        Start Earning
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

     

      {/* Active Investments Section */}
      {investments.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.2, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-4 sm:space-y-6"
        >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          transition={{ duration: 0.2, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Desktop Card Layout */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardDescription>Your passive income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><Caption>Provider</Caption></TableHead>
                      <TableHead><Caption>Investment</Caption></TableHead>
                      <TableHead><Caption>Active since</Caption></TableHead>
                      <TableHead><Caption>APY</Caption></TableHead>
                      <TableHead><Caption>Rewards</Caption></TableHead>
                      <TableHead><Caption>Next reward</Caption></TableHead>
                      <TableHead><Caption>Actions</Caption></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
            {[...investments]
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .map((investment) => {
                      const timeSince = getTimeSince(investment.startDate);
                      return (
                        <TableRow key={investment.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CryptoIcon symbol={investment.chain === 'Ethereum' ? 'ETH' : 'BTC'} size={16} />
                              <span className="font-medium">{investment.chain}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">${investment.amount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{timeSince.days}d {timeSince.hours}h</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{investment.apy}%</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-success">
                              ${investment.earned.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">3h 32min</span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleWithdraw(investment.id)}
                            >
                              Close
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Flex Layout */}
          <div className="md:hidden flex flex-col space-y-4">
            <Heading4>Your Passive Income</Heading4>
            <div className="space-y-3">
              {[...investments]
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                .map((investment) => {
                  const timeSince = getTimeSince(investment.startDate);
                  return (
                    <Card key={investment.id} className="border">
                      <CardContent className="p-4">
                        {/* Title */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <CryptoIcon symbol={investment.chain === 'Ethereum' ? 'ETH' : 'BTC'} size={16} />
                            <Heading4>{investment.chain}</Heading4>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleWithdraw(investment.id)}
                          >
                            Close
                          </Button>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="text-muted-foreground">Investment</div>
                          <div className="font-medium text-right">${investment.amount.toLocaleString()}</div>
                          
                          <div className="text-muted-foreground">Active since</div>
                          <div className="font-medium text-right">{timeSince.days}d {timeSince.hours}h</div>
                          
                          <div className="text-muted-foreground">APY</div>
                          <div className="font-medium text-right">{investment.apy}%</div>
                          
                          <div className="text-muted-foreground">Rewards</div>
                          <div className="font-bold text-right text-success">
                            ${investment.earned.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </div>
                          
                          <div className="text-muted-foreground">Next reward</div>
                          <div className="font-medium text-right">3h 32min</div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        </motion.div>
        </motion.div>
      )}

      {/* Investment Options Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className="max-w-6xl max-h-[90vh] overflow-y-auto"
          onInteractOutside={() => setIsModalOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>
              Calculated for {(() => {
                const amount = investAmount || 0;
                return selectedCurrency === 'USD' 
                  ? `$${amount.toLocaleString()}` 
                  : `${amount.toLocaleString()} ${selectedCurrency}`;
              })()}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4">
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
                          iconClassName="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help"
                        />
                      </div>
                    </th>
                    <th className="text-left p-4">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                        onClick={() => handleSort('frequency')}
                      >
                          <Caption 
                            className="whitespace-nowrap"
                            style={{ color: sortBy === 'frequency' ? 'white' : undefined }}
                          >
                          Frequency
                        </Caption>
                        <InfoTooltip 
                          content="How often you receive your investment rewards"
                          iconClassName="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help"
                        />
                      </div>
                    </th>
                    <th className="text-left p-4">
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
                          content="The amount you earn per reward period"
                          iconClassName="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help"
                        />
                      </div>
                    </th>
                    <th className="text-left p-4">
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
                          iconClassName="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help"
                        />
                      </div>
                    </th>
                    <th className="text-left p-4">
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
                          iconClassName="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help"
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
                          iconClassName="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help"
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
                        selectedOption?.id === option.id && "bg-primary/10"
                      )}
                      onClick={() => setSelectedOption(option)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <div className="relative">
                              <input
                                type="radio"
                                name="investment-option"
                                checked={selectedOption?.id === option.id}
                                onChange={() => setSelectedOption(option)}
                                className="w-4 h-4 opacity-0 absolute cursor-pointer"
                              />
                              <div 
                                className={cn(
                                  "w-4 h-4 rounded-full border-2 border-muted-foreground flex items-center justify-center cursor-pointer",
                                  selectedOption?.id === option.id ? "bg-transparent" : "bg-white/5"
                                )}
                              >
                                {selectedOption?.id === option.id && (
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
                      <td className="p-4 text-sm">{option.rewardFrequency}</td>
                      <td className="p-4 text-sm">{option.rewardValue}</td>
                      <td className="p-4 text-sm ">{option.apy}</td>
                      <td className="p-4 text-sm font-bold">
                        {(() => {
                          const currentAmount = investAmount || 0;
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

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-12 bottom-0 left-0 right-0 bg-background rounded-t-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 flex-shrink-0">
              <div className="relative flex-1 max-w-xs">
                <select
                  value={mobileSortBy}
                  onChange={(e) => setMobileSortBy(e.target.value as typeof mobileSortBy)}
                  className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                >
                  <option value="annualReturn">Highest return</option>
                  <option value="frequency">Highest frequency</option>
                  <option value="rewards">Highest rewards</option>
                  <option value="apy">Highest APY</option>
                  <option value="fee">Lowest fee</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="h-8 w-8 p-0 ml-3"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Cards List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {getSortedOptions(true).map((option) => (
                <Card
                  key={option.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    selectedOption?.id === option.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedOption(option)}
                >
                  <CardContent className="p-4">
                    {/* Title and Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <div className="relative">
                            <input
                              type="radio"
                              name="mobile-investment-option"
                              checked={selectedOption?.id === option.id}
                              onChange={() => setSelectedOption(option)}
                              className="w-4 h-4 opacity-0 absolute cursor-pointer"
                            />
                            <div 
                              className={cn(
                                "w-4 h-4 rounded-full border-2 border-muted-foreground flex items-center justify-center cursor-pointer",
                                selectedOption?.id === option.id ? "bg-transparent" : "bg-white/5"
                              )}
                            >
                              {selectedOption?.id === option.id && (
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Heading4>{option.chain}</Heading4>
                      </div>
                      {option.isPersonalized && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                          Our recommendation
                        </span>
                      )}
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="text-muted-foreground">Frequency</div>
                      <div className="font-medium text-right">{option.rewardFrequency}</div>
                      
                      <div className="text-muted-foreground">Rewards</div>
                      <div className="font-medium text-right">{option.rewardValue}</div>
                      
                      <div className="text-muted-foreground">APY</div>
                      <div className="font-medium text-right">{option.apy}</div>
                      
                      <div className="text-muted-foreground">Annual return</div>
                      <div className="font-bold text-right">
                        {(() => {
                          const currentAmount = investAmount || 0;
                          const apyValue = parseFloat(option.apy.replace('%', '')) / 100;
                          const totalReturn = currentAmount + (currentAmount * apyValue);
                          
                          return selectedCurrency === 'USD' 
                            ? `$${totalReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
                            : `${totalReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${selectedCurrency}`;
                        })()}
                      </div>
                      
                      <div className="text-muted-foreground">Fee</div>
                      <div className="font-medium text-right">{option.transactionFee}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </motion.div>
          
          {/* Floating Continue Button */}
          <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
            {/* Gradient backdrop */}
            <div className="h-16 bg-gradient-to-t from-background/80 via-background/80 to-transparent" />
            
            {/* Button container */}
            <div className="p-4 bg-background pointer-events-auto">
              <Button 
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  // The selected option is already stored in selectedOption state
                }}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Close Investment Modal */}
      <ConfirmationModal
        isOpen={isCloseModalOpen}
        onClose={handleCloseModalCancel}
        onConfirm={handleCloseModalConfirm}
        isLoading={isClosing}
      />
    </div>
  );
}