import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CryptoIcon } from './CryptoIcon';
import { Caption } from './ui/typography';
import { cn } from '@/lib/utils';

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const currencies = [
  { symbol: 'USD', name: 'USD', value: '···· 4242' },
  { symbol: 'ETH', name: 'ETH', value: '2.42 ETH' },
  { symbol: 'ATOM', name: 'ATOM', value: '10,242.49 ATOM' },
  { symbol: 'SOL', name: 'SOL', value: '39,312.09 SOL' }
];

export function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = currencies.find(c => c.symbol === value) || currencies[0];

  return (
    <div className="relative">
      <div className="relative h-auto pt-6 pb-2 bg-background border border-input rounded-md flex items-center px-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent/50 transition-colors">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <CryptoIcon symbol={selected.symbol} size={20} />
            <span className="text-sm font-medium text-foreground">{selected.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {selected.value}
            </span>
            <ChevronDown size={16} className={`transition-transform text-muted-foreground ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
        <Caption className="absolute left-4 top-2">
          Currency
        </Caption>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover rounded-lg shadow-lg border border-border py-1 z-50">
          {currencies.map(currency => (
            <button
              key={currency.symbol}
              onClick={() => {
                onChange(currency.symbol);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted transition-colors",
                currency.symbol === value && "bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <CryptoIcon symbol={currency.symbol} size={20} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground">{currency.name}</span>
                  <span className="text-xs text-muted-foreground">{currency.value}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
