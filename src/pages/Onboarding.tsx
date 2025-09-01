import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

const walletOptions = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊' },
  { id: 'okx', name: 'OKX Wallet', icon: '🌟' },
  { id: 'ledger', name: 'Ledger', icon: '🔒' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
];

export function Onboarding() {
  const [step, setStep] = useState<'wallet' | 'funds'>('wallet');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { connectWallet, addFunds } = useAuth();
  const navigate = useNavigate();

  const handleWalletConnect = async () => {
    if (!selectedWallet) return;
    
    setIsLoading(true);
    try {
      await connectWallet(selectedWallet);
      setStep('funds');
    } catch (error) {
      console.error('Wallet connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!amount) return;
    
    setIsLoading(true);
    try {
      await addFunds(parseFloat(amount));
      navigate('/dashboard');
    } catch (error) {
      console.error('Add funds error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-headline mb-2">
            {step === 'wallet' ? 'Connect Your Wallet' : 'Add Funds'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'wallet'
              ? 'Choose your preferred wallet to get started'
              : 'Add funds to start investing'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-elevation p-8">
          {step === 'wallet' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {walletOptions.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => setSelectedWallet(wallet.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedWallet === wallet.id
                        ? 'border-brand bg-brand/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-brand/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{wallet.icon}</div>
                    <div className="font-medium">{wallet.name}</div>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleWalletConnect}
                isLoading={isLoading}
                disabled={!selectedWallet}
                className="w-full"
              >
                Connect Wallet
              </Button>

              <button
                onClick={handleSkip}
                className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Skip for now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                  <span className="font-medium">${amount || '0.00'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">${amount || '0.00'}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddFunds}
                isLoading={isLoading}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full"
              >
                Add Funds
              </Button>

              <button
                onClick={handleSkip}
                className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
