import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrading } from '../../context/TradingContext';
import type { Position } from '../../context/TradingContext';
import type { Asset } from './TradeBrowser';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Separator } from '../../components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Heading1, BodyText, BodyTextSmall, Label, Caption } from '../../components/ui/typography';

function formatCurrency(n: number, decimals = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function getPriceChangePct(position: Position) {
  if (!position.entryPrice) return 0;
  return ((position.marketPrice - position.entryPrice) / position.entryPrice) * 100;
}

function getLiquidationRisk(position: Position) {
  const priceChangePct = getPriceChangePct(position);

  if (priceChangePct >= 0) {
    return { drawdownPct: 0, progressPct: 0, indicatorColor: 'rgb(234 179 8)' };
  }

  const drawdownPct = Math.abs(priceChangePct);
  const progressPct = Math.min(100, (drawdownPct / 10) * 100);

  const colorBlend = Math.min(1, Math.max(0, (drawdownPct - 1) / 9));
  const start = { r: 234, g: 179, b: 8 };
  const end = { r: 248, g: 113, b: 113 };
  const r = Math.round(start.r + (end.r - start.r) * colorBlend);
  const g = Math.round(start.g + (end.g - start.g) * colorBlend);
  const b = Math.round(start.b + (end.b - start.b) * colorBlend);

  return {
    drawdownPct,
    progressPct,
    indicatorColor: `rgb(${r} ${g} ${b})`,
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

/** Matches status pills in `TransactionRow` (Dashboard / transactions table). */
const dashboardStatusPillBase =
  'inline-block px-2 py-1 rounded-full capitalize w-fit text-xs font-light leading-none';

function AtRiskBadge() {
  return (
    <span className={cn(dashboardStatusPillBase, 'shrink-0 text-white bg-warning/10')}>At risk</span>
  );
}

function PositionMetaLine({ position }: { position: Position }) {
  const dir = position.direction.toLowerCase();
  const lev = position.leverage;
  return (
    <Caption className="text-muted-foreground">
      {position.status === 'pending' ? (
        <>
          Pending <span className="text-muted-foreground/70">·</span> {lev}× {dir}
        </>
      ) : (
        <>
          {lev}× {dir}
        </>
      )}
    </Caption>
  );
}

function PendingBadge() {
  return (
    <span className={cn(dashboardStatusPillBase, 'shrink-0 text-white bg-warning/10')}>Pending</span>
  );
}

function PnlText({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn(
        'text-body-small font-medium tabular-nums',
        value >= 0 ? 'text-success' : 'text-destructive',
        className
      )}
    >
      {value >= 0 ? '+' : ''}${formatCurrency(Math.abs(value))}
    </span>
  );
}

function PositionCard({ position, onClose }: { position: Position; onClose: (id: string) => void }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const assetForOpen: Asset = {
    name: position.asset,
    ticker: position.ticker,
    price: position.marketPrice,
    change24hPct: 0,
    change24hAbs: 0,
  };

  const totalReceived = position.deposit + position.pnl;
  const positionValue = position.deposit * position.leverage;
  const priceChangePct = getPriceChangePct(position);
  const liquidationRisk = getLiquidationRisk(position);
  const showPreventLiquidation = liquidationRisk.progressPct > 30;

  return (
    <>
      <Card className="overflow-hidden">
        {/* Collapsed header — always visible */}
        <div
          role="button"
          tabIndex={0}
          className={cn(
            'w-full text-left px-4 py-3.5 flex items-center gap-3 cursor-pointer active:bg-accent/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            position.status === 'complete' && priceChangePct < 0 && 'bg-[rgba(51,43,22,0.35)]'
          )}
          onClick={() => setExpanded(v => !v)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setExpanded(v => !v);
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
            <PositionMetaLine position={position} />
          </div>
          <div className="text-right shrink-0 space-y-0.5">
            <BodyText className="font-bold tabular-nums">${formatCurrency(positionValue)}</BodyText>
            {position.status !== 'pending' ? (
              <Caption
                as="div"
                className={cn(
                  'tabular-nums inline-flex items-center justify-end gap-0.5',
                  priceChangePct >= 0 ? 'text-success' : 'text-destructive'
                )}
              >
                {priceChangePct >= 0 ? (
                  <ArrowUp className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
                ) : (
                  <ArrowDown className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
                )}
                <span>{Math.abs(priceChangePct).toFixed(1)}%</span>
              </Caption>
            ) : null}
          </div>
        </div>

        {/* Expanded content */}
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
                    <Caption className="text-muted-foreground">Entry price</Caption>
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
                    <BodyTextSmall className="font-medium tabular-nums">${formatCurrency(position.liqPrice)}</BodyTextSmall>
                  </div>
                  <div className="pt-2">
                    <div className="flex flex-col gap-4">
                      <Progress
                        value={liquidationRisk.progressPct}
                        className="h-2 bg-[rgba(255,255,255,0.08)]"
                        indicatorClassName="transition-all duration-200"
                        indicatorStyle={{
                          background: liquidationRisk.indicatorColor,
                        }}
                        aria-label="Liquidation risk"
                      />
                      {showPreventLiquidation ? (
                        <Button
                          className="w-full"
                          onClick={() =>
                            navigate('/trading/prevent-liquidation', {
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
                    <Caption className="text-muted-foreground">Take profit</Caption>
                    <BodyTextSmall className="font-medium tabular-nums">
                      {position.tp != null ? `$${formatCurrency(position.tp)}` : '—'}
                    </BodyTextSmall>
                  </div>
                  <div className="flex items-center justify-between">
                    <Caption className="text-muted-foreground">Stop loss</Caption>
                    <BodyTextSmall className="font-medium tabular-nums">
                      {position.sl != null ? `$${formatCurrency(position.sl)}` : '—'}
                    </BodyTextSmall>
                  </div>
                  <div className="flex items-center justify-between">
                    <Caption className="text-muted-foreground">Profit and loss</Caption>
                    <PnlText value={position.pnl} />
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
                    onClick={() => navigate('/trading/open', { state: { asset: assetForOpen } })}
                  >
                    New Position
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowCloseDialog(true)}
                  >
                    Close position
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Close confirmation dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent
          hideCloseButton={false}
          className="pt-6 px-6 pb-10 md:p-6 md:max-w-md mx-auto"
        >
          <DialogHeader>
            <DialogTitle>Close {position.asset} position?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Profit and loss</Caption>
              <PnlText value={position.pnl} />
            </div>
            <div className="flex items-center justify-between">
              <Caption className="text-muted-foreground">Deposit returned</Caption>
              <BodyTextSmall className="font-medium tabular-nums">${formatCurrency(position.deposit)}</BodyTextSmall>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <BodyText className="font-semibold">Total received</BodyText>
              <BodyText className={`font-bold tabular-nums ${totalReceived >= 0 ? 'text-success' : 'text-destructive'}`}>
                ${formatCurrency(Math.max(0, totalReceived))}
              </BodyText>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowCloseDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onClose(position.id);
                setShowCloseDialog(false);
              }}
            >
              Yes, close it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function Positions() {
  const navigate = useNavigate();
  const { positions, removePosition, portfolioTotal, portfolio24hPct } = useTrading();

  const deltaPositive = portfolio24hPct >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Portfolio header */}
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <Heading1 className="tabular-nums">${formatCurrency(portfolioTotal)}</Heading1>
          <Caption
            as="div"
            className={cn(
              'tabular-nums inline-flex items-center gap-0.5',
              deltaPositive ? 'text-success' : 'text-destructive'
            )}
          >
            {deltaPositive ? (
              <ArrowUp className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
            ) : (
              <ArrowDown className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
            )}
            <span>{Math.abs(portfolio24hPct).toFixed(1)}%</span>
          </Caption>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={() => navigate('/trading/trade')}
        >
          Trade
        </Button>
      </div>

      {/* Positions list */}
      <div className="space-y-3">
        <Label className="text-overline text-muted-foreground">Open positions</Label>

        {positions.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <BodyText className="text-muted-foreground">No open positions</BodyText>
              <Button
                variant="ghost"
                className="mt-3 text-primary"
                onClick={() => navigate('/trading/trade')}
              >
                Open your first trade
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {positions.map(pos => (
              <PositionCard key={pos.id} position={pos} onClose={removePosition} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
