import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChartLine, ChevronDown, ChevronLeft } from 'lucide-react';
import { useTrading } from '../../context/TradingContext';
import type { Position } from '../../context/TradingContext';
import type { Asset } from './TradeBrowser';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Heading3, BodyText, BodyTextSmall, Label, Caption } from '../../components/ui/typography';
import { cn } from '@/lib/utils';

const LEVERAGE_OPTIONS = [1, 2, 5, 10, 20, 50];
const CURRENCIES = ['USDC', 'USDT', 'ETH', 'BTC'];

function formatPrice(price: number) {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 4 });
}

function getLiquidationPrice(marketPrice: number) {
  return marketPrice * 0.95;
}

export function OpenPosition() {
  const navigate = useNavigate();
  const location = useLocation();
  const asset = location.state?.asset as Asset | undefined;
  const { addPosition } = useTrading();

  const [direction, setDirection] = useState<'Long' | 'Short'>('Long');
  const [deposit, setDeposit] = useState('1000');
  const [leverage, setLeverage] = useState(10);
  const [currency, setCurrency] = useState('USDC');
  const [tp, setTp] = useState('');
  const [sl, setSl] = useState('');
  const [showCurrencySheet, setShowCurrencySheet] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPriceChartDialog, setShowPriceChartDialog] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');

  const depositRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    depositRef.current?.focus();
  }, []);

  const entryPrice = asset?.price ?? 0;

  const effectiveEntryPrice = useMemo(() => {
    if (orderType === 'limit') {
      const n = parseFloat(limitPrice);
      if (Number.isFinite(n) && n > 0) return n;
    }
    return entryPrice;
  }, [orderType, limitPrice, entryPrice]);

  const liqPrice = useMemo(() => {
    if (!entryPrice) return 0;
    return getLiquidationPrice(entryPrice);
  }, [entryPrice]);

  const depositNum = parseFloat(deposit) || 0;

  const handleConfirm = () => {
    if (!asset || depositNum <= 0) return;
    const newPosition: Position = {
      id: `pos-${Date.now()}`,
      asset: asset.name,
      ticker: asset.ticker,
      direction,
      leverage,
      status: 'complete',
      pnl: 0,
      roe: 0,
      deposit: depositNum,
      liqPrice,
      tp: tp ? parseFloat(tp) : null,
      sl: sl ? parseFloat(sl) : null,
      entryPrice: effectiveEntryPrice,
      marketPrice: entryPrice,
      openedAt: new Date().toISOString(),
      size: depositNum * leverage,
      fundingTotal: 0,
      fundingRate8h: 0.01,
    };
    addPosition(newPosition);
    navigate('/trading');
  };

  if (!asset) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="-ml-2 flex items-center gap-1 px-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="py-12 text-center space-y-4">
          <BodyText className="text-muted-foreground">No asset selected.</BodyText>
          <Button variant="ghost" onClick={() => navigate('/trading/trade')}>
            Browse assets
          </Button>
        </div>
      </div>
    );
  }

  const isLong = direction === 'Long';

  const tpParsed = parseFloat(tp);
  const slParsed = parseFloat(sl);
  const limitParsed = parseFloat(limitPrice);
  const showTpInConfirm =
    advanced && tp.trim() !== '' && Number.isFinite(tpParsed);
  const showSlInConfirm =
    advanced && sl.trim() !== '' && Number.isFinite(slParsed);
  const showLimitPriceInConfirm =
    advanced &&
    orderType === 'limit' &&
    limitPrice.trim() !== '' &&
    Number.isFinite(limitParsed) &&
    limitParsed > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <header className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="-ml-2 flex items-center gap-1 px-2 text-muted-foreground hover:text-foreground shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </header>

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Heading3>{asset.name}</Heading3>
        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowPriceChartDialog(true)}
            className="inline-flex max-w-full items-center justify-end gap-2 rounded-md px-1.5 py-1 text-right transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`View ${asset.name} price chart`}
          >
            <ChartLine className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="text-body font-semibold tabular-nums">
              ${formatPrice(asset.price)}
            </span>
          </button>
        </div>
      </div>

      {/* Long / Short segmented control */}
      <div className="flex p-1 bg-muted rounded-lg">
        <button
          type="button"
          onClick={() => setDirection('Long')}
          className={cn(
            'flex items-center justify-center w-1/2 py-2 rounded-md transition-colors text-sm font-semibold',
            isLong ? 'bg-background shadow-sm' : 'text-muted-foreground'
          )}
        >
          Long
        </button>
        <button
          type="button"
          onClick={() => setDirection('Short')}
          className={cn(
            'flex items-center justify-center w-1/2 py-2 rounded-md transition-colors text-sm font-semibold',
            !isLong ? 'bg-background shadow-sm' : 'text-muted-foreground'
          )}
        >
          Short
        </button>
      </div>

      {/* Deposit input */}
      <div className="space-y-2">
        <Label>Your deposit</Label>
        <div className="flex gap-2 items-center">
          <div className="relative flex-1 min-w-0">
            <div className="relative h-auto min-h-[44px] bg-background border border-input rounded-md flex items-center gap-1 px-4 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent/50 transition-colors">
              <input
                ref={depositRef}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                value={deposit}
                onChange={e => {
                  const v = e.target.value.replace(/[^0-9.]/g, '');
                  if (v === '') {
                    setDeposit('');
                    return;
                  }
                  setDeposit(v);
                }}
                placeholder="0"
                className="flex-1 w-full min-w-0 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground placeholder:opacity-40 text-foreground tabular-nums"
              />
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-2 rounded-md border border-border bg-card hover:bg-accent/50 transition-colors text-sm font-medium shrink-0 min-h-[44px]"
            onClick={() => setShowCurrencySheet(true)}
          >
            {currency}
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Leverage chips */}
      <div className="space-y-2">
        <Label>Leverage</Label>
        <div className="flex gap-2 flex-wrap">
          {LEVERAGE_OPTIONS.map(lev => (
            <button
              key={lev}
              onClick={() => setLeverage(lev)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                leverage === lev
                  ? 'bg-primary text-primary-foreground border-primary font-semibold'
                  : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30'
              }`}
            >
              {lev}×
            </button>
          ))}
        </div>
      </div>

      {/* Liquidation price */}
      <div className="space-y-2">
        <Caption className="text-sm font-medium text-foreground">
          Position is liquidated if price {isLong ? 'drops' : 'rises'} to
        </Caption>
        <BodyText className="font-semibold tabular-nums text-xl text-foreground">
          ${formatPrice(liqPrice)}
        </BodyText>
      </div>

      <div className="!mt-6 mb-[24px] flex flex-col gap-6 border-t border-t-[rgba(255,255,255,0.04)]">
        <div className="mt-6 flex flex-row items-center justify-start gap-4">
          <label
            htmlFor="open-pos-advanced"
            className="text-label text-sm font-medium text-foreground"
          >
            Show advanced settings
          </label>
          <button
            id="open-pos-advanced"
            type="button"
            role="switch"
            aria-checked={advanced}
            onClick={() => setAdvanced(v => !v)}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              advanced ? 'bg-primary' : 'bg-muted'
            )}
          >
            <span
              className={cn(
                'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-md ring-0 transition-transform duration-200 ease-in-out',
                advanced ? 'translate-x-5' : 'translate-x-0.5'
              )}
            />
          </button>
        </div>

        {advanced && (
          <>
            <div
              className="flex flex-col gap-4"
              role="radiogroup"
              aria-label="Order type"
            >
              <label className="flex cursor-pointer items-center gap-2">
                <div className="relative">
                  <input
                    type="radio"
                    name="open-pos-order-type"
                    className="w-4 h-4 opacity-0 absolute cursor-pointer"
                    checked={orderType === 'market'}
                    onChange={() => setOrderType('market')}
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 border-muted-foreground flex items-center justify-center cursor-pointer',
                      orderType === 'market' ? 'bg-transparent' : 'bg-white/5'
                    )}
                  >
                    {orderType === 'market' && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-foreground">Market order</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <div className="relative">
                  <input
                    type="radio"
                    name="open-pos-order-type"
                    className="w-4 h-4 opacity-0 absolute cursor-pointer"
                    checked={orderType === 'limit'}
                    onChange={() => {
                      setOrderType('limit');
                      if (entryPrice) setLimitPrice(String(entryPrice));
                    }}
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 border-muted-foreground flex items-center justify-center cursor-pointer',
                      orderType === 'limit' ? 'bg-transparent' : 'bg-white/5'
                    )}
                  >
                    {orderType === 'limit' && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-foreground">Limit order</span>
              </label>
            </div>

            {orderType === 'limit' && (
              <div className="space-y-1.5">
                <label htmlFor="open-pos-limit-price" className="text-label text-sm font-medium text-foreground">
                  Open position at price
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 select-none text-sm tabular-nums text-muted-foreground"
                    aria-hidden
                  >
                    $
                  </span>
                  <Input
                    id="open-pos-limit-price"
                    type="number"
                    inputMode="decimal"
                    value={limitPrice}
                    onChange={e => setLimitPrice(e.target.value)}
                    className="h-9 pl-8 text-sm tabular-nums"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Caption className="text-muted-foreground">Take profit</Caption>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={tp}
                  onChange={e => setTp(e.target.value)}
                  placeholder="—"
                  className="h-9 w-28 shrink-0 text-sm font-medium tabular-nums text-right"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Caption className="text-muted-foreground">Stop loss</Caption>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={sl}
                  onChange={e => setSl(e.target.value)}
                  placeholder="—"
                  className="h-9 w-28 shrink-0 text-sm font-medium tabular-nums text-right"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Open position button */}
      <div className="pt-1">
        <Button
          className="w-full"
          size="lg"
          disabled={depositNum <= 0}
          onClick={() => setShowConfirmDialog(true)}
        >
          Review & confirm
        </Button>
      </div>

      {/* Currency selector bottom sheet */}
      <Dialog open={showCurrencySheet} onOpenChange={setShowCurrencySheet}>
        <DialogContent className="pt-6 px-6 pb-10 md:p-6 md:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Select currency</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 py-2">
            {CURRENCIES.map((c, i) => (
              <div key={c}>
                <button
                  className={`w-full flex items-center justify-between px-2 py-3 rounded-lg transition-colors hover:bg-accent/50 ${
                    c === currency ? 'text-primary font-semibold' : 'text-foreground'
                  }`}
                  onClick={() => {
                    setCurrency(c);
                    setShowCurrencySheet(false);
                  }}
                >
                  <BodyText>{c}</BodyText>
                  {c === currency && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
                {i < CURRENCIES.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Price chart (placeholder) */}
      <Dialog open={showPriceChartDialog} onOpenChange={setShowPriceChartDialog}>
        <DialogContent className="md:w-auto md:max-w-fit md:max-h-[85vh] max-h-[90vh] overflow-y-auto md:p-6 p-4">
          <DialogHeader>
            <DialogTitle>{asset.name} price</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <svg
                className="h-48 w-full min-w-[280px] text-primary"
                viewBox="0 0 400 180"
                preserveAspectRatio="none"
                aria-hidden
              >
                {[0, 1, 2, 3, 4].map(i => (
                  <line
                    key={i}
                    x1="0"
                    y1={36 + i * 36}
                    x2="400"
                    y2={36 + i * 36}
                    className="stroke-border"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <defs>
                  <linearGradient id="open-pos-chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#open-pos-chart-fill)"
                  d="M0,120 L40,110 L80,115 L120,95 L160,100 L200,75 L240,82 L280,58 L320,62 L360,48 L400,52 L400,180 L0,180 Z"
                />
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points="0,120 40,110 80,115 120,95 160,100 200,75 240,82 280,58 320,62 360,48 400,52"
                />
              </svg>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setShowPriceChartDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm open dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent
          hideCloseButton={false}
          className="pt-6 px-6 pb-10 md:p-6 md:max-w-md mx-auto"
        >
          <DialogHeader>
            <DialogTitle>
              Open {direction} on {asset.name}?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Direction</Caption>
              <BodyTextSmall className="font-medium tabular-nums">
                {direction} {leverage}×
              </BodyTextSmall>
            </div>
            {advanced && (
              <div className="flex items-center justify-between">
                <Caption className="text-muted-foreground">Order</Caption>
                <BodyTextSmall className="font-medium tabular-nums">
                  {orderType === 'market' ? 'Market' : 'Limit'}
                </BodyTextSmall>
              </div>
            )}
            {showTpInConfirm && (
              <div className="flex items-center justify-between">
                <Caption className="text-muted-foreground">Take profit</Caption>
                <BodyTextSmall className="font-medium tabular-nums">
                  ${formatPrice(tpParsed)}
                </BodyTextSmall>
              </div>
            )}
            {showSlInConfirm && (
              <div className="flex items-center justify-between">
                <Caption className="text-muted-foreground">Stop loss</Caption>
                <BodyTextSmall className="font-medium tabular-nums">
                  ${formatPrice(slParsed)}
                </BodyTextSmall>
              </div>
            )}
            {showLimitPriceInConfirm && (
              <div className="flex items-center justify-between">
                <Caption className="text-muted-foreground">Open position at price</Caption>
                <BodyTextSmall className="font-medium tabular-nums">
                  ${formatPrice(limitParsed)}
                </BodyTextSmall>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Deposit at risk</Caption>
              <BodyTextSmall className="font-medium tabular-nums">
                ${depositNum.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}{' '}
                {currency}
              </BodyTextSmall>
            </div>
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Fee</Caption>
              <BodyTextSmall className="font-medium tabular-nums">$1.00</BodyTextSmall>
            </div>
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Liquidation price</Caption>
              <BodyTextSmall className="font-medium tabular-nums">
                ${formatPrice(liqPrice)}
              </BodyTextSmall>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button className="w-full sm:w-auto" onClick={handleConfirm}>
              Open Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
