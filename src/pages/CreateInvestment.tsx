import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CreditCard, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CryptoIcon } from '../components/CryptoIcon';
import { cn } from "@/lib/utils";

type PaymentMethod = 'card' | 'crypto';

interface CryptoAsset {
  symbol: string;
  balance: number;
  value: number;
}

const cryptoAssets: Record<string, CryptoAsset[]> = {
  SOL: [
    { symbol: 'SOL', balance: 25.5, value: 2550 },
    { symbol: 'USDC', balance: 1000, value: 1000 }
  ],
  ETH: [
    { symbol: 'ETH', balance: 1.2, value: 3000 },
    { symbol: 'USDT', balance: 2500, value: 2500 }
  ]
};

export function CreateInvestment() {
  const navigate = useNavigate();
  const [investAmount, setInvestAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  const selectedCurrency = 'USDT';
  const [showInputError, setShowInputError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [selectedNetwork, setSelectedNetwork] = useState('SOL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleConfirmClick = () => {
    if (!investAmount) {
      setShowInputError(true);
      inputRef.current?.focus();
      return;
    }
    handleInvest();
  };

  const handleInvest = async () => {
    if (!investAmount) return;

    setIsInvesting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/invest');
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/invest')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Create Investment</h1>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Amount to Invest
        </label>
        <Input
          ref={inputRef}
          type="number"
          className={cn(
            showInputError && "ring-2 ring-destructive animate-shake"
          )}
          value={investAmount}
          onChange={(e) => {
            setInvestAmount(e.target.value);
            setShowInputError(false);
          }}
          placeholder="Enter amount"
        />
        {showInputError && (
          <p className="text-sm text-destructive">How much would you like to invest?</p>
        )}
      </div>

      {/* Investment Overview */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated APY</span>
              <span className="font-medium text-primary">12.5%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lock Period</span>
              <span className="font-medium">None</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border">
              <span className="text-muted-foreground">Daily Estimated Earnings</span>
              <span className="font-medium text-primary">
                {(parseFloat(investAmount || '0') * 0.125 / 365).toFixed(2)} {selectedCurrency}
              </span>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="w-full">
            See Different Options
          </Button>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Pay with</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            onClick={() => setPaymentMethod('card')}
            className={cn(
              "h-auto py-4 justify-center",
              paymentMethod === 'card' && "border-primary bg-primary/10"
            )}
          >
            <CreditCard className={cn(
              "mr-2 h-5 w-5",
              paymentMethod === 'card' ? "text-primary" : "text-muted-foreground"
            )} />
            <span>Debit Card</span>
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => setPaymentMethod('crypto')}
            className={cn(
              "h-auto py-4 justify-center",
              paymentMethod === 'crypto' && "border-primary bg-primary/10"
            )}
          >
            <Wallet className={cn(
              "mr-2 h-5 w-5",
              paymentMethod === 'crypto' ? "text-primary" : "text-muted-foreground"
            )} />
            <span>Cryptocurrencies</span>
          </Button>
        </div>

        {paymentMethod === 'card' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Card Number
              </label>
              <Input
                type="text"
                placeholder="4242 4242 4242 4242"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Expiry Date
                </label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  CVC
                </label>
                <Input
                  type="text"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex space-x-3">
              <Button
                variant={selectedNetwork === 'SOL' ? "default" : "secondary"}
                onClick={() => setSelectedNetwork('SOL')}
                size="sm"
              >
                Solana
              </Button>
              <Button
                variant={selectedNetwork === 'ETH' ? "default" : "secondary"}
                onClick={() => setSelectedNetwork('ETH')}
                size="sm"
              >
                Ethereum
              </Button>
            </div>

            <div className="space-y-3">
              {cryptoAssets[selectedNetwork].map((asset) => (
                <Button
                  key={asset.symbol}
                  variant="secondary"
                  className="w-full h-auto p-4 justify-start hover:bg-muted"
                >
                  <div className="flex items-center space-x-3">
                    <CryptoIcon symbol={asset.symbol} size={32} />
                    <div className="text-left">
                      <div className="font-medium">{asset.balance} {asset.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        ${asset.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Button */}
      <Button
        className="w-full"
        onClick={handleConfirmClick}
        disabled={isInvesting}
      >
        {isInvesting ? (
          "Processing..."
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Confirm Investment
          </>
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        You can close this investment and withdraw your funds anytime
      </p>
    </div>
  );
}