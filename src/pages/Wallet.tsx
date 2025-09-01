import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet2, 
  CreditCard, 
  Copy, 
  LogOut,
  DollarSign,
  Plus,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { CryptoIcon } from '../components/CryptoIcon';
import { Tooltip } from '../components/Tooltip';
import { MetaMaskIcon } from '../components/MetaMaskIcon';
import confetti from 'canvas-confetti';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

// Demo data
const DEMO_WALLET: { address: string; assets: Asset[] } = {
  address: '0x1234567890123456789012345678901234567890',
  assets: [
    { symbol: 'USDT', balance: 1000.00, value: 1000.00 },
    { symbol: 'ETH', balance: 0.5, value: 1250.00 },
    { symbol: 'BTC', balance: 0.025, value: 750.00 }
  ]
};

type Asset = {
  symbol: string;
  balance: number;
  value: number;
};

interface CreditCardData {
  id: string;
  last4: string;
  fullNumber: string;
  bank: string;
  holder: string;
}

const DEMO_CARDS: CreditCardData[] = [
  {
    id: '1',
    last4: '4242',
    fullNumber: '4242 4242 4242 4242',
    bank: 'Chase',
    holder: 'John Doe'
  },
  {
    id: '2',
    last4: '5555',
    fullNumber: '5555 4444 3333 2222',
    bank: 'Bank of America',
    holder: 'John Doe'
  }
];

export function Wallet() {
  const { } = useAuth(); // Auth context available for future use
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [hasWallet, setHasWallet] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState(DEMO_CARDS[0].id);
  const [cards, setCards] = useState(DEMO_CARDS);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

  const selectedCard = cards.find(card => card.id === selectedCardId);

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasWallet(true);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleDisconnectWallet = async () => {
    setHasWallet(false);
  };

  const handleAddCard = () => {
    const newCard: CreditCardData = {
      id: Date.now().toString(),
      last4: '8888',
      fullNumber: '8888 8888 8888 8888',
      bank: 'Citibank',
      holder: 'John Doe'
    };
    setCards([...cards, newCard]);
  };

  const handleDeleteCard = (cardId: string) => {
    const newCards = cards.filter(card => card.id !== cardId);
    setCards(newCards);
    if (cardId === selectedCardId && newCards.length > 0) {
      setSelectedCardId(newCards[0].id);
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount) return;
    
    setIsTransferring(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setShowSuccessModal(true);
      setTransferAmount('');
    } finally {
      setIsTransferring(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopiedTooltip(true);
      setTimeout(() => {
        setShowCopiedTooltip(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-8">

      {/* Cash Section */}
      <div className="space-y-4">
        <h2 className="text-section">Cash</h2>
        <Card>
          <div className="text-left py-6 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Available Cash</p>
            <h3 className="text-4xl font-bold mt-2">$2,500.00</h3>
          </div>

          <div className="space-y-6 pt-6">
            <button
              onClick={() => setShowCardModal(true)}
              className="w-full flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-brand" />
              </div>
              <div className="text-left">
                <p className="font-medium">•••• {selectedCard?.last4}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCard?.bank}</p>
              </div>
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Transfer Amount (USD)
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative" style={{ width: '300px' }}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input pl-8"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <Button
                  onClick={handleTransfer}
                  isLoading={isTransferring}
                  disabled={!transferAmount || parseFloat(transferAmount) <= 0}
                >
                  Transfer
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Crypto Wallet Section */}
      <div className="space-y-4">
        <h2 className="text-section">Connected Wallet</h2>
        {!hasWallet ? (
          <Card>
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Wallet2 size={32} className="text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Connect your crypto wallet to start managing your assets and participate in staking
              </p>
              <Button
                onClick={handleConnectWallet}
                isLoading={isConnectingWallet}
              >
                Connect Wallet
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="space-y-6">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <MetaMaskIcon size={40} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {DEMO_WALLET.address.slice(0, 6)}...{DEMO_WALLET.address.slice(-4)}
                </p>
              </div>
              <div className="flex items-center ml-6">
                <div className="relative">
                  <button
                    onClick={() => copyToClipboard(DEMO_WALLET.address)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Copy size={20} className="text-gray-500" />
                  </button>
                  <Tooltip show={showCopiedTooltip} message="Address copied" />
                </div>
                <button
                  onClick={handleDisconnectWallet}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-red-500"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Available Assets</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {DEMO_WALLET.assets.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
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
          </Card>
        )}
      </div>

      {/* Card Selection Modal */}
      <AnimatePresence>
        {showCardModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative"
            >
              <button
                onClick={() => setShowCardModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X size={20} />
              </button>
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Payment Methods</h3>
                
                <div className="space-y-3">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className={`p-4 rounded-lg transition-colors ${
                        selectedCardId === card.id
                          ? 'bg-brand/10 border-2 border-brand'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-brand" />
                          </div>
                          <div>
                            <p className="font-medium">{card.fullNumber}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {card.bank} • {card.holder}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedCardId === card.id ? (
                            <div className="w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                              <Check size={14} className="text-white" />
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedCardId(card.id)}
                              className="w-6 h-6 border-2 border-gray-300 dark:border-gray-500 rounded-full"
                            />
                          )}
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  onClick={handleAddCard}
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Add New Card
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X size={20} />
              </button>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Transfer Initiated!</h3>
                <div className="space-y-4 mb-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium mb-1">
                      Transaction Pending
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Your funds will be available in your account within 2 minutes
                    </p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Transfer amount: ${transferAmount}<br/>
                    From: {selectedCard?.bank} card ending in {selectedCard?.last4}
                  </p>
                </div>
                <Button onClick={() => setShowSuccessModal(false)}>
                  Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}