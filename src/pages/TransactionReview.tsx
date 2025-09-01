import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Shield, CreditCard, Wallet, ArrowLeft, PartyPopper } from 'lucide-react';
import { useUserProfile } from '../contexts/UserProfileContext';

type PaymentMethod = 'credit_card' | 'crypto_wallet';

interface CostBreakdown {
  amount: number;
  yearlyReturn: number;
  fee: number;
}

export function TransactionReview() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { addInvestment } = useUserProfile();
  
  const location = useLocation();
  const investAmount = location.state?.amount || 10000;

  const handleConfirmTransaction = () => {
    const timestamp = new Date().toISOString();
    
    // Create and store the new investment
    const newInvestment = {
      id: Date.now().toString(),
      amount: investAmount,
      apy: 7.8, // Using the same APY as shown in the investment preview
      chain: paymentMethod === 'crypto_wallet' ? 'Solana' : 'Ethereum',
      startDate: timestamp,
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      earned: 0 // Initial earned amount is 0
    };

    // Add investment to UserProfile context
    addInvestment(newInvestment);

    // Create the transaction record
    const newTransaction = {
      id: Date.now().toString(),
      type: 'investment',
      amount: investAmount,
      token: 'USDT',
      status: 'pending',
      timestamp,
    };

    // Add transaction to global state
    if (typeof window.addTransaction === 'function') {
      window.addTransaction(investAmount, 'USDT', 'investment');
    }

    // Show confirmation dialog and trigger confetti
    setShowConfirmation(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const costs: CostBreakdown = {
    amount: investAmount,
    yearlyReturn: Math.round(investAmount * 0.078),
    fee: 2.99
  };

  const totalDue = costs.amount + costs.fee;

  return (
    <div className="fixed inset-0 top-16">
      <div className="h-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column */}
        <div className="bg-gray-50 dark:bg-gray-800/50 overflow-auto">
          <div className="p-6 lg:p-12 max-w-xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-semibold">Review Order</h1>
            </div>
            
            <Card variant="plain">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="py-4 text-gray-600 dark:text-gray-400">Investment Amount</td>
                    <td className="py-4 text-right font-medium">${costs.amount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-600 dark:text-gray-400">Estimated Yearly Return</td>
                    <td className="py-4 text-right font-medium text-brand">+${costs.yearlyReturn.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-600 dark:text-gray-400">Transaction Fee</td>
                    <td className="py-4 text-right font-medium">${costs.fee}</td>
                  </tr>
                  <tr className="!border-t-2">
                    <td className="py-4 font-semibold">Total Due Today</td>
                    <td className="py-4 text-right font-semibold">${totalDue.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </Card>

            <Card variant="plain">
              <div className="flex items-start space-x-4">
                <img
                  src="https://ui-avatars.com/api/?name=Sarah+Mitchell&background=26A17B&color=fff"
                  alt="Sarah Mitchell"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    "I've been using this platform for over a year now. The returns are consistent and the process is incredibly transparent. Definitely recommend it!"
                  </p>
                  <p className="mt-2 font-medium">Sarah Mitchell</p>
                  <p className="text-sm text-gray-500">Investor since 2023</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-white dark:bg-gray-900 overflow-auto">
          <div className="p-6 lg:p-12 max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold">Payment Details</h2>

            <Card variant="plain">
              <div className="space-y-6">
                {/* Payment Method Switch */}
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <button
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`flex items-center justify-center space-x-2 w-1/2 py-2 rounded-md transition-colors ${
                      paymentMethod === 'credit_card'
                        ? 'bg-white dark:bg-gray-700 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span>Credit Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('crypto_wallet')}
                    className={`flex items-center justify-center space-x-2 w-1/2 py-2 rounded-md transition-colors ${
                      paymentMethod === 'crypto_wallet'
                        ? 'bg-white dark:bg-gray-700 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Wallet size={18} />
                    <span>Crypto Wallet</span>
                  </button>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Crypto Wallet Options */}
                {paymentMethod === 'crypto_wallet' && (
                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      {['USDT', 'USDC', 'SOL'].map((coin) => (
                        <button
                          key={coin}
                          className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand transition-colors"
                        >
                          <div className="text-center">
                            <span className="block font-medium">{coin}</span>
                            <span className="text-sm text-gray-500">Solana</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full h-12"
                  onClick={handleConfirmTransaction}
                >
                  Confirm Transaction
                </Button>

                <div className="flex items-center justify-center text-sm text-gray-500 space-x-2">
                  <Shield size={16} />
                  <span>Secure transaction provided by Stripe</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowConfirmation(false)}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <Card className="w-full max-w-md text-center p-8 relative">
                <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-6">
                  <PartyPopper size={24} />
                </div>

                <h2 className="text-2xl font-bold mb-4">Investment Initiated! 🎉</h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Great choice! Your investment is being processed and will be ready in a couple of minutes. 
                  Don't worry, your funds are safe and secure with us.
                </p>

                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full h-12"
                >
                  Go to Dashboard
                </Button>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}