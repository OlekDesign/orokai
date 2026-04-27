import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChartLine, ChevronDown, ChevronLeft, Plus, Trash2 } from 'lucide-react';
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
const CURRENCY_PRICES: Record<string, number> = {
  USDC: 1,
  USDT: 1,
  ETH: 3512,
  BTC: 67240,
};
const MAX_DEPOSIT_ROWS = 5;

type DepositRow = {
  amount: string;
  currency: string;
};

function formatPrice(price: number) {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 4 });
}

function getLiquidationPrice(marketPrice: number) {
  return marketPrice * 0.95;
}

export function BorrowOpenPosition() {
  const navigate = useNavigate();
  const location = useLocation();
  const asset = location.state?.asset as Asset | undefined;
  const { addPosition } = useBorrowing();

  const [depositRows, setDepositRows] = useState<DepositRow[]>([{ amount: '1000', currency: 'USDC' }]);
  const [activeCurrencyRow, setActiveCurrencyRow] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPriceChartDialog, setShowPriceChartDialog] = useState(false);

  const depositRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    depositRef.current?.focus();
  }, []);

  const entryPrice = asset?.price ?? 0;

  const liqPrice = useMemo(() => {
    if (!entryPrice) return 0;
    return getLiquidationPrice(entryPrice);
  }, [entryPrice]);

  const totalDepositValue = useMemo(
    () =>
      depositRows.reduce((sum, row) => {
        const amount = parseFloat(row.amount) || 0;
        const currencyPrice = CURRENCY_PRICES[row.currency] ?? 0;
        return sum + amount * currencyPrice;
      }, 0),
    [depositRows]
  );

  const populatedDepositRows = useMemo(
    () => depositRows.filter(row => (parseFloat(row.amount) || 0) > 0),
    [depositRows]
  );

  const borrowAmount = useMemo(() => {
    if (!entryPrice || totalDepositValue <= 0) return 0;
    return totalDepositValue / entryPrice;
  }, [entryPrice, totalDepositValue]);

  const updateDepositRow = (index: number, updates: Partial<DepositRow>) => {
    setDepositRows(currentRows =>
      currentRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...updates } : row
      )
    );
  };

  const addDepositRow = () => {
    setDepositRows(currentRows => {
      if (currentRows.length >= MAX_DEPOSIT_ROWS) return currentRows;
      return [...currentRows, { amount: '', currency: 'USDC' }];
    });
  };

  const removeDepositRow = (index: number) => {
    if (index === 0) return;
    setDepositRows(currentRows => currentRows.filter((_, rowIndex) => rowIndex !== index));
    setActiveCurrencyRow(currentActive => {
      if (currentActive === null) return null;
      if (currentActive === index) return null;
      if (currentActive > index) return currentActive - 1;
      return currentActive;
    });
  };

  const handleConfirm = () => {
    if (!asset || totalDepositValue <= 0) return;

    const newPosition: BorrowingPosition = {
      id: `borrow-pos-${Date.now()}`,
      asset: asset.name,
      ticker: asset.ticker,
      collateralAsset:
        populatedDepositRows.length === 1 ? populatedDepositRows[0].currency : 'USDT',
      collateralAmount:
        populatedDepositRows.length === 1
          ? parseFloat(populatedDepositRows[0].amount) || 0
          : totalDepositValue,
      direction: 'Long',
      leverage: 1,
      status: 'complete',
      pnl: 0,
      roe: 0,
      deposit: totalDepositValue,
      liqPrice,
      tp: null,
      sl: null,
      entryPrice,
      marketPrice: entryPrice,
      openedAt: new Date().toISOString(),
      size: totalDepositValue,
      fundingTotal: 0,
      fundingRate8h: 0.01,
    };

    addPosition(newPosition);
    navigate('/borrowing');
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
          <Button variant="ghost" onClick={() => navigate('/borrowing/trade')}>
            Browse assets
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

      <div className="space-y-2">
        <Label>Your deposit</Label>
        <div className="space-y-2">
          {depositRows.map((row, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="relative flex-1 min-w-0">
                <div className="relative h-auto min-h-[44px] bg-background border border-input rounded-md flex items-center gap-1 px-4 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent/50 transition-colors">
                  <input
                    ref={index === 0 ? depositRef : undefined}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    value={row.amount}
                    onChange={event => {
                      const sanitizedValue = event.target.value.replace(/[^0-9.]/g, '');
                      updateDepositRow(index, { amount: sanitizedValue });
                    }}
                    placeholder="0"
                    className="flex-1 w-full min-w-0 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground placeholder:opacity-40 text-foreground tabular-nums"
                  />
                </div>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 rounded-md border border-border bg-card hover:bg-accent/50 transition-colors text-sm font-medium shrink-0 min-h-[44px]"
                onClick={() => setActiveCurrencyRow(index)}
              >
                {row.currency}
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
              {index > 0 && (
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground shrink-0"
                  onClick={() => removeDepositRow(index)}
                  aria-label={`Remove deposit row ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addDepositRow}
          disabled={depositRows.length >= MAX_DEPOSIT_ROWS}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Deposit another token
        </button>
      </div>

      <div className="space-y-2">
        <Label>Borrow</Label>
        <div className="rounded-md border border-border bg-card px-4 py-3">
          <BodyText className="font-semibold tabular-nums text-foreground">
            {borrowAmount.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 6,
            })}{' '}
            {asset.ticker}
          </BodyText>
        </div>
      </div>

      <div className="space-y-2">
        <Caption className="text-sm font-medium text-foreground">Liquidation price</Caption>
        <BodyText className="font-semibold tabular-nums text-xl text-foreground">
          ${formatPrice(liqPrice)}
        </BodyText>
      </div>

      <div className="pt-1">
        <Button
          className="w-full"
          size="lg"
          disabled={totalDepositValue <= 0}
          onClick={() => setShowConfirmDialog(true)}
        >
          Review & confirm
        </Button>
      </div>

      <Dialog open={activeCurrencyRow !== null} onOpenChange={open => !open && setActiveCurrencyRow(null)}>
        <DialogContent className="pt-6 px-6 pb-10 md:p-6 md:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Select currency</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 py-2">
            {CURRENCIES.map((selectedCurrency, index) => (
              <div key={selectedCurrency}>
                <button
                  className={`w-full flex items-center justify-between px-2 py-3 rounded-lg transition-colors hover:bg-accent/50 ${
                    activeCurrencyRow !== null && selectedCurrency === depositRows[activeCurrencyRow]?.currency
                      ? 'text-primary font-semibold'
                      : 'text-foreground'
                  }`}
                  onClick={() => {
                    if (activeCurrencyRow !== null) {
                      updateDepositRow(activeCurrencyRow, { currency: selectedCurrency });
                    }
                    setActiveCurrencyRow(null);
                  }}
                >
                  <BodyText>{selectedCurrency}</BodyText>
                  {activeCurrencyRow !== null && selectedCurrency === depositRows[activeCurrencyRow]?.currency && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
                {index < CURRENCIES.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
                  <linearGradient id="borrow-open-pos-chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#borrow-open-pos-chart-fill)"
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
          <DialogHeader>
            <DialogTitle>
              Open borrow on {asset.name}?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Asset</Caption>
              <BodyTextSmall className="font-medium tabular-nums">
                {asset.name}
              </BodyTextSmall>
            </div>
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Total deposit value</Caption>
              <BodyTextSmall className="font-medium tabular-nums">
                ${totalDepositValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </BodyTextSmall>
            </div>
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Borrow</Caption>
              <BodyTextSmall className="font-medium tabular-nums">
                {borrowAmount.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 6,
                })}{' '}
                {asset.ticker}
              </BodyTextSmall>
            </div>
            {populatedDepositRows.map((row, index) => (
              <div key={`${row.currency}-${index}`} className="flex items-center justify-between">
                <Caption className="text-muted-foreground">Deposit {index + 1}</Caption>
                <BodyTextSmall className="font-medium tabular-nums">
                  {(parseFloat(row.amount) || 0).toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 6,
                  })}{' '}
                  {row.currency}
                </BodyTextSmall>
              </div>
            ))}
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
