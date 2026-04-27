import React, { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';

export interface Position {
  id: string;
  asset: string;
  ticker: string;
  direction: 'Long' | 'Short';
  leverage: number;
  /** Order / entry status shown in the list row. */
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

interface TradingContextValue {
  positions: Position[];
  addPosition: (p: Position) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  removePosition: (id: string) => void;
  portfolioTotal: number;
  portfolio24hDelta: number;
  portfolio24hPct: number;
}

const TradingContext = createContext<TradingContextValue | null>(null);

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

function createSeedPosition(position: Omit<Position, 'liqPrice' | 'roe' | 'pnl'>): Position {
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

const SEED_POSITIONS: Position[] = [
  createSeedPosition({
    id: '1',
    asset: 'Nvidia',
    ticker: 'NVDA',
    direction: 'Long',
    leverage: 10,
    status: 'pending',
    deposit: 1000,
    tp: 214,
    sl: 190,
    entryPrice: 193.2,
    marketPrice: 198.85,
    openedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    size: 10000,
    fundingTotal: -12.4,
    fundingRate8h: -0.01,
  }),
  createSeedPosition({
    id: '2',
    asset: 'Tesla',
    ticker: 'TSLA',
    direction: 'Short',
    leverage: 5,
    status: 'complete',
    deposit: 1000,
    tp: 340,
    sl: 385,
    entryPrice: 377.5,
    marketPrice: 364.2,
    openedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    size: 5000,
    fundingTotal: 8.2,
    fundingRate8h: 0.01,
  }),
  createSeedPosition({
    id: '3',
    asset: 'Apple',
    ticker: 'AAPL',
    direction: 'Long',
    leverage: 3,
    status: 'complete',
    deposit: 1000,
    tp: 275,
    sl: 248,
    entryPrice: 258,
    marketPrice: 263.4,
    openedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    size: 3000,
    fundingTotal: -5.1,
    fundingRate8h: -0.01,
  }),
  createSeedPosition({
    id: '4',
    asset: 'Amazon',
    ticker: 'AMZN',
    direction: 'Long',
    leverage: 20,
    status: 'complete',
    deposit: 1000,
    tp: 268,
    sl: 242,
    entryPrice: 261,
    marketPrice: 250.56,
    openedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    size: 20000,
    fundingTotal: 22.8,
    fundingRate8h: 0.01,
  }),
];

export function TradingProvider({ children }: { children: ReactNode }) {
  const [positions, setPositions] = useState<Position[]>(SEED_POSITIONS);

  const addPosition = (p: Position) => {
    setPositions(prev => [p, ...prev]);
  };

  const updatePosition = (id: string, updates: Partial<Position>) => {
    setPositions(prev =>
      prev.map(position =>
        position.id === id ? { ...position, ...updates } : position
      )
    );
  };

  const removePosition = (id: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  const portfolioTotal = useMemo(
    () => positions.reduce((sum, p) => sum + p.deposit + p.pnl, 0),
    [positions]
  );

  const portfolio24hDelta = useMemo(
    () => positions.reduce((sum, p) => sum + p.pnl, 0),
    [positions]
  );

  const portfolio24hPct = useMemo(() => {
    const totalDeposit = positions.reduce((sum, p) => sum + p.deposit, 0);
    if (totalDeposit === 0) return 0;
    return (portfolio24hDelta / totalDeposit) * 100;
  }, [positions, portfolio24hDelta]);

  return (
    <TradingContext.Provider
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
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const ctx = useContext(TradingContext);
  if (!ctx) throw new Error('useTrading must be used within TradingProvider');
  return ctx;
}
