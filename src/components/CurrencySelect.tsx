import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CryptoIcon } from './CryptoIcon';

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const currencies = [
  { symbol: 'USDT', name: 'USD Tether' },
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' }
];

export function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = currencies.find(c => c.symbol === value) || currencies[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CryptoIcon symbol={selected.symbol} size={20} />
          <span>{selected.name}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          {currencies.map(currency => (
            <button
              key={currency.symbol}
              onClick={() => {
                onChange(currency.symbol);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                currency.symbol === value ? 'bg-gray-50 dark:bg-gray-700' : ''
              }`}
            >
              <CryptoIcon symbol={currency.symbol} size={20} />
              <span>{currency.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
