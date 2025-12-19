import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, CreditCard, Wallet, ArrowLeft, PartyPopper, Check, X, CheckCircle } from 'lucide-react';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useTransactions } from '../contexts/TransactionsContext';
import { cn } from "@/lib/utils";
import { Heading1, Heading2, Heading4, BodyText, BodyTextSmall, Caption, Label } from '@/components/ui/typography';
import { PageHeader } from "@/components/PageHeader";

type PaymentMethod = 'credit_card' | 'crypto_wallet';
type CryptoCurrency = 'ETH' | 'SOL' | 'BTC';

interface CostBreakdown {
  amount: number;
  yearlyReturn: number;
  fee: number;
}

interface CurrencyData {
  symbol: CryptoCurrency;
  name: string;
  balance: number;
  usdValue: number;
  icon: string;
}

export function TransactionReview() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>('ETH');
  const [investInUSDT, setInvestInUSDT] = useState(true);
  const [saveCard, setSaveCard] = useState(true);
  const [showCardForm, setShowCardForm] = useState(true);
  const [isFirstInvestment, setIsFirstInvestment] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsWarning, setShowTermsWarning] = useState(false);
  
  // Card form inputs
  const [cardNumber, setCardNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  
  // Saved card details (persisted in sessionStorage)
  const [savedCard, setSavedCard] = useState(() => {
    const saved = sessionStorage.getItem('savedCard');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Saved wallet details (persisted in sessionStorage)
  const [savedWallet, setSavedWallet] = useState(() => {
    const saved = sessionStorage.getItem('savedWallet');
    return saved ? JSON.parse(saved) : null;
  });
  const { addInvestment, hasInvestments } = useUserProfile();
  const { addTransaction } = useTransactions();
  
  const location = useLocation();
  const investAmount = location.state?.amount || 10000;
  
  // Currency data for crypto wallet
  const currencies: CurrencyData[] = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 2.45,
      usdValue: 3250.00,
      icon: '⟠'
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      balance: 45.2,
      usdValue: 142.50,
      icon: '◎'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 0.15,
      usdValue: 43500.00,
      icon: '₿'
    }
  ];
  
  // Determine where user came from based on referrer or state
  const cameFromNewInvestment = location.state?.from === 'new-investment' || 
    (typeof window !== 'undefined' && window.history.state?.from === 'new-investment');

  // Check if we should show the card form or saved card
  useEffect(() => {
    setShowCardForm(!savedCard);
  }, [savedCard]);

  // Initialize payment method based on saved data
  useEffect(() => {
    if (savedCard && !savedWallet) {
      setPaymentMethod('credit_card');
    } else if (savedWallet && !savedCard) {
      setPaymentMethod('crypto_wallet');
      setSelectedCurrency(savedWallet.currency);
      setInvestInUSDT(savedWallet.investInUSDT);
    } else if (savedWallet && savedCard) {
      // Keep current selection if both are saved
      // Or you could implement logic to prefer one over the other
      if (savedWallet.currency) {
        setSelectedCurrency(savedWallet.currency);
        setInvestInUSDT(savedWallet.investInUSDT);
      }
    }
  }, [savedCard, savedWallet]);

  const handleClose = () => {
    if (cameFromNewInvestment) {
      // Use originalSource if available, otherwise default to investments
      const originalSource = location.state?.originalSource || 'investments';
      navigate(`/${originalSource}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    navigate('/new-investment');
  };

  const handleConfirmTransaction = () => {
    // Check if terms are accepted
    if (!acceptedTerms) {
      setShowTermsWarning(true);
      return;
    }
    
    // Hide warning if terms are accepted
    setShowTermsWarning(false);
    
    // Capture if this is the first investment before adding the new one
    const wasFirstInvestment = !hasInvestments;
    setIsFirstInvestment(wasFirstInvestment);

    // Save card details if checkbox is checked and payment method is credit card
    if (paymentMethod === 'credit_card' && saveCard && cardNumber && ownerName) {
      const cardToSave = {
        ownerName,
        lastFour: cardNumber.slice(-4),
        expiryDate,
        savedAt: new Date().toISOString()
      };
      setSavedCard(cardToSave);
      sessionStorage.setItem('savedCard', JSON.stringify(cardToSave));
    }

    const timestamp = new Date().toISOString();
    
    // Determine the chain based on payment method and selected currency
    let chain = 'Ethereum';
    if (paymentMethod === 'crypto_wallet') {
      switch (selectedCurrency) {
        case 'SOL':
          chain = 'Solana';
          break;
        case 'BTC':
          chain = 'Bitcoin';
          break;
        case 'ETH':
        default:
          chain = 'Ethereum';
          break;
      }
    }
    
    // Create and store the new investment
    const newInvestment = {
      id: Date.now().toString(),
      amount: investAmount,
      apy: 7.8,
      chain,
      startDate: timestamp,
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      earned: 0
    };

    addInvestment(newInvestment);

    // Add transaction using the context - use selected currency or USDT based on checkbox
    const transactionCurrency = paymentMethod === 'crypto_wallet' && investInUSDT ? 'USDT' : 
                               paymentMethod === 'crypto_wallet' ? selectedCurrency : 'USDT';
    addTransaction('investment', investAmount, transactionCurrency);

    setShowConfirmation(true);
  };

  const costs: CostBreakdown = {
    amount: investAmount,
    yearlyReturn: Math.round(investAmount * 0.078),
    fee: 2.99
  };

  const totalDue = costs.amount + costs.fee;

  return (
    <div className="fixed inset-0 overflow-hidden">
      <PageHeader onClose={handleClose} />
      <div className="h-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column */}
        <div className="bg-background overflow-auto scrollbar-hide">
          <div className="p-4 lg:p-12 max-w-xl mx-auto lg:ml-auto lg:mr-4 space-y-6">
            {/* Empty space to account for header */}
            <div className="h-8 md:h-4" />
            
         
            {/* Review Order Headline */}
            <Heading2>Review Order</Heading2>
            
            <table className="w-full">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-4"><BodyTextSmall className="text-muted-foreground">Investment Amount</BodyTextSmall></td>
                  <td className="py-4 text-right font-medium">${costs.amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-4"><BodyTextSmall className="text-muted-foreground">Estimated Yearly Return</BodyTextSmall></td>
                  <td className="py-4 text-right font-medium text-primary">+${costs.yearlyReturn.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-4"><BodyTextSmall className="text-muted-foreground">Transaction Fee</BodyTextSmall></td>
                  <td className="py-4 text-right font-medium">${costs.fee}</td>
                </tr>
                <tr className="border-t-2">
                  <td className="py-4 font-semibold">Total Due Today</td>
                  <td className="py-4 text-right font-semibold">${totalDue.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <Card className="hidden md:block">
              <CardContent className="!pt-6 pb-8">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Sarah Mitchell"
                  className="w-10 h-10 rounded-full object-cover mb-12"
                />
                <Heading4 className="mb-3">Sarah Mitchell</Heading4>
                <p className="text-muted-foreground leading-relaxed">
                  I've been using this platform for over a year now. The returns are consistent and the process is incredibly transparent. Definitely recommend it!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-background overflow-auto scrollbar-hide">
          <div className="p-6 lg:p-12 max-w-xl ml-4 space-y-6 pb-2 md:pb-6">
            {/* Empty space to account for header */}
            <div className="h-2" />
            
            {/* Empty space to align with back button in left column */}
            
            
            <Heading2 className="hidden md:block pt-2">Payment Details</Heading2>

            <Card className="hidden md:block">
              <CardContent className="!pt-6 pb-6">
                <div className="space-y-6">
                  {/* Payment Method Switch */}
                  <div className="flex p-1 bg-muted rounded-lg">
                    <button
                      onClick={() => setPaymentMethod('credit_card')}
                      className={cn(
                        "flex items-center justify-center space-x-2 w-1/2 py-2 rounded-md transition-colors",
                        paymentMethod === 'credit_card'
                          ? 'bg-background shadow-sm'
                          : 'text-muted-foreground'
                      )}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Credit Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('crypto_wallet')}
                      className={cn(
                        "flex items-center justify-center space-x-2 w-1/2 py-2 rounded-md transition-colors",
                        paymentMethod === 'crypto_wallet'
                          ? 'bg-background shadow-sm'
                          : 'text-muted-foreground'
                      )}
                    >
                      <Wallet className="h-4 w-4" />
                      <span>Crypto Wallet</span>
                    </button>
                  </div>

                  {/* Credit Card Section */}
                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-4">
                      {/* Saved Card Display */}
                      {!showCardForm && savedCard && (
                        <div className="space-y-4">
                          <div className="p-4 border-2 border-primary bg-primary/5 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">
                                  MC
                                </div>
                                <div>
                                  <div className="font-medium">{savedCard.ownerName}</div>
                                  <div className="text-sm text-muted-foreground">•••• •••• •••• {savedCard.lastFour}</div>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {savedCard.expiryDate}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            onClick={() => setShowCardForm(true)}
                            className="w-full"
                          >
                            Add New Card
                          </Button>
                        </div>
                      )}

                      {/* Credit Card Form */}
                      {showCardForm && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Card Number
                            </Label>
                            <Input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Owner's Name
                            </Label>
                            <Input
                              type="text"
                              placeholder="John Doe"
                              value={ownerName}
                              onChange={(e) => setOwnerName(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Expiry Date
                              </Label>
                              <Input
                                type="text"
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                CVC
                              </Label>
                              <Input
                                type="text"
                                placeholder="123"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          {/* Save Card Checkbox */}
                          <div className="flex items-center space-x-3 pt-2">
                            <button
                              onClick={() => setSaveCard(!saveCard)}
                              className={cn(
                                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                saveCard
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-border hover:border-primary"
                              )}
                            >
                              {saveCard && <Check className="h-3 w-3" />}
                            </button>
                            <Label className="cursor-pointer" onClick={() => setSaveCard(!saveCard)}>
                              Save the card
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Crypto Wallet Options */}
                  {paymentMethod === 'crypto_wallet' && (
                    <div className="space-y-6">
                      {/* Currency Selection Cards */}
                      <div className="space-y-2">
                        <Label>
                          Select Currency
                        </Label>
                        <div className="space-y-3">
                          {currencies.map((currency) => (
                            <button
                              key={currency.symbol}
                              onClick={() => setSelectedCurrency(currency.symbol)}
                              className={cn(
                                "w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all text-left",
                                selectedCurrency === currency.symbol
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border hover:border-primary/50 hover:bg-muted/30"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                                  {currency.icon}
                                </div>
                                <div>
                                  <div className="font-medium text-base">{currency.symbol}</div>
                                  <div className="text-sm text-muted-foreground">{currency.name}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{currency.balance} {currency.symbol}</div>
                                <div className="text-sm text-muted-foreground">
                                  ${(currency.balance * currency.usdValue).toLocaleString()}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Invest in USDT Checkbox */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setInvestInUSDT(!investInUSDT)}
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                            investInUSDT
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border hover:border-primary"
                          )}
                        >
                          {investInUSDT && <Check className="h-3 w-3" />}
                        </button>
                        <Label className="cursor-pointer" onClick={() => setInvestInUSDT(!investInUSDT)}>
                          Invest in USDT
                        </Label>
                      </div>
                    </div>
                  )}

                  {/* Terms and Conditions Checkbox */}
                  <div className="flex items-start space-x-3 pt-2">
                    <button
                      onClick={() => {
                        setAcceptedTerms(!acceptedTerms);
                        if (showTermsWarning) setShowTermsWarning(false);
                      }}
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-0.5",
                        acceptedTerms
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border hover:border-primary",
                        showTermsWarning && !acceptedTerms && "border-destructive bg-destructive/10"
                      )}
                    >
                      {acceptedTerms && <Check className="h-3 w-3" />}
                    </button>
                    <Label 
                      className="cursor-pointer leading-relaxed" 
                      onClick={() => {
                        setAcceptedTerms(!acceptedTerms);
                        if (showTermsWarning) setShowTermsWarning(false);
                      }}
                    >
                      I accept the{' '}
                      <a 
                        href="#" 
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms and Conditions
                      </a>
                    </Label>
                  </div>

                  {/* Warning Message */}
                  {showTermsWarning && (
                    <div className="text-destructive text-xs text-left">
                      You must first accept the Terms and Conditions
                    </div>
                  )}

                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={handleConfirmTransaction}
                  >
                    Confirm Transaction
                  </Button>

                  <div className="flex items-center justify-center text-sm text-muted-foreground space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Secure transaction provided by Stripe</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* Mobile buttons - positioned outside the grid layout */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 space-y-4 flex flex-col bg-background border-t border-border">
        {/* Show saved payment method or Add Payment Details button */}
        {(savedCard && paymentMethod === 'credit_card') || (savedWallet && paymentMethod === 'crypto_wallet') ? (
          <div className="space-y-4">
            {/* Saved Credit Card Display */}
            {savedCard && paymentMethod === 'credit_card' && (
              <div className="p-4 border-2 border-primary bg-primary/5 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      MC
                    </div>
                    <div>
                      <div className="font-medium">{savedCard.ownerName}</div>
                      <div className="text-sm text-muted-foreground">•••• •••• •••• {savedCard.lastFour}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {savedCard.expiryDate}
                  </div>
                </div>
              </div>
            )}
            
            {/* Saved Wallet Display */}
            {savedWallet && paymentMethod === 'crypto_wallet' && (
              <div className="p-4 border-2 border-primary bg-primary/5 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                      {savedWallet.currencyIcon}
                    </div>
                    <div>
                      <div className="font-medium">{savedWallet.currency} Wallet</div>
                      <div className="text-sm text-muted-foreground">
                        {savedWallet.investInUSDT ? 'Converting to USDT' : `Using ${savedWallet.currency}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              variant="ghost"
              className="w-full"
              size="lg"
              onClick={() => setShowPaymentDrawer(true)}
            >
              Change Payment Method
            </Button>
          </div>
        ) : (
          <Button 
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={() => setShowPaymentDrawer(true)}
          >
            Add Payment Details
          </Button>
        )}
        
        {/* Terms and Conditions Checkbox - Mobile */}
        <div className="flex items-start space-x-3">
          <button
            onClick={() => {
              setAcceptedTerms(!acceptedTerms);
              if (showTermsWarning) setShowTermsWarning(false);
            }}
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-0.5",
              acceptedTerms
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border hover:border-primary",
              showTermsWarning && !acceptedTerms && "border-destructive bg-destructive/10"
            )}
          >
            {acceptedTerms && <Check className="h-3 w-3" />}
          </button>
          <Label 
            className="cursor-pointer leading-relaxed" 
            onClick={() => {
              setAcceptedTerms(!acceptedTerms);
              if (showTermsWarning) setShowTermsWarning(false);
            }}
          >
            I accept the{' '}
            <a 
              href="#" 
              className="text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Terms and Conditions
            </a>
          </Label>
        </div>

        {/* Warning Message - Mobile */}
        {showTermsWarning && (
          <div className="text-destructive text-xs text-left">
            You must first accept the Terms and Conditions
          </div>
        )}
        
        <Button 
          className="w-full"
          size="lg"
          onClick={handleConfirmTransaction}
        >
          Confirm Transaction
        </Button>
        
        <div className="flex items-center justify-center text-sm text-muted-foreground space-x-2">
          <Shield className="h-4 w-4" />
          <span>Secure transaction provided by Stripe</span>
        </div>
      </div>

      {/* Payment Details Drawer */}
      <AnimatePresence>
        {showPaymentDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowPaymentDrawer(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border rounded-t-lg overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <Heading4>Payment Details</Heading4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPaymentDrawer(false)}
                    className="rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 pb-8">
                <div className="space-y-6">
                  {/* Payment Method Switch */}
                  <div className="flex p-1 bg-muted rounded-lg">
                    <button
                      onClick={() => setPaymentMethod('credit_card')}
                      className={cn(
                        "flex items-center justify-center space-x-2 w-1/2 py-2 rounded-md transition-colors",
                        paymentMethod === 'credit_card'
                          ? 'bg-background shadow-sm'
                          : 'text-muted-foreground'
                      )}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Credit Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('crypto_wallet')}
                      className={cn(
                        "flex items-center justify-center space-x-2 w-1/2 py-2 rounded-md transition-colors",
                        paymentMethod === 'crypto_wallet'
                          ? 'bg-background shadow-sm'
                          : 'text-muted-foreground'
                      )}
                    >
                      <Wallet className="h-4 w-4" />
                      <span>Crypto Wallet</span>
                    </button>
                  </div>

                  {/* Credit Card Section */}
                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-4">
                      {/* Saved Card Display */}
                      {!showCardForm && savedCard && (
                        <div className="space-y-4">
                          <div className="p-4 border-2 border-primary bg-primary/5 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">
                                  MC
                                </div>
                                <div>
                                  <div className="font-medium">{savedCard.ownerName}</div>
                                  <div className="text-sm text-muted-foreground">•••• •••• •••• {savedCard.lastFour}</div>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {savedCard.expiryDate}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            onClick={() => setShowCardForm(true)}
                            className="w-full"
                          >
                            Add New Card
                          </Button>
                        </div>
                      )}

                      {/* Credit Card Form */}
                      {showCardForm && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Card Number
                            </Label>
                            <Input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Owner's Name
                            </Label>
                            <Input
                              type="text"
                              placeholder="John Doe"
                              value={ownerName}
                              onChange={(e) => setOwnerName(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Expiry Date
                              </Label>
                              <Input
                                type="text"
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                CVC
                              </Label>
                              <Input
                                type="text"
                                placeholder="123"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          {/* Save Card Button */}
                          <Button
                            onClick={() => {
                              if (!saveCard) {
                                // Save card details and hide drawer
                                if (cardNumber && ownerName) {
                                  const cardToSave = {
                                    ownerName,
                                    lastFour: cardNumber.slice(-4),
                                    expiryDate,
                                    savedAt: new Date().toISOString()
                                  };
                                  setSavedCard(cardToSave);
                                  sessionStorage.setItem('savedCard', JSON.stringify(cardToSave));
                                  setSaveCard(true);
                                }
                                setShowPaymentDrawer(false);
                              } else {
                                setSaveCard(false);
                              }
                            }}
                            variant={saveCard ? "default" : "outline"}
                            className="w-full"
                            size="lg"
                          >
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Crypto Wallet Options */}
                  {paymentMethod === 'crypto_wallet' && (
                    <div className="space-y-6">
                      {/* Currency Selection Cards */}
                      <div className="space-y-2">
                        <Label>
                          Select Currency
                        </Label>
                        <div className="space-y-3">
                          {currencies.map((currency) => (
                            <button
                              key={currency.symbol}
                              onClick={() => setSelectedCurrency(currency.symbol)}
                              className={cn(
                                "w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all text-left",
                                selectedCurrency === currency.symbol
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border hover:border-primary/50 hover:bg-muted/30"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                                  {currency.icon}
                                </div>
                                <div>
                                  <div className="font-medium text-base">{currency.symbol}</div>
                                  <div className="text-sm text-muted-foreground">{currency.name}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{currency.balance} {currency.symbol}</div>
                                <div className="text-sm text-muted-foreground">
                                  ${(currency.balance * currency.usdValue).toLocaleString()}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Invest in USDT Checkbox */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setInvestInUSDT(!investInUSDT)}
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                            investInUSDT
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border hover:border-primary"
                          )}
                        >
                          {investInUSDT && <Check className="h-3 w-3" />}
                        </button>
                        <Label className="cursor-pointer" onClick={() => setInvestInUSDT(!investInUSDT)}>
                          Invest in USDT
                        </Label>
                      </div>

                      {/* Save Wallet Button */}
                      <Button
                        onClick={() => {
                          if (!saveCard) {
                            // Save wallet details and hide drawer
                            const selectedCurrencyData = currencies.find(c => c.symbol === selectedCurrency);
                            if (selectedCurrencyData) {
                              const walletToSave = {
                                currency: selectedCurrency,
                                currencyName: selectedCurrencyData.name,
                                currencyIcon: selectedCurrencyData.icon,
                                investInUSDT,
                                savedAt: new Date().toISOString()
                              };
                              setSavedWallet(walletToSave);
                              sessionStorage.setItem('savedWallet', JSON.stringify(walletToSave));
                              setSaveCard(true);
                            }
                            setShowPaymentDrawer(false);
                          } else {
                            setSaveCard(false);
                          }
                        }}
                        variant={saveCard ? "default" : "outline"}
                        className="w-full"
                        size="lg"
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-lg z-40"
              onClick={() => setShowConfirmation(false)}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              {isFirstInvestment ? (
                // First Investment Dialog - with background image
                <div 
                  className="w-full max-w-sm rounded-3xl bg-cover bg-center bg-no-repeat border shadow h-[624px]" 
                  style={{backgroundImage: `url(${import.meta.env.BASE_URL}oak.png)`}}
                >
                  <div className="p-8 text-left rounded-3xl flex flex-col justify-between h-full">
                    <div>
                      <h1 className="text-4xl font-medium leading-tight tracking-tight mb-4"> It's done</h1>
                      
                       <p className="text-foreground opacity-85">
                       Your first investment is quietly at work, like a seed planted long ago. Over time, it grows — leaving you with more freedom, more peace, more life to enjoy.
                       <br />
                       Welcome to Orokai.
                       </p>
                    </div>

                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="w-full"
                    size="lg"
                  >
                    Go to Dashboard
                  </Button>
                  </div>
                </div>
              ) : (
                // Subsequent Investment Dialog - with card background
                <Card className="w-full max-w-sm">
                  <CardContent className="!px-8 !py-8 !pt-12 text-center">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-primary" />
                      </div>
                      
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Transaction Successful</h2>
                        
                        <p className="text-muted-foreground">
                          Great choice! Your investment is being processed and will be ready in a couple of minutes.
                          Don't worry, your funds are safe and secure with us.
                        </p>
                      </div>

                      <Button
                        onClick={() => navigate('/dashboard')}
                        className="w-full"
                        size="lg"
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}