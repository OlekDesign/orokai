import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChartLine, ChevronDown, ChevronLeft } from 'lucide-react';
import { useBorrowing } from '../../context/BorrowingContext';
import type { BorrowingPosition } from '../../context/BorrowingContext';
import type { Asset } from './TradeBrowser';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { BodyText, BodyTextSmall, Caption, Heading3, Label } from '../../components/ui/typography';

const CURRENCIES = ['USDC', 'USDT', 'ETH', 'BTC'];

function formatPrice(price: number) {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 4 });
}

function getProjectedLiquidationPrice(position: BorrowingPosition, addedMargin: number) {
  if (addedMargin <= 0) return position.liqPrice;
  return position.liqPrice * 1.1;
}

type BorrowPreventLiquidationLocationState = {
  asset?: Asset;
  position?: BorrowingPosition;
};

export function BorrowPreventLiquidation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updatePosition } = useBorrowing();
  const { asset, position } = (location.state as BorrowPreventLiquidationLocationState | null) ?? {};

  const [deposit, setDeposit] = useState('1000');
  const [currency, setCurrency] = useState('USDC');
  const [showCurrencySheet, setShowCurrencySheet] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPriceChartDialog, setShowPriceChartDialog] = useState(false);

  const depositRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    depositRef.current?.focus();
  }, []);

  const displayAsset = asset ?? (position
    ? {
        name: position.asset,
        ticker: position.ticker,
        price: position.marketPrice,
        change24hPct: 0,
        change24hAbs: 0,
      }
    : undefined);

  const depositNum = parseFloat(deposit) || 0;
  const currentLiqPrice = position?.liqPrice ?? 0;
  const projectedLiqPrice = useMemo(() => {
    if (!position) return currentLiqPrice;
    return getProjectedLiquidationPrice(position, depositNum);
  }, [currentLiqPrice, depositNum, position]);

  const handleConfirm = () => {
    if (!position || depositNum <= 0) return;

    updatePosition(position.id, {
      deposit: position.deposit + depositNum,
      liqPrice: projectedLiqPrice,
    });
    navigate('/borrowing');
  };

  if (!displayAsset || !position) {
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
          <BodyText className="text-muted-foreground">No position selected.</BodyText>
          <Button variant="ghost" onClick={() => navigate('/borrowing')}>
            Back to positions
          </Button>
        </div>
      </div>
    );
  }

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

      <div className="flex items-center justify-between">
        <Heading3>{displayAsset.name}</Heading3>
        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowPriceChartDialog(true)}
            className="inline-flex max-w-full items-center justify-end gap-2 rounded-md px-1.5 py-1 text-right transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`View ${displayAsset.name} price chart`}
          >
            <ChartLine className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="text-body font-semibold tabular-nums">
              ${formatPrice(displayAsset.price)}
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Add collateral</Label>
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
                onChange={event => {
                  const sanitizedValue = event.target.value.replace(/[^0-9.]/g, '');
                  if (sanitizedValue === '') {
                    setDeposit('');
                    return;
                  }

                  setDeposit(sanitizedValue);
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

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Caption className="text-muted-foreground">Current collateral</Caption>
          <BodyTextSmall className="font-medium tabular-nums">
            ${formatPrice(position.deposit)}
          </BodyTextSmall>
        </div>
        <div className="flex items-center justify-between">
          <Caption className="text-muted-foreground">Current liquidation price</Caption>
          <BodyTextSmall className="font-medium tabular-nums">
            ${formatPrice(currentLiqPrice)}
          </BodyTextSmall>
        </div>
      </div>

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

      <Dialog open={showCurrencySheet} onOpenChange={setShowCurrencySheet}>
        <DialogContent className="pt-6 px-6 pb-10 md:p-6 md:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Select currency</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 py-2">
            {CURRENCIES.map((selectedCurrency, index) => (
              <div key={selectedCurrency}>
                <button
                  className={`w-full flex items-center justify-between px-2 py-3 rounded-lg transition-colors hover:bg-accent/50 ${
                    selectedCurrency === currency ? 'text-primary font-semibold' : 'text-foreground'
                  }`}
                  onClick={() => {
                    setCurrency(selectedCurrency);
                    setShowCurrencySheet(false);
                  }}
                >
                  <BodyText>{selectedCurrency}</BodyText>
                  {selectedCurrency === currency ? <span className="w-2 h-2 rounded-full bg-primary" /> : null}
                </button>
                {index < CURRENCIES.length - 1 ? <Separator /> : null}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPriceChartDialog} onOpenChange={setShowPriceChartDialog}>
        <DialogContent className="md:w-auto md:max-w-fit md:max-h-[85vh] max-h-[90vh] overflow-y-auto md:p-6 p-4">
          <DialogHeader>
            <DialogTitle>{displayAsset.name} price</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <svg
                className="h-48 w-full min-w-[280px] text-primary"
                viewBox="0 0 400 180"
                preserveAspectRatio="none"
                aria-hidden
              >
                {[0, 1, 2, 3, 4].map(index => (
                  <line
                    key={index}
                    x1="0"
                    y1={36 + index * 36}
                    x2="400"
                    y2={36 + index * 36}
                    className="stroke-border"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <defs>
                  <linearGradient id="borrow-prevent-liquidation-chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#borrow-prevent-liquidation-chart-fill)"
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

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent
          hideCloseButton={false}
          className="pt-6 px-6 pb-10 md:p-6 md:max-w-md mx-auto"
        >
          <DialogHeader className="text-left">
            <DialogTitle>Prevent liquidation?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Added collateral</Caption>
              <BodyTextSmall className="font-medium tabular-nums">
                ${depositNum.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} {currency}
              </BodyTextSmall>
            </div>
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Total collateral</Caption>
              <BodyTextSmall className="font-medium tabular-nums">
                ${formatPrice(position.deposit + depositNum)}
              </BodyTextSmall>
            </div>
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">New liquidation price</Caption>
              <BodyTextSmall className="font-medium tabular-nums">
                ${formatPrice(projectedLiqPrice)}
              </BodyTextSmall>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button className="w-full sm:w-auto" onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
