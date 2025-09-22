import { useNavigate } from 'react-router-dom';
import { Plus, Wallet, ArrowRight, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Heading1, Label, Caption, BodyTextSmall } from "@/components/ui/typography";

export default function InvestmentsEmpty() {
  const navigate = useNavigate();
  const [investAmount, setInvestAmount] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6">
    
      <div className="max-w-md mx-auto space-y-6">
        <Heading1>Your Passive Income Starts Here</Heading1>
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Investment
              </Label>
              <Input
                ref={inputRef}
                type="text"
                placeholder="$10,000"
                value={investAmount ? `$${investAmount.toLocaleString()}` : ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setInvestAmount(Number(value) || 0);
                  setShowWarning(false);
                }}
                className="h-14 text-2xl font-semibold placeholder:text-muted-foreground"
              />
              {showWarning && (
                <div className="text-warning text-sm mt-2">
                  Fill in your investment
                </div>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
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
              <Label className="leading-none">
                Estimated Return (APY 7.8%)
              </Label>
              <div className="w-full h-14 px-4 text-2xl font-semibold bg-accent rounded-md flex items-center text-primary">
                ${((investAmount || 10000) * 1.078).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>You'll receive $2,13 every 24h</span>
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
            Review Order
          </Button>
        </div>
      </div>
    </motion.div>
  );
}