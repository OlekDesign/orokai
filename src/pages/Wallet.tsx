import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet2, 
  CreditCard, 
  Copy, 
  LogOut,
  DollarSign,
  Plus,
  Trash2,
  X,
  Check,
  CreditCardIcon,
  ArrowDownLeft,
  User,
  Edit3,
  Save,
  ChevronRight
} from 'lucide-react';
import { CryptoIcon } from '../components/CryptoIcon';
import { Tooltip } from '../components/Tooltip';
import { MetaMaskIcon } from '../components/MetaMaskIcon';
import confetti from 'canvas-confetti';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Caption, BodyText, Heading2, Heading3 } from "@/components/ui/typography";
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionsContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { cn } from "@/lib/utils";

// Demo data
const DEMO_WALLET: { address: string; assets: Asset[] } = {
  address: '0x1234567890123456789012345678901234567890',
  assets: [
    { symbol: 'USDT', balance: 1000.00, value: 1000.00, price: 1.00 },
    { symbol: 'ETH', balance: 0.5, value: 1250.00, price: 2500.00 },
    { symbol: 'BTC', balance: 0.025, value: 750.00, price: 30000.00 }
  ]
};

type Asset = {
  symbol: string;
  balance: number;
  value: number;
  price: number;
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
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { addTransaction } = useTransactions();
  const { closedInvestmentAmount, profile, setProfile } = useUserProfile();
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [hasWallet, setHasWallet] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState(DEMO_CARDS[0].id);
  const [cards, setCards] = useState(DEMO_CARDS);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [availableFunds, setAvailableFunds] = useState(closedInvestmentAmount || 0);
  
  // Profile editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || '');
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [showAvatarEdit, setShowAvatarEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  useEffect(() => {
    // Update available funds when closed investment amount changes
    setAvailableFunds(closedInvestmentAmount || 0);
  }, [closedInvestmentAmount]);

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

  const handleNameEdit = () => {
    setIsEditingName(true);
    setEditedName(profile?.name || '');
  };

  const handleNameSave = () => {
    if (editedName.trim() && profile) {
      setProfile({ ...profile, name: editedName.trim() });
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditedName(profile?.name || '');
    setIsEditingName(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatar = e.target?.result as string;
        setProfile({ ...profile, avatar });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="relative w-10 h-10"
            onMouseEnter={() => setShowAvatarEdit(true)}
            onMouseLeave={() => setShowAvatarEdit(false)}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-muted cursor-pointer">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name || "Profile"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-muted-foreground" />
              )}
            </div>
            {showAvatarEdit && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full shadow-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <Edit3 size={12} />
              </Button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          
          {profile?.name && (
            <div 
              className="relative"
              onMouseEnter={() => setShowNameEdit(true)}
              onMouseLeave={() => setShowNameEdit(false)}
            >
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-8 text-heading-4"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameSave();
                      if (e.key === 'Escape') handleNameCancel();
                    }}
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6"
                    onClick={handleNameSave}
                  >
                    <Save size={12} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6"
                    onClick={handleNameCancel}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Heading3>{profile.name}</Heading3>
                  {showNameEdit && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6 opacity-70 hover:opacity-100"
                      onClick={handleNameEdit}
                    >
                      <Edit3 size={12} />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut size={16} />
          Log out
        </Button>
      </div>
      {/* Cash Section - Always show but with different states */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-4"
      >
        <Card>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            className="h-full flex flex-col"
          >
            <CardHeader className="pb-6">
              <CardDescription>Cash</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
            <Button
              variant="secondary"
              onClick={() => setShowCardModal(true)}
              className="w-full justify-between"
              style={{ height: '80px' }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <BodyText className="font-medium">•••• {selectedCard?.last4}</BodyText>
                  <p className="text-sm text-muted-foreground">{selectedCard?.bank}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>

            {/* Show available cash only if there's a closed investment */}
            {closedInvestmentAmount !== null && closedInvestmentAmount > 0 ? (
              <div className="space-y-4">
                <div>
                  <Caption className="text-muted-foreground">
                    Available Cash
                  </Caption>
                  <Heading2 className="mt-1 !text-xl !md:text-2xl !font-semibold">${availableFunds.toLocaleString()}</Heading2>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/transaction-review', { state: { amount: availableFunds } })}
                    className="flex-1"
                  >
                    Reinvest
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex-1"
                  >
                    Withdraw to Your Card
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Caption className="text-muted-foreground">
                    Available Cash
                  </Caption>
                  <Heading2 className="mt-1 text-muted-foreground !text-xl !md:text-2xl !font-semibold">$0</Heading2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your rewards & closed investments
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/transaction-review')}
                    className="flex-1"
                    disabled
                  >
                    Reinvest
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex-1"
                    disabled
                  >
                    Withdraw to Your Card
                  </Button>
                </div>
              </div>
            )}
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>

      {/* Crypto Wallet Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="space-y-4"
      >
        {!hasWallet ? (
          <Card>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
            >
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/30 mb-4">
                  <Wallet2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="mb-2">Connect Your Wallet</CardTitle>
                <CardDescription className="mb-6 max-w-md mx-auto">
                  Connect your crypto wallet to start managing your assets and participate in staking
                </CardDescription>
                <Button
                  onClick={handleConnectWallet}
                  disabled={isConnectingWallet}
                >
                  {isConnectingWallet ? "Connecting..." : "Connect Wallet"}
                </Button>
              </CardContent>
            </motion.div>
          </Card>
        ) : (
          <Card>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
            >
              <CardHeader className="pb-6">
                <CardDescription>Crypto</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
              <Button
                variant="secondary"
                className="w-full justify-between"
                style={{ height: '80px' }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <MetaMaskIcon size={24} />
                  </div>
                  <div className="text-left">
                    <BodyText className="font-medium">{DEMO_WALLET.address.slice(0, 6)}...{DEMO_WALLET.address.slice(-4)}</BodyText>
                    <p className="text-sm text-muted-foreground">MetaMask</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(DEMO_WALLET.address);
                      }}
                      className="rounded-full"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Tooltip show={showCopiedTooltip} message="Address copied" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Button>

              <div className="space-y-4">
                <div>
                  
                  <div className="mt-3">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead><Caption>Name</Caption></TableHead>
                          <TableHead><Caption>Balance</Caption></TableHead>
                          <TableHead><Caption>Price</Caption></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {DEMO_WALLET.assets.map((asset) => (
                          <TableRow key={asset.symbol}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <CryptoIcon symbol={asset.symbol} size={24} />
                                <BodyText className="font-medium">{asset.symbol}</BodyText>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <BodyText className="font-medium">{asset.balance} {asset.symbol}</BodyText>
                                <BodyText className="text-muted-foreground">
                                  ${asset.value.toLocaleString()}
                                </BodyText>
                              </div>
                            </TableCell>
                            <TableCell>
                              <BodyText className="font-medium">${asset.price.toLocaleString()}</BodyText>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              </CardContent>
            </motion.div>
          </Card>
        )}
      </motion.div>

      {/* Card Selection Modal */}
      <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Methods</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-3">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={cn(
                    "p-4 rounded-lg transition-colors",
                    selectedCardId === card.id
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-accent/30 hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <BodyText className="font-medium">{card.fullNumber}</BodyText>
                        <p className="text-sm text-muted-foreground">
                          {card.bank} • {card.holder}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedCardId === card.id ? (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      ) : (
                        <Button
                          variant="secondary"
                          size="icon"
                          className="w-6 h-6 rounded-full p-0"
                          onClick={() => setSelectedCardId(card.id)}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
              <Plus className="h-4 w-4 mr-2" />
              Add New Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Funds Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-lg z-40"
            onClick={() => setShowWithdrawModal(false)}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <Card className="w-full max-w-md rounded-3xl">
              <CardContent className="p-12 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowWithdrawModal(false)}
                  className="absolute right-4 top-4 rounded-full hover:bg-accent/30"
                >
                  <X className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl font-bold mb-6">Withdraw Funds</h2>
                <div className="space-y-6">
                  <p className="text-center text-muted-foreground">
                    All funds will be available to you in your wallet within a couple of minutes. Do you want to proceed?
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      addTransaction('withdrawals', availableFunds, 'USDT');
                      setAvailableFunds(0);
                      setShowWithdrawModal(false);
                    }}
                  >
                    Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
      </AnimatePresence>

    </div>
  );
}