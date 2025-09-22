import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label, BodyTextSmall } from './ui/typography';

interface CreditCardFormProps {
  onSubmit: (amount: number) => Promise<void>;
  onCancel: () => void;
}

export function CreditCardForm({ onSubmit, onCancel }: CreditCardFormProps) {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
    return numbers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !cardNumber || !expiry || !cvc) return;

    setIsLoading(true);
    try {
      await onSubmit(parseFloat(amount));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <Card className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="block mb-1">
                Amount (USD)
              </Label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>

            <div>
              <Label className="block mb-1">
                Card Number
              </Label>
              <input
                type="text"
                className="input font-mono"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block mb-1">
                  Expiry Date
                </Label>
                <input
                  type="text"
                  className="input font-mono"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>

              <div>
                <Label className="block mb-1">
                  CVC
                </Label>
                <input
                  type="text"
                  className="input font-mono"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substr(0, 3))}
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <BodyTextSmall className="text-muted-foreground">
                  You will receive
                </BodyTextSmall>
                <span className="font-medium">
                  {amount ? `${amount} USDT` : '0.00 USDT'}
                </span>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || !amount || !cardNumber || !expiry || !cvc}
                >
                  {isLoading ? 'Processing...' : 'Top Up'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
