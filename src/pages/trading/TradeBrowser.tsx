import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import { BodyText, BodyTextSmall, Caption } from '../../components/ui/typography';

export interface Asset {
  name: string;
  ticker: string;
  price: number;
  change24hPct: number;
  change24hAbs: number;
}

const ASSETS: Asset[] = [
  { name: 'Bitcoin', ticker: 'BTC', price: 67240, change24hPct: 2.4, change24hAbs: 1573 },
  { name: 'Ethereum', ticker: 'ETH', price: 3512, change24hPct: 1.8, change24hAbs: 62 },
  { name: 'NVIDIA', ticker: 'NVDA', price: 97.3, change24hPct: 3.3, change24hAbs: 3.1 },
  { name: 'Apple', ticker: 'AAPL', price: 181.2, change24hPct: 0.7, change24hAbs: 1.26 },
  { name: 'Tesla', ticker: 'TSLA', price: 268.4, change24hPct: -1.2, change24hAbs: -3.27 },
  { name: 'Amazon', ticker: 'AMZN', price: 198.6, change24hPct: -0.6, change24hAbs: -1.2 },
  { name: 'Microsoft', ticker: 'MSFT', price: 415.8, change24hPct: 1.1, change24hAbs: 4.53 },
  { name: 'Google', ticker: 'GOOGL', price: 172.4, change24hPct: 0.9, change24hAbs: 1.54 },
  { name: 'Meta', ticker: 'META', price: 505.2, change24hPct: 2.1, change24hAbs: 10.41 },
  { name: 'Solana', ticker: 'SOL', price: 142.6, change24hPct: -2.8, change24hAbs: -4.11 },
  { name: 'Cardano', ticker: 'ADA', price: 0.48, change24hPct: 4.2, change24hAbs: 0.019 },
  { name: 'Ripple', ticker: 'XRP', price: 0.61, change24hPct: -1.5, change24hAbs: -0.009 },
  { name: 'Binance Coin', ticker: 'BNB', price: 411.3, change24hPct: 0.5, change24hAbs: 2.05 },
  { name: 'Chainlink', ticker: 'LINK', price: 14.8, change24hPct: 3.7, change24hAbs: 0.53 },
  { name: 'Avalanche', ticker: 'AVAX', price: 36.2, change24hPct: -3.1, change24hAbs: -1.15 },
  { name: 'Netflix', ticker: 'NFLX', price: 628.4, change24hPct: 1.4, change24hAbs: 8.7 },
  { name: 'Spotify', ticker: 'SPOT', price: 304.6, change24hPct: 2.0, change24hAbs: 5.99 },
  { name: 'AMD', ticker: 'AMD', price: 152.3, change24hPct: -0.8, change24hAbs: -1.22 },
  { name: 'Intel', ticker: 'INTC', price: 19.7, change24hPct: -4.2, change24hAbs: -0.86 },
  { name: 'Shopify', ticker: 'SHOP', price: 67.4, change24hPct: 5.3, change24hAbs: 3.4 },
];

function formatPrice(price: number) {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 4 });
}

function formatChange(abs: number) {
  if (Math.abs(abs) >= 1000) return abs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (Math.abs(abs) >= 1) return abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return abs.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 4 });
}

function TickerAvatar({ ticker }: { ticker: string }) {
  const initials = ticker.slice(0, 3);
  return (
    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
      {initials}
    </div>
  );
}

function AssetRow({ asset, onSelect }: { asset: Asset; onSelect: (a: Asset) => void }) {
  const positive = asset.change24hPct >= 0;
  const changeColor = positive ? 'text-success' : 'text-destructive';

  return (
    <button
      className="w-full flex items-center gap-3 px-0 py-3 active:bg-accent/50 transition-colors text-left"
      onClick={() => onSelect(asset)}
    >
      <TickerAvatar ticker={asset.ticker} />
      <div className="flex-1 min-w-0">
        <BodyTextSmall className="font-semibold">{asset.ticker}</BodyTextSmall>
        <Caption className="text-muted-foreground truncate">{asset.name}</Caption>
      </div>
      <div className="text-right shrink-0">
        <BodyTextSmall className="font-semibold tabular-nums">${formatPrice(asset.price)}</BodyTextSmall>
        <Caption className={`tabular-nums ${changeColor}`}>
          {positive ? '+' : ''}{asset.change24hPct.toFixed(2)}%
          {' '}(${positive ? '+' : ''}{formatChange(asset.change24hAbs)})
        </Caption>
      </div>
    </button>
  );
}

export function TradeBrowser() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = ASSETS.filter(a => {
    const q = query.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.ticker.toLowerCase().includes(q);
  });

  const handleSelect = (asset: Asset) => {
    navigate('/trading/open', { state: { asset } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="-ml-2 flex items-center gap-1 px-2 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search assets"
          className="pl-9"
        />
      </div>

      {/* Asset list */}
      <div>
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <BodyText className="text-muted-foreground">No assets found for "{query}"</BodyText>
          </div>
        ) : (
          filtered.map((asset, i) => (
            <div key={asset.ticker}>
              <AssetRow asset={asset} onSelect={handleSelect} />
              {i < filtered.length - 1 && <Separator />}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
