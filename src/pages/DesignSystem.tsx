import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Toggle } from '@/components/ui/toggle';
import { Card } from '@/components/ui/card';
import { Heading1, Heading2, BodyText, BodyTextSmall, Caption } from '@/components/ui/typography';
import { StatsCard } from '@/components/StatsCard';
import { InvestmentCard } from '@/components/InvestmentCard';
import { StakingOptionCard } from '@/components/StakingOptionCard';
import { WalletCard } from '@/components/WalletCard';
import { TransactionRow } from '@/components/TransactionRow';
import { ActiveStaking } from '@/components/ActiveStaking';
import { CryptoIcon } from '@/components/CryptoIcon';
import { Avatar } from '@/components/Avatar';
import { CurrencySelect } from '@/components/CurrencySelect';
import { SegmentedSwitch } from '@/components/SegmentedSwitch';
import { CreditCardForm } from '@/components/CreditCardForm';
import { InfoTooltip } from '@/components/InfoTooltip';
import { TransactionDetailsDialog } from '@/components/TransactionDetailsDialog';
import { DollarSign, Zap } from 'lucide-react';
import { Table, TableBody } from '@/components/ui/table';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-12 w-full">
    <Heading1 className="text-foreground border-b border-border pb-4">{title}</Heading1>
    <div className="flex flex-wrap justify-center items-center gap-[200px] py-10">
      {children}
    </div>
  </div>
);

const ComponentWrapper = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-6">
    <Caption className="text-muted-foreground uppercase tracking-widest font-bold text-xs">{label}</Caption>
    <div className="flex items-center justify-center min-w-[200px]">
      {children}
    </div>
  </div>
);

export default function DesignSystem() {
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  const mockInvestment = {
    id: '1',
    amount: 5000,
    earned: 124.50,
    apy: 12.5,
    chain: 'Ethereum',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const mockStakingOption = {
    title: 'Ethereum Staking',
    chain: 'Ethereum',
    apy: 4.5,
    minAmount: 100,
    lockPeriod: '7 days',
    isSelected: true,
  };

  const mockTransaction = {
    id: 'tx-1',
    type: 'investment' as const,
    amount: 1000,
    token: 'USDT',
    status: 'completed' as const,
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground pb-40">
      <div className="max-w-[1600px] mx-auto px-10 pt-20 space-y-40">
        <div className="space-y-4">
          <Heading1 className="text-6xl font-bold tracking-tighter">Design System</Heading1>
          <BodyText className="text-muted-foreground text-xl">Integrated components and orphan elements used across the crypto platform.</BodyText>
        </div>

        {/* INTEGRATED COMPONENTS */}
        
        <Section title="Foundations">
          <ComponentWrapper label="Typography">
            <div className="space-y-4 text-left w-full">
              <Heading1>Heading 1</Heading1>
              <Heading2>Heading 2</Heading2>
              <BodyText>Body Text</BodyText>
              <BodyTextSmall>Body Text Small</BodyTextSmall>
              <Caption>Caption</Caption>
            </div>
          </ComponentWrapper>
          <ComponentWrapper label="Colors">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary border border-border" title="Primary"></div>
              <div className="w-12 h-12 rounded-full bg-secondary border border-border" title="Secondary"></div>
              <div className="w-12 h-12 rounded-full bg-accent border border-border" title="Accent"></div>
              <div className="w-12 h-12 rounded-full bg-success border border-border" title="Success"></div>
              <div className="w-12 h-12 rounded-full bg-destructive border border-border" title="Destructive"></div>
            </div>
          </ComponentWrapper>
        </Section>

        <Section title="Atoms">
          <ComponentWrapper label="Buttons">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </ComponentWrapper>
          <ComponentWrapper label="Input">
            <Input placeholder="Type something..." className="w-64" />
          </ComponentWrapper>
          <ComponentWrapper label="Progress">
            <Progress value={65} className="w-64" />
          </ComponentWrapper>
          <ComponentWrapper label="Crypto Icons">
            <div className="flex gap-4">
              <CryptoIcon symbol="BTC" size={32} />
              <CryptoIcon symbol="ETH" size={32} />
              <CryptoIcon symbol="SOL" size={32} />
            </div>
          </ComponentWrapper>
          <ComponentWrapper label="Avatar">
            <Avatar name="John Doe" size="lg" />
          </ComponentWrapper>
        </Section>

        <Section title="Molecules">
          <ComponentWrapper label="Segmented Switch">
            <SegmentedSwitch
              value="month"
              onChange={() => {}}
              options={[
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'all', label: 'All' },
              ]}
            />
          </ComponentWrapper>
          <ComponentWrapper label="Info Tooltip">
            <InfoTooltip content="Helpful information about an integrated component." />
          </ComponentWrapper>
        </Section>

        <Section title="Organisms">
          <ComponentWrapper label="Transaction Dialog">
            <div>
              <Button onClick={() => setIsTransactionDialogOpen(true)}>Show Details</Button>
              <TransactionDetailsDialog 
                transaction={mockTransaction as any} 
                open={isTransactionDialogOpen} 
                onOpenChange={setIsTransactionDialogOpen} 
              />
            </div>
          </ComponentWrapper>
        </Section>

        <Section title="Tables & Lists">
          <ComponentWrapper label="Transaction Row">
            <div className="w-[800px] bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableBody>
                  <TransactionRow transaction={mockTransaction} />
                </TableBody>
              </Table>
            </div>
          </ComponentWrapper>
        </Section>

        {/* ORPHAN COMPONENTS */}

        <Section title="Orphan Components">
          <ComponentWrapper label="Stats Card">
            <div className="w-[300px]">
              <StatsCard 
                title="Total rewards" 
                value="$755.95" 
                change="+$17.49" 
              />
            </div>
          </ComponentWrapper>
          <ComponentWrapper label="Investment Card">
            <div className="w-[350px]">
              <InvestmentCard investment={mockInvestment} onWithdraw={() => {}} />
            </div>
          </ComponentWrapper>
          <ComponentWrapper label="Staking Option Card">
            <div className="w-[350px]">
              <StakingOptionCard {...mockStakingOption} />
            </div>
          </ComponentWrapper>
          <ComponentWrapper label="Wallet Card">
            <div className="w-[350px]">
              <WalletCard balance={2.45} address="0x1234...5678" tokenSymbol="ETH" />
            </div>
          </ComponentWrapper>
          <ComponentWrapper label="Active Staking">
            <div className="w-[400px]">
              <ActiveStaking staking={mockInvestment} />
            </div>
          </ComponentWrapper>
          <ComponentWrapper label="Currency Select">
            <div className="w-[300px]">
              <CurrencySelect value="ETH" onChange={() => {}} />
            </div>
          </ComponentWrapper>
          <ComponentWrapper label="Credit Card Form">
            <div className="w-[400px]">
              <CreditCardForm onSubmit={async () => {}} onCancel={() => {}} />
            </div>
          </ComponentWrapper>
        </Section>
      </div>
    </div>
  );
}
