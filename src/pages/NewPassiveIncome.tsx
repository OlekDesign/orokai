import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, Loader2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Caption, Label, Heading4 } from '@/components/ui/typography';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { CryptoIcon } from "@/components/CryptoIcon";
import { InfoTooltip } from "@/components/InfoTooltip";

export function NewPassiveIncome() {
  const navigate = useNavigate();

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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileSortBy, setMobileSortBy] = useState<'annualReturn' | 'frequency' | 'rewards' | 'apy' | 'fee'>('annualReturn');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasMobileDrawerBeenOpened = useRef(false);
  const initialMobileOrder = useRef<string[] | null>(null);
  const previousSelectedCurrency = useRef<string>(selectedCurrency);

  const currencies = [
    { symbol: 'USD', name: 'USD', type: 'fiat', cardNumber: '···· 4242', balance: null },
    { symbol: 'ETH', name: 'ETH', type: 'crypto', cardNumber: null, balance: '2.42 ETH' },
    { symbol: 'ATOM', name: 'ATOM', type: 'crypto', cardNumber: null, balance: '10,242.49 ATOM' },
    { symbol: 'SOL', name: 'SOL', type: 'crypto', cardNumber: null, balance: '39,312.09 SOL' }
  ];

  const selectedCurrencyData = currencies.find(c => c.symbol === selectedCurrency) || currencies[0];

  const investmentOptions = [
    { id: 'ethereum', chain: 'Ethereum', tags: ['Low Fee', 'High Frequency'], rewardFrequency: '24h', rewardValue: '$2.43', apy: '7.8%', estimatedAnnualReturn: '$780', transactionFee: '2.5%', isPersonalized: true },
    { id: 'solana', chain: 'Solana', tags: ['High Frequency', 'High APY'], rewardFrequency: '12h', rewardValue: '$3.21', apy: '9.2%', estimatedAnnualReturn: '$920', transactionFee: '1.8%', isPersonalized: false },
    { id: 'agoric', chain: 'Agoric', tags: ['High APY'], rewardFrequency: '24h', rewardValue: '$2.89', apy: '8.5%', estimatedAnnualReturn: '$850', transactionFee: '3.2%', isPersonalized: false },
    { id: 'aptos', chain: 'Aptos', tags: ['High Frequency'], rewardFrequency: '8h', rewardValue: '$1.95', apy: '7.1%', estimatedAnnualReturn: '$710', transactionFee: '2.8%', isPersonalized: false },
    { id: 'avalanche', chain: 'Avalanche', tags: ['Low Fee'], rewardFrequency: '24h', rewardValue: '$2.67', apy: '8.1%', estimatedAnnualReturn: '$810', transactionFee: '1.5%', isPersonalized: false },
    { id: 'axelar', chain: 'Axelar', tags: ['High APY'], rewardFrequency: '24h', rewardValue: '$3.45', apy: '10.2%', estimatedAnnualReturn: '$1020', transactionFee: '3.8%', isPersonalized: false },
    { id: 'bnb', chain: 'BNB Smart Chain', tags: ['Low Fee', 'High Frequency'], rewardFrequency: '6h', rewardValue: '$2.12', apy: '7.6%', estimatedAnnualReturn: '$760', transactionFee: '1.2%', isPersonalized: false },
    { id: 'cardano', chain: 'Cardano', tags: ['Low Fee'], rewardFrequency: '24h', rewardValue: '$2.34', apy: '7.4%', estimatedAnnualReturn: '$740', transactionFee: '2.1%', isPersonalized: false },
    { id: 'celo', chain: 'Celo', tags: ['High Frequency'], rewardFrequency: '12h', rewardValue: '$2.78', apy: '8.3%', estimatedAnnualReturn: '$830', transactionFee: '2.7%', isPersonalized: false },
    { id: 'cosmos', chain: 'Cosmos', tags: ['High APY'], rewardFrequency: '24h', rewardValue: '$3.12', apy: '9.5%', estimatedAnnualReturn: '$950', transactionFee: '3.1%', isPersonalized: false },
    { id: 'flow', chain: 'Flow', tags: ['Low Fee', 'High APY'], rewardFrequency: '24h', rewardValue: '$2.98', apy: '8.9%', estimatedAnnualReturn: '$890', transactionFee: '2.3%', isPersonalized: false }
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (!amount || fromCurrency === toCurrency) return amount;
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

    setIsEstimating(true);

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
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsMobileDrawerOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalContinue = () => {
    setIsModalOpen(false);
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getChainForCurrency = (currency: string): string | null => {
    const currencyToChainMap: Record<string, string> = {
      'ETH': 'Ethereum',
      'SOL': 'Solana',
      'ATOM': 'Cosmos',
      'USD': 'Ethereum'
    };
    return currencyToChainMap[currency] || null;
  };

  const getSortedOptions = (useMobileSorting = false) => {
    const currentAmount = investAmount || 0;
    const currentSortBy = useMobileSorting ? mobileSortBy : sortBy;
    const currentSortOrder = useMobileSorting ? 'desc' : sortOrder;

    let sorted = [...investmentOptions].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (currentSortBy) {
        case 'provider':
          aValue = a.chain;
          bValue = b.chain;
          break;
        case 'frequency':
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

    if (useMobileSorting) {
      const currencyChanged = previousSelectedCurrency.current !== selectedCurrency;

      if (!hasMobileDrawerBeenOpened.current) {
        const targetChain = getChainForCurrency(selectedCurrency);
        if (targetChain) {
          const selectedIndex = sorted.findIndex(opt => opt.chain === targetChain);
          if (selectedIndex > 0) {
            const selectedOption = sorted[selectedIndex];
            sorted.splice(selectedIndex, 1);
            sorted.unshift(selectedOption);
          }
        }
        initialMobileOrder.current = sorted.map(opt => opt.id);
        hasMobileDrawerBeenOpened.current = true;
        previousSelectedCurrency.current = selectedCurrency;
      } else if (currencyChanged && initialMobileOrder.current) {
        const orderMap = new Map(initialMobileOrder.current.map((id, index) => [id, index]));
        sorted.sort((a, b) => {
          const aIndex = orderMap.get(a.id) ?? 999;
          const bIndex = orderMap.get(b.id) ?? 999;
          return aIndex - bIndex;
        });
        previousSelectedCurrency.current = selectedCurrency;
      }
    }

    return sorted;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="-ml-2 flex items-center gap-1 px-2 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

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
            <div>
              <Label className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Currency
              </Label>

              <div className="relative mt-2" ref={dropdownRef}>
                <div className="relative h-auto min-h-[44px] bg-background border border-input rounded-md flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent/50 transition-colors">
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
                </div>

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

              <div className="mt-4" style={{ marginTop: '16px' }}>
                <Label className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Choose your amount
                </Label>
              </div>

              <div className="relative mt-2">
                <div className="relative h-auto min-h-[44px] bg-background border border-input rounded-md flex items-center gap-1 px-4 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent/50 transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={selectedCurrency === 'USD' ? '$0' : `0 ${selectedCurrency}`}
                    value={investAmount ? (selectedCurrency === 'USD' ? `$${investAmount.toLocaleString()}` : `${investAmount.toLocaleString()} ${selectedCurrency}`) : ''}
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
                    className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground placeholder:opacity-40 text-foreground"
                  />
                </div>
              </div>

              {showWarning && (
                <Caption className="text-warning mt-2">
                  Fill in your investment
                </Caption>
              )}
            </div>

            {showEstimatedReturn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-6"
              >
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

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">APY</span>
                      <InfoTooltip
                        content="Annual Percentage Yield - your yearly returns including compound interest"
                        iconClassName="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200 delay-100"
                      />
                    </div>
                    <span className="font-medium">7.8%</span>
                  </div>

                  <div className="h-[1px] bg-border opacity-30" />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Reward</span>
                      <InfoTooltip
                        content="The amount you earn every 24 hours based on your investment"
                        iconClassName="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help"
                      />
                    </div>
                    <span className="font-medium">
                      {(() => {
                        const currentAmount = investAmount || 0;
                        const dailyReturn = (currentAmount * 0.078) / 365;
                        const rewardValue = selectedCurrency === 'USD'
                          ? `$${dailyReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                          : `${dailyReturn.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${selectedCurrency}`;
                        return `${rewardValue} every 24h`;
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

            <div className="flex flex-col-reverse md:flex-col space-y-reverse space-y-3 md:space-y-reverse-0 md:space-y-3">
              {showEstimatedReturn && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleShowDifferentOptions}
                >
                  Show different options
                </Button>
              )}

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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="w-full md:w-fit md:max-w-[90vw] max-h-[90vh] overflow-y-auto md:p-6"
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
                        selectedOption?.id === option.id && "bg-primary/10"
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
                      <td className="p-4 text-sm min-w-[140px] md:min-w-[168px]">{option.rewardValue} every {option.rewardFrequency}</td>
                      <td className="p-4 text-sm min-w-[80px]">{option.apy}</td>
                      <td className="p-4 text-sm font-bold min-w-[120px]">
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

      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-12 bottom-0 left-0 right-0 bg-background rounded-t-2xl flex flex-col"
          >
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
                    <div className="flex items-start gap-4">
                      <div className="flex items-center pt-1">
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
                              "w-4 h-4 rounded-full border border-muted-foreground flex items-center justify-center cursor-pointer",
                              selectedOption?.id === option.id ? "bg-transparent" : "bg-white/5"
                            )}
                          >
                            {selectedOption?.id === option.id && (
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 text-sm">
                        <div>
                          <div className="flex items-center gap-2">
                            <Heading4 className="mb-0">{option.chain}</Heading4>
                            {option.isPersonalized && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                Our recommendation
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-muted-foreground">Rewards</div>
                        <div className="text-muted-foreground">APY</div>
                        <div className="text-muted-foreground">Annual return</div>
                        <div className="text-muted-foreground">Fee</div>
                      </div>

                      <div className="text-right space-y-2 text-sm">
                        <div className="h-6"></div>
                        <div className="font-medium">{option.rewardValue} every {option.rewardFrequency}</div>
                        <div className="font-medium">{option.apy}</div>
                        <div className="font-bold">
                          {(() => {
                            const currentAmount = investAmount || 0;
                            const apyValue = parseFloat(option.apy.replace('%', '')) / 100;
                            const totalReturn = currentAmount + (currentAmount * apyValue);

                            return selectedCurrency === 'USD'
                              ? `$${totalReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                              : `${totalReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${selectedCurrency}`;
                          })()}
                        </div>
                        <div className="font-medium">{option.transactionFee}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
            <div className="h-16 bg-gradient-to-t from-background/80 via-background/80 to-transparent" />

            <div className="p-4 bg-background pointer-events-auto">
              <Button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
