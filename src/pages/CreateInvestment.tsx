import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CreditCard, Wallet } from 'lucide-react';
import { Button } from '../components/Button';

import { CryptoIcon } from '../components/CryptoIcon';



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
        <button
          onClick={() => navigate('/invest')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold">Create Investment</h1>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Amount to Invest
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="number"
            className={`input ${showInputError ? 'ring-2 ring-red-500 animate-shake' : ''}`}
            value={investAmount}
            onChange={(e) => {
              setInvestAmount(e.target.value);
              setShowInputError(false);
            }}
            placeholder="Enter amount"
          />
        </div>
        {showInputError && (
          <p className="mt-1 text-sm text-red-500">How much would you like to invest?</p>
        )}
      </div>

      {/* Investment Overview */}
      <div className="p-4 bg-white dark:bg-gray-700 rounded-lg space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Estimated APY</span>
            <span className="font-medium text-brand">12.5%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Lock Period</span>
            <span className="font-medium">None</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-400">Daily Estimated Earnings</span>
            <span className="font-medium text-brand">
              {(parseFloat(investAmount || '0') * 0.125 / 365).toFixed(2)} {selectedCurrency}
            </span>
          </div>
        </div>
        <Button variant="secondary" size="sm" className="w-full" onClick={() => {}}>
          See Different Options
        </Button>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Pay with</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-colors ${
              paymentMethod === 'card'
                ? 'border-brand bg-brand/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-brand/50'
            }`}
          >
            <CreditCard className={paymentMethod === 'card' ? 'text-brand' : 'text-gray-500'} />
            <span className="ml-2 font-medium">Debit Card</span>
          </button>
          
          <button
            onClick={() => setPaymentMethod('crypto')}
            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-colors ${
              paymentMethod === 'crypto'
                ? 'border-brand bg-brand/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-brand/50'
            }`}
          >
            <Wallet className={paymentMethod === 'crypto' ? 'text-brand' : 'text-gray-500'} />
            <span className="ml-2 font-medium">Cryptocurrencies</span>
          </button>
        </div>

        {paymentMethod === 'card' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Card Number
              </label>
              <input
                type="text"
                className="input"
                placeholder="4242 4242 4242 4242"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedNetwork('SOL')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedNetwork === 'SOL'
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Solana
              </button>
              <button
                onClick={() => setSelectedNetwork('ETH')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedNetwork === 'ETH'
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Ethereum
              </button>
            </div>

            <div className="space-y-3">
              {cryptoAssets[selectedNetwork].map((asset) => (
                <div
                  key={asset.symbol}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CryptoIcon symbol={asset.symbol} size={32} />
                    <div>
                      <div className="font-medium">{asset.balance} {asset.symbol}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ${asset.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Button */}
      <Button
        className="w-full"
        onClick={handleConfirmClick}
        isLoading={isInvesting}
      >
        <Shield className="w-4 h-4 mr-2" />
        Confirm Investment
      </Button>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        You can close this investment and withdraw your funds anytime
      </p>
    </div>
  );
}
