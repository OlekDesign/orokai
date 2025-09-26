import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CryptoIcon } from './CryptoIcon';
import { Caption } from './ui/typography';

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const currencies = [
  { symbol: 'USD', name: 'USD', value: 'Credit Card' },
  { symbol: 'ETH', name: 'ETH', value: '2.42' },
  { symbol: 'ATOM', name: 'ATOM', value: '10,242.49' },
  { symbol: 'SOL', name: 'SOL', value: '39,312.09' }
];

export function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = currencies.find(c => c.symbol === value) || currencies[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-auto pt-6 pb-2 px-4 min-h-[44px] bg-muted rounded-lg hover:bg-muted/80 transition-colors"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <CryptoIcon symbol={selected.symbol} size={20} />
            <span className="text-xl font-semibold">{selected.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Caption className="text-muted-foreground text-xs">{selected.value}</Caption>
            <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>
      <span className="text-xs text-muted-foreground font-medium absolute left-4 top-2">
        Currency
      </span>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-secondary rounded-lg shadow-md border border-border py-1 z-50">
          {currencies.map(currency => (
            <button
              key={currency.symbol}
              onClick={() => {
                onChange(currency.symbol);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 min-h-[44px] hover:bg-muted transition-colors ${
                currency.symbol === value ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <CryptoIcon symbol={currency.symbol} size={20} />
                <span>{currency.name}</span>
              </div>
              <Caption className="text-muted-foreground text-xs">{currency.value}</Caption>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
