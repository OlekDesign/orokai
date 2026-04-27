import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export interface BorrowingPosition {
  id: string;
  asset: string;
  ticker: string;
  collateralAsset: string;
  collateralAmount: number;
  direction: 'Long' | 'Short';
  leverage: number;
  status: 'pending' | 'complete';
  pnl: number;
  roe: number;
  deposit: number;
  liqPrice: number;
  tp: number | null;
  sl: number | null;
  entryPrice: number;
  marketPrice: number;
  openedAt: string;
  size?: number;
  fundingTotal?: number;
  fundingRate8h?: number;
}

interface BorrowingContextValue {
  positions: BorrowingPosition[];
  addPosition: (position: BorrowingPosition) => void;
  updatePosition: (id: string, updates: Partial<BorrowingPosition>) => void;
  removePosition: (id: string) => void;
  portfolioTotal: number;
  portfolio24hDelta: number;
  portfolio24hPct: number;
}

const BorrowingContext = createContext<BorrowingContextValue | null>(null);

function getLiquidationPrice(marketPrice: number) {
  return marketPrice * 0.9;
}

function getPriceChangePct(entryPrice: number, marketPrice: number) {
  if (!entryPrice) return 0;
  return ((marketPrice - entryPrice) / entryPrice) * 100;
}

function roundTo2(value: number) {
  return Math.round(value * 100) / 100;
}

function createSeedPosition(
  position: Omit<BorrowingPosition, 'liqPrice' | 'roe' | 'pnl'>
): BorrowingPosition {
  const liqPrice = roundTo2(getLiquidationPrice(position.marketPrice));
  const roe = roundTo2(getPriceChangePct(position.entryPrice, position.marketPrice));
  const positionSize = position.size ?? position.deposit * position.leverage;
  const pnl = roundTo2(positionSize * (roe / 100));

  return {
    ...position,
    size: positionSize,
    liqPrice,
    roe,
    pnl,
  };
}

const SEED_POSITIONS: BorrowingPosition[] = [
  createSeedPosition({
    id: 'borrow-1',
    asset: 'Bitcoin',
    ticker: 'BTC',
    collateralAsset: 'USDT',
    collateralAmount: 1200,
    direction: 'Long',
    leverage: 5,
    status: 'complete',
    deposit: 1200,
    tp: 70100,
    sl: 64800,
    entryPrice: 66520,
    marketPrice: 67240,
    openedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    size: 6000,
    fundingTotal: -4.2,
    fundingRate8h: -0.01,
  }),
  createSeedPosition({
    id: 'borrow-2',
    asset: 'Ethereum',
    ticker: 'ETH',
    collateralAsset: 'USDT',
    collateralAmount: 800,
    direction: 'Long',
    leverage: 3,
    status: 'pending',
    deposit: 800,
    tp: 3680,
    sl: 3380,
    entryPrice: 3490,
    marketPrice: 3512,
    openedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    size: 2400,
    fundingTotal: 0,
    fundingRate8h: 0.01,
  }),
  createSeedPosition({
    id: 'borrow-3',
    asset: 'Solana',
    ticker: 'SOL',
    collateralAsset: 'USDT',
    collateralAmount: 950,
    direction: 'Short',
    leverage: 4,
    status: 'complete',
    deposit: 950,
    tp: 132,
    sl: 151,
    entryPrice: 145.8,
    marketPrice: 142.6,
    openedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    size: 3800,
    fundingTotal: 6.1,
    fundingRate8h: 0.01,
  }),
];

export function BorrowingProvider({ children }: { children: ReactNode }) {
  const [positions, setPositions] = useState<BorrowingPosition[]>(SEED_POSITIONS);

  const addPosition = (position: BorrowingPosition) => {
    setPositions(prev => [position, ...prev]);
  };

  const updatePosition = (id: string, updates: Partial<BorrowingPosition>) => {
    setPositions(prev =>
      prev.map(position =>
        position.id === id ? { ...position, ...updates } : position
      )
    );
  };

  const removePosition = (id: string) => {
    setPositions(prev => prev.filter(position => position.id !== id));
  };

  const portfolioTotal = useMemo(
    () => positions.reduce((sum, position) => sum + position.deposit + position.pnl, 0),
    [positions]
  );

  const portfolio24hDelta = useMemo(
    () => positions.reduce((sum, position) => sum + position.pnl, 0),
    [positions]
  );

  const portfolio24hPct = useMemo(() => {
    const totalDeposit = positions.reduce((sum, position) => sum + position.deposit, 0);
    if (totalDeposit === 0) return 0;
    return (portfolio24hDelta / totalDeposit) * 100;
  }, [positions, portfolio24hDelta]);

  return (
    <BorrowingContext.Provider
      value={{
        positions,
        addPosition,
        updatePosition,
        removePosition,
        portfolioTotal,
        portfolio24hDelta,
        portfolio24hPct,
      }}
    >
      {children}
    </BorrowingContext.Provider>
  );
}

export function useBorrowing() {
  const context = useContext(BorrowingContext);
  if (!context) {
    throw new Error('useBorrowing must be used within BorrowingProvider');
  }

  return context;
}
