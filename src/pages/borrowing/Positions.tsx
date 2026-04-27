import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBorrowing } from '../../context/BorrowingContext';
import type { BorrowingPosition } from '../../context/BorrowingContext';
import type { Asset } from './TradeBrowser';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Separator } from '../../components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { BodyText, BodyTextSmall, Caption, Heading1, Label } from '../../components/ui/typography';

const REPAYMENT_CURRENCIES = ['USDC', 'USDT', 'ETH', 'BTC'];
const CURRENCY_PRICES: Record<string, number> = {
  USDC: 1,
  USDT: 1,
  ETH: 3512,
  BTC: 67240,
};
const MAX_REPAYMENT_ROWS = 5;

type RepaymentCurrencyRow = {
  currency: string;
};

function formatCurrency(value: number, decimals = 2) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatBorrowedTokenAmount(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: value >= 1 ? 4 : 6,
  });
}

function formatAssetAmount(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: value >= 1 ? 2 : 6,
  });
}

function createRepaymentRows(count: number, defaultCurrency: string): RepaymentCurrencyRow[] {
  return Array.from({ length: count }, () => ({ currency: defaultCurrency }));
}

function getPriceChangePct(position: BorrowingPosition) {
  if (!position.entryPrice) return 0;
  return ((position.marketPrice - position.entryPrice) / position.entryPrice) * 100;
}

function getLiquidationRisk(position: BorrowingPosition) {
  const priceChangePct = getPriceChangePct(position);

  if (priceChangePct >= 0) {
    return { drawdownPct: 0, progressPct: 0, indicatorColor: 'rgb(234 179 8)' };
  }

  const drawdownPct = Math.abs(priceChangePct);
  const progressPct = Math.min(100, (drawdownPct / 10) * 100);
  const colorBlend = Math.min(1, Math.max(0, (drawdownPct - 1) / 9));
  const start = { r: 234, g: 179, b: 8 };
  const end = { r: 248, g: 113, b: 113 };

  return {
    drawdownPct,
    progressPct,
    indicatorColor: `rgb(${
      Math.round(start.r + (end.r - start.r) * colorBlend)
    } ${
      Math.round(start.g + (end.g - start.g) * colorBlend)
    } ${
      Math.round(start.b + (end.b - start.b) * colorBlend)
    })`,
  };
}

function TickerAvatar({ ticker }: { ticker: string }) {
  const initials = ticker.slice(0, 3);
  return (
    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
      {initials}
    </div>
  );
}

const dashboardStatusPillBase =
  'inline-block px-2 py-1 rounded-full capitalize w-fit text-xs font-light leading-none';

function AtRiskBadge() {
  return (
    <span className={cn(dashboardStatusPillBase, 'shrink-0 text-white bg-warning/10')}>At risk</span>
  );
}

function PendingBadge() {
  return (
    <span className={cn(dashboardStatusPillBase, 'shrink-0 text-white bg-warning/10')}>Pending</span>
  );
}

function PositionCard({
  position,
  onClose,
}: {
  position: BorrowingPosition;
  onClose: (id: string) => void;
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [repaymentType, setRepaymentType] = useState<'full' | 'partial'>('full');
  const defaultRepaymentCurrency = position.collateralAsset || 'USDT';
  const [repaymentRows, setRepaymentRows] = useState<RepaymentCurrencyRow[]>(
    createRepaymentRows(1, defaultRepaymentCurrency)
  );
  const [activeRepaymentCurrencyRow, setActiveRepaymentCurrencyRow] = useState<number | null>(null);

  const assetForOpen: Asset = {
    name: position.asset,
    ticker: position.ticker,
    price: position.marketPrice,
    change24hPct: 0,
    change24hAbs: 0,
  };

  const borrowedValueUsd = position.size ?? position.deposit * position.leverage;
  const borrowedTokenAmount = borrowedValueUsd / position.entryPrice;
  const repaymentFeeUsd = 1;
  const repaymentRatio = repaymentType === 'full' ? 1 : 0.5;
  const repaymentValueUsd = position.deposit * repaymentRatio;
  const allocationPct = 100 / repaymentRows.length;
  const repaymentBreakdown = repaymentRows.map(row => {
    const allocationRatio = allocationPct / 100;
    const valueUsd = repaymentValueUsd * allocationRatio;
    const currencyPrice = CURRENCY_PRICES[row.currency] ?? 1;

    return {
      ...row,
      allocationPct,
      valueUsd,
      amount: valueUsd / currencyPrice,
    };
  });
  const repaidTokenAmount =
    borrowedTokenAmount * repaymentRatio;
  const priceChangePct = getPriceChangePct(position);
  const liquidationRisk = getLiquidationRisk(position);
  const showPreventLiquidation = liquidationRisk.progressPct > 30;

  const addRepaymentRow = () => {
    setRepaymentRows(currentRows => {
      if (currentRows.length >= MAX_REPAYMENT_ROWS) return currentRows;
      return [...currentRows, { currency: defaultRepaymentCurrency }];
    });
  };

  const removeRepaymentRow = (index: number) => {
    setRepaymentRows(currentRows => {
      if (currentRows.length === 1) return currentRows;
      return currentRows.filter((_, rowIndex) => rowIndex !== index);
    });
    setActiveRepaymentCurrencyRow(currentActive => {
      if (currentActive === null) return null;
      if (currentActive === index) return null;
      if (currentActive > index) return currentActive - 1;
      return currentActive;
    });
  };

  const updateRepaymentRow = (index: number, currency: string) => {
    setRepaymentRows(currentRows =>
      currentRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, currency: currency || defaultRepaymentCurrency } : row
      )
    );
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div
          role="button"
          tabIndex={0}
          className={cn(
            'w-full text-left px-4 py-3.5 flex items-center gap-3 cursor-pointer active:bg-accent/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            position.status === 'complete' && priceChangePct < 0 && 'bg-[rgba(51,43,22,0.35)]'
          )}
          onClick={() => setExpanded(value => !value)}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setExpanded(value => !value);
            }
          }}
        >
          <TickerAvatar ticker={position.ticker} />
          <div className="flex-1 min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <BodyText as="span" className="font-bold">
                {position.asset}
              </BodyText>
              {position.status === 'complete' && priceChangePct < 0 ? <AtRiskBadge /> : null}
            </div>
          </div>
          <div className="text-right shrink-0 space-y-0.5">
            <BodyText className="font-bold tabular-nums">
              {formatBorrowedTokenAmount(borrowedTokenAmount)} {position.ticker}
            </BodyText>
            <Caption as="div" className="tabular-nums text-muted-foreground">
              ${formatCurrency(borrowedValueUsd)}
            </Caption>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <Separator />
              <CardContent className="p-4 space-y-3 pt-6 sm:pt-6">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between gap-2">
                    <Caption className="text-muted-foreground">Borrow price</Caption>
                    <div className="flex min-w-0 items-center gap-2">
                      {position.status === 'pending' ? <PendingBadge /> : null}
                      <BodyTextSmall className="font-medium tabular-nums">
                        ${formatCurrency(position.entryPrice)}
                      </BodyTextSmall>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Caption className="text-muted-foreground">Market price</Caption>
                    <BodyTextSmall className="font-medium tabular-nums">
                      ${formatCurrency(position.marketPrice)}
                    </BodyTextSmall>
                  </div>
                  <div className="flex items-center justify-between">
                    <Caption className="text-muted-foreground">Liquidation</Caption>
                    <BodyTextSmall className="font-medium tabular-nums">
                      ${formatCurrency(position.liqPrice)}
                    </BodyTextSmall>
                  </div>
                  <div className="pt-2">
                    <div className="flex flex-col gap-4">
                      <Progress
                        value={liquidationRisk.progressPct}
                        className="h-2 bg-[rgba(255,255,255,0.08)]"
                        indicatorClassName="transition-all duration-200"
                        indicatorStyle={{ background: liquidationRisk.indicatorColor }}
                        aria-label="Liquidation risk"
                      />
                      {showPreventLiquidation ? (
                        <Button
                          className="w-full"
                          onClick={() =>
                            navigate('/borrowing/prevent-liquidation', {
                              state: { position, asset: assetForOpen },
                            })
                          }
                        >
                          Prevent liquidation
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Caption className="text-muted-foreground">Opened</Caption>
                    <BodyTextSmall className="font-medium tabular-nums">
                      {new Date(position.openedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </BodyTextSmall>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch w-full">
                  <Button
                    className="flex-1"
                    onClick={() => navigate('/borrowing/open', { state: { asset: assetForOpen } })}
                  >
                    New Position
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                      onClick={() => {
                      setRepaymentType('full');
                      setRepaymentRows(createRepaymentRows(1, defaultRepaymentCurrency));
                      setActiveRepaymentCurrencyRow(null);
                      setShowCloseDialog(true);
                    }}
                  >
                    Repayment
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent
          hideCloseButton={false}
          className="pt-6 px-6 pb-10 md:p-6 md:max-w-md mx-auto"
        >
          <DialogHeader>
            <DialogTitle>Repay {position.ticker}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="flex flex-col gap-4" role="radiogroup" aria-label="Repayment type">
              <label className="flex cursor-pointer items-center gap-2">
                <div className="relative">
                  <input
                    type="radio"
                    name={`repayment-type-${position.id}`}
                    className="absolute h-4 w-4 cursor-pointer opacity-0"
                    checked={repaymentType === 'full'}
                    onChange={() => setRepaymentType('full')}
                  />
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full border-2 border-muted-foreground cursor-pointer',
                      repaymentType === 'full' ? 'bg-transparent' : 'bg-white/5'
                    )}
                  >
                    {repaymentType === 'full' ? <div className="h-2 w-2 rounded-full bg-primary" /> : null}
                  </div>
                </div>
                <BodyTextSmall className="font-medium">Full repayment</BodyTextSmall>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <div className="relative">
                  <input
                    type="radio"
                    name={`repayment-type-${position.id}`}
                    className="absolute h-4 w-4 cursor-pointer opacity-0"
                    checked={repaymentType === 'partial'}
                    onChange={() => setRepaymentType('partial')}
                  />
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full border-2 border-muted-foreground cursor-pointer',
                      repaymentType === 'partial' ? 'bg-transparent' : 'bg-white/5'
                    )}
                  >
                    {repaymentType === 'partial' ? <div className="h-2 w-2 rounded-full bg-primary" /> : null}
                  </div>
                </div>
                <BodyTextSmall className="font-medium">Partial repayment</BodyTextSmall>
              </label>
            </div>

            <div className="space-y-2">
              <Label>Repayment currency</Label>
              <div className="space-y-2">
                {repaymentRows.map((row, index) => (
                  <div key={`${row.currency}-${index}`} className="flex items-center gap-2">
                    {repaymentRows.length > 1 && index > 0 ? (
                      <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground shrink-0"
                        onClick={() => removeRepaymentRow(index)}
                        aria-label={`Remove repayment currency ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="flex min-h-[44px] flex-1 items-center justify-between rounded-md border border-border bg-card px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-accent/50"
                      onClick={() => setActiveRepaymentCurrencyRow(index)}
                    >
                      <span>{row.currency || defaultRepaymentCurrency}</span>
                      <ChevronDown size={14} className="text-muted-foreground" />
                    </button>
                    {repaymentRows.length > 1 ? (
                      <div className="flex min-h-[44px] w-24 shrink-0 items-center justify-center rounded-md border border-border bg-card px-3 py-2 text-sm font-medium tabular-nums">
                        {Math.round(allocationPct)}%
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={addRepaymentRow}
                  disabled={repaymentRows.length >= MAX_REPAYMENT_ROWS}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Add currency
                </button>
                {repaymentRows.length > 1 ? (
                  <Caption className="tabular-nums text-muted-foreground">100%</Caption>
                ) : null}
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <Caption className="text-muted-foreground">You pay</Caption>
              <div className="flex max-w-[65%] flex-col items-end gap-1.5 text-right">
                {repaymentBreakdown.map((row, index) => (
                  <BodyTextSmall
                    key={`${row.currency}-${index}`}
                    className="font-medium tabular-nums"
                  >
                    {formatAssetAmount(row.amount)} {row.currency || defaultRepaymentCurrency}
                  </BodyTextSmall>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Debt repaid</Caption>
              <BodyTextSmall className="font-medium tabular-nums">
                {formatBorrowedTokenAmount(repaidTokenAmount)} {position.ticker}
              </BodyTextSmall>
            </div>
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Fee</Caption>
              <BodyTextSmall className="font-medium tabular-nums">
                ${formatCurrency(repaymentFeeUsd)}
              </BodyTextSmall>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowCloseDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (repaymentType === 'full') {
                  onClose(position.id);
                }
                setShowCloseDialog(false);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeRepaymentCurrencyRow !== null}
        onOpenChange={open => !open && setActiveRepaymentCurrencyRow(null)}
      >
        <DialogContent className="pt-6 px-6 pb-10 md:p-6 md:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Select currency</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 py-2">
            {REPAYMENT_CURRENCIES.map((selectedCurrency, index) => (
              <div key={selectedCurrency}>
                <button
                  className={cn(
                    'w-full flex items-center justify-between px-2 py-3 rounded-lg transition-colors hover:bg-accent/50',
                    activeRepaymentCurrencyRow !== null &&
                      selectedCurrency === repaymentRows[activeRepaymentCurrencyRow]?.currency
                      ? 'text-primary font-semibold'
                      : 'text-foreground'
                  )}
                  onClick={() => {
                    if (activeRepaymentCurrencyRow !== null) {
                      updateRepaymentRow(activeRepaymentCurrencyRow, selectedCurrency);
                    }
                    setActiveRepaymentCurrencyRow(null);
                  }}
                >
                  <BodyText>{selectedCurrency}</BodyText>
                  {activeRepaymentCurrencyRow !== null &&
                  selectedCurrency === repaymentRows[activeRepaymentCurrencyRow]?.currency ? (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  ) : null}
                </button>
                {index < REPAYMENT_CURRENCIES.length - 1 ? <Separator /> : null}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function BorrowPositions() {
  const navigate = useNavigate();
  const { positions, removePosition } = useBorrowing();
  const totalSupply = positions.reduce((sum, position) => sum + position.deposit, 0);
  const totalBorrow = positions.reduce(
    (sum, position) => sum + (position.size ?? position.deposit * position.leverage),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-border">
            <CardHeader className="flex-shrink-0">
              <CardDescription>Your total supply</CardDescription>
              <Heading1 className="mt-1 tabular-nums">${formatCurrency(totalSupply)}</Heading1>
            </CardHeader>
          </Card>

          <Card className="border border-border">
            <CardHeader className="flex-shrink-0">
              <CardDescription>Your total borrow</CardDescription>
              <Heading1 className="mt-1 tabular-nums">${formatCurrency(totalBorrow)}</Heading1>
            </CardHeader>
          </Card>
        </div>

        <Button className="w-full" size="lg" onClick={() => navigate('/borrowing/trade')}>
          Borrow
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-overline text-muted-foreground">Open positions</Label>

        {positions.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <BodyText className="text-muted-foreground">No open positions</BodyText>
              <Button
                variant="ghost"
                className="mt-3 text-primary"
                onClick={() => navigate('/borrowing/trade')}
              >
                Open your first borrowing position
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {positions.map(position => (
              <PositionCard key={position.id} position={position} onClose={removePosition} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
