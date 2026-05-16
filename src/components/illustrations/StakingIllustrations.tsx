import { ArrowRight, ArrowDown, Building2, Network, User, Shield, Scale, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type IllustrationKey = 'staking-savings' | 'staking-different' | 'staking-earns' | 'staking-ready';

interface StakingIllustrationProps {
  type: IllustrationKey;
}

export function StakingIllustration({ type }: StakingIllustrationProps) {
  switch (type) {
    case 'staking-savings':
      return <SavingsFlow />;
    case 'staking-different':
      return <NetworkFlow />;
    case 'staking-earns':
      return <EarningsCalendar />;
    case 'staking-ready':
      return <ThreeStepMockups />;
  }
}

// ────────────────────────────────────────────────────────────
// Slides 1 & 2 — Flow diagrams (You → Middle → You)
// ────────────────────────────────────────────────────────────

interface FlowNodeProps {
  icon: React.ReactNode;
  label: string;
  amount?: string;
  sublabel?: string;
  pill?: { text: string; tone: 'muted' | 'success' };
  iconTone?: 'primary' | 'muted';
  gain?: boolean;
}

function FlowNode({ icon, label, amount, sublabel, pill, iconTone = 'primary', gain }: FlowNodeProps) {
  return (
    <div className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm sm:flex-col sm:gap-0 sm:px-3 sm:py-4 sm:text-center">
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:mb-3 sm:h-14 sm:w-14',
          iconTone === 'primary' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        )}
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start sm:flex-none sm:items-center">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {amount && (
          <div className={cn('text-xl font-bold tracking-tight sm:mt-1 sm:text-2xl', gain ? 'text-success' : 'text-foreground')}>
            {amount}
          </div>
        )}
        {sublabel && <div className="text-xs font-medium text-muted-foreground sm:mt-0.5">{sublabel}</div>}
        {pill && (
          <div
            className={cn(
              'mt-1.5 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold sm:mt-2.5 sm:text-xs',
              pill.tone === 'success' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'
            )}
          >
            {pill.text}
          </div>
        )}
      </div>
    </div>
  );
}

interface FlowArrowProps {
  label: string;
}

function FlowArrow({ label }: FlowArrowProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 text-[11px] font-medium text-muted-foreground sm:flex-col sm:py-0">
      <ArrowDown className="h-4 w-4 sm:hidden" />
      <ArrowRight className="hidden h-4 w-4 sm:block" />
      <span>{label}</span>
    </div>
  );
}

function SavingsFlow() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch sm:gap-3">
      <FlowNode
        icon={<User className="h-5 w-5 sm:h-6 sm:w-6" />}
        label="You"
        amount="$1,000"
        sublabel="deposit"
      />
      <FlowArrow label="deposit" />
      <FlowNode
        icon={<Building2 className="h-5 w-5 sm:h-6 sm:w-6" />}
        label="Bank"
        iconTone="muted"
        pill={{ text: '2% interest / year', tone: 'muted' }}
      />
      <FlowArrow label="after 1 year" />
      <FlowNode
        icon={<User className="h-5 w-5 sm:h-6 sm:w-6" />}
        label="You"
        amount="$1,020"
        sublabel="+$20 earned"
        gain
      />
    </div>
  );
}

function NetworkFlow() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch sm:gap-3">
      <FlowNode
        icon={<User className="h-5 w-5 sm:h-6 sm:w-6" />}
        label="You"
        amount="$1,000"
        sublabel="deposit"
      />
      <FlowArrow label="deposit" />
      <FlowNode
        icon={<Network className="h-5 w-5 sm:h-6 sm:w-6" />}
        label="Network"
        pill={{ text: '10% rewards / year', tone: 'success' }}
      />
      <FlowArrow label="after 1 year" />
      <FlowNode
        icon={<User className="h-5 w-5 sm:h-6 sm:w-6" />}
        label="You"
        amount="$1,100"
        sublabel="+$100 earned"
        gain
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Slide 3 — Monthly calendar
// ────────────────────────────────────────────────────────────

function EarningsCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div className="space-y-5 sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:space-y-0">
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {days.map((d) => (
          <div
            key={d}
            className="flex aspect-[1.4/1] flex-col justify-between rounded-lg border border-border bg-muted/40 p-1.5 sm:p-2"
          >
            <span className="text-[10px] font-semibold text-muted-foreground sm:text-[11px]">{d}</span>
            <span className="text-[10px] font-semibold leading-none text-success sm:text-xs">+$0.27</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 sm:min-w-[180px]">
        <div>
          <div className="text-3xl font-bold leading-none tracking-tight text-success sm:text-4xl">+$8.10</div>
          <div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">this month</div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
          <Zap className="h-3 w-3" />
          Paid automatically
        </div>
        <div className="border-t border-border pt-3 text-xs sm:text-sm">
          <div className="font-semibold text-foreground">+$100 / year</div>
          <div className="text-muted-foreground">on $1,000 staked</div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Slide 4 — Three mini app-screen mockups
// ────────────────────────────────────────────────────────────

interface StepCardProps {
  num: number;
  title: string;
  children: React.ReactNode;
  footer: string;
}

function StepCard({ num, title, children, footer }: StepCardProps) {
  return (
    <div className="relative rounded-2xl border border-border bg-muted/30 p-4 pt-6 shadow-sm sm:p-5 sm:pt-7">
      <div className="absolute -top-3 left-4 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {num}
      </div>
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      {children}
      <div className="mt-4 text-center text-[11px] font-medium text-muted-foreground">{footer}</div>
    </div>
  );
}

function StrategyRow({
  icon,
  name,
  apy,
  selected,
}: {
  icon: React.ReactNode;
  name: string;
  apy: string;
  selected?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-lg border px-2.5 py-2 transition-colors',
        selected
          ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
          : 'border-transparent bg-card'
      )}
    >
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
          selected ? 'bg-card text-primary' : 'bg-muted text-muted-foreground'
        )}
      >
        {icon}
      </div>
      <div className="flex-1 text-xs font-semibold text-foreground">{name}</div>
      <div className="text-[11px] font-bold text-success">{apy}</div>
    </div>
  );
}

function ThreeStepMockups() {
  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-4">
      {/* Card 1 — Strategy */}
      <StepCard num={1} title="Choose strategy" footer="Pick a strategy that fits your goals">
        <div className="space-y-1.5">
          <StrategyRow icon={<Shield className="h-3.5 w-3.5" />} name="Conservative" apy="5% APY" />
          <StrategyRow icon={<Scale className="h-3.5 w-3.5" />} name="Balanced" apy="8% APY" />
          <StrategyRow icon={<TrendingUp className="h-3.5 w-3.5" />} name="Growth" apy="12% APY" selected />
        </div>
      </StepCard>

      {/* Card 2 — Amount */}
      <StepCard num={2} title="Amount" footer="Choose how much to set aside">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-foreground">1,000</span>
            <span className="text-xs font-medium text-muted-foreground">USDC</span>
          </div>
          <div className="mt-0.5 text-[10px] font-medium text-muted-foreground">Available: 2,450 USDC</div>
          <div className="mt-2.5 flex gap-1.5">
            <div className="flex-1 rounded-md border border-border bg-card py-1 text-center text-[10px] font-semibold text-muted-foreground">
              25%
            </div>
            <div className="flex-1 rounded-md border border-border bg-card py-1 text-center text-[10px] font-semibold text-muted-foreground">
              50%
            </div>
            <div className="flex-1 rounded-md bg-primary py-1 text-center text-[10px] font-semibold text-primary-foreground">
              Max
            </div>
          </div>
        </div>
        <div className="mt-3 text-center text-[11px] text-muted-foreground">
          ≈ <span className="font-bold text-success">+$100</span> over 1 year
        </div>
      </StepCard>

      {/* Card 3 — Rewards */}
      <StepCard num={3} title="Your staking" footer="Watch your rewards grow">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-success">+$8.50</span>
          <span className="text-[10px] font-semibold text-muted-foreground">this month</span>
        </div>
        <div className="mt-2.5 h-[60px] rounded-lg border border-border bg-card p-2">
          <svg viewBox="0 0 200 50" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id="rewards-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,42 L20,40 L40,36 L60,34 L80,28 L100,26 L120,22 L140,18 L160,14 L180,10 L200,6 L200,50 L0,50 Z"
              fill="url(#rewards-gradient)"
            />
            <polyline
              points="0,42 20,40 40,36 60,34 80,28 100,26 120,22 140,18 160,14 180,10 200,6"
              fill="none"
              stroke="hsl(var(--success))"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="mt-2.5 text-[11px] text-muted-foreground">
          Total earned: <span className="font-bold text-foreground">$87.40</span>
        </div>
      </StepCard>
    </div>
  );
}
