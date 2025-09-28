import { useNavigate } from 'react-router-dom';
import { Plus, Wallet, ArrowRight, Check, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Heading1, Label, Caption, BodyTextSmall } from "@/components/ui/typography";
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

export default function InvestmentsEmpty() {
  const navigate = useNavigate();
  const [investAmount, setInvestAmount] = useState<number | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showWarning, setShowWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      const convertedAmount = convertCurrency(investAmount, selectedCurrency, newCurrency);
      setInvestAmount(convertedAmount);
    }
    setSelectedCurrency(newCurrency);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6">
    
      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <Heading1>Set Up Your Investment Plan</Heading1>
          <Caption className="text-center text-muted-foreground">
            Regulated by SEC
          </Caption>
        </div>
        <div className="space-y-6">
          <div className="space-y-6">
            <CurrencySelect 
              value={selectedCurrency} 
              onChange={handleCurrencyChange}
            />
            <div className="space-y-2">
              <Label className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Investment
              </Label>
              <Input
                ref={inputRef}
                type="text"
                placeholder={(() => {
                  const defaultAmount = selectedCurrency === 'USD' ? 10000 : convertCurrency(10000, 'USD', selectedCurrency);
                  return selectedCurrency === 'USD' 
                    ? `$${defaultAmount.toLocaleString()}` 
                    : `${defaultAmount.toLocaleString()} ${selectedCurrency}`;
                })()}
                value={investAmount ? (selectedCurrency === 'USD' ? `$${investAmount.toLocaleString()}` : `${investAmount.toLocaleString()} ${selectedCurrency}`) : ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setInvestAmount(Number(value) || 0);
                  setShowWarning(false);
                }}
                className="h-14 text-heading-2 placeholder:text-muted-foreground"
              />
              {showWarning && (
                <Caption className="text-warning mt-2">
                  Fill in your investment
                </Caption>
              )}
              <div className="flex items-center gap-3 text-caption mt-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Your funds are securely stored and you can withdraw them anytime</span>
              </div>
            </div>

            <div className="flex justify-start">
              <ArrowRight className="text-muted-foreground rotate-90" size={24} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="leading-none">
                  Estimated Return (APY 7.8%)
                </Label>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-foreground p-4">
                      <div>
                        <p className="text-sm mb-2">
                          APY (Annual Percentage Yield) shows your total yearly returns including compound interest. 
                          Higher returns are possible through diversified crypto lending and DeFi protocols.
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
              <div className="w-full h-14 px-4 text-2xl font-semibold bg-accent/50 rounded-md flex items-center text-primary">
                {(() => {
                  const defaultAmount = selectedCurrency === 'USD' ? 10000 : convertCurrency(10000, 'USD', selectedCurrency);
                  const currentAmount = investAmount || defaultAmount;
                  const returnAmount = currentAmount * 1.078;
                  
                  return selectedCurrency === 'USD' 
                    ? `$${returnAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
                    : `${returnAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${selectedCurrency}`;
                })()}
              </div>
              <div className="flex items-center gap-3 text-caption mt-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>You'll receive {(() => {
                  const defaultAmount = selectedCurrency === 'USD' ? 10000 : convertCurrency(10000, 'USD', selectedCurrency);
                  const currentAmount = investAmount || defaultAmount;
                  const dailyReturn = (currentAmount * 0.078) / 365; // Daily return from 7.8% APY
                  
                  return selectedCurrency === 'USD' 
                    ? `$${dailyReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}` 
                    : `${dailyReturn.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${selectedCurrency}`;
                })()} every 24h</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => {
              if (!investAmount) {
                setShowWarning(true);
                inputRef.current?.focus();
                return;
              }
              navigate('/transaction-review', { 
                state: { amount: investAmount } 
              });
            }} 
            className="w-full"
            size="lg">
            Continue Setup
          </Button>
        </div>
      </div>
    </motion.div>
  );
}