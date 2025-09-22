import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ClipboardList } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip,
  ReferenceLine
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { generateChartData } from '@/utils/stakingData';
import type { Transaction, TransactionType } from '@/types';
import { cn } from "@/lib/utils";

export default function DashboardEmpty() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [investAmount, setInvestAmount] = useState(10000);
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(generateChartData(timeRange));

  // Update chart data when time range changes
  useEffect(() => {
    setChartData(generateChartData(timeRange));
  }, [timeRange]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card text-card-foreground p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Example Data</p>
          <p className="text-sm max-w-[200px]">
            This is an example of how your rewards will be displayed once you start investing.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        <Card className="lg:col-span-5">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardDescription>Total Rewards</CardDescription>
                <CardTitle className="text-heading-1 text-foreground mt-1">
                  Let's get started
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Your passive income rewards will show here
                </p>
              </div>
              <div className="scale-90 origin-top-right">
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-[300px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="white" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="white" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    tickMargin={8}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="stepAfter"
                    dataKey="value"
                    stroke="white"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationBegin={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardDescription>Passive Income</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Input
                    type="text"
                    value={`$${investAmount.toLocaleString()}`}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setInvestAmount(Number(value) || 0);
                    }}
                    className="h-auto pt-6 pb-2 text-xl font-semibold px-4"
                  />
                  <span className="absolute left-4 top-2 text-xs text-muted-foreground font-medium">
                    Amount
                  </span>
                </div>
              </div>

              <div className="relative -my-6">
                <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[calc(50%+8px)] bg-card rounded-full p-2 z-50">
                  <ArrowRight className="text-primary rotate-90" size={18} />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="w-full h-auto pt-6 pb-2 px-4 text-xl font-semibold bg-accent rounded-md flex items-center text-primary">
                    ${(investAmount * 1.078).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <span className="absolute left-4 top-2 text-xs text-muted-foreground font-medium">
                    Estimated Return (APY 7.8%)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-6">
              <Button 
                onClick={() => navigate('/transaction-review', { 
                  state: { amount: investAmount } 
                })} 
                className="w-full h-12"
                variant="default"
                size="lg">
                Review Order
              </Button>

              <div className="bg-accent/30 rounded-lg space-y-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span>You'll receive $2,13 every 24h</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span>Your funds are securely stored</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span>You can withdraw your funds anytime</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between space-x-4">
            <CardDescription>Latest transactions</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center mb-4">
              <ClipboardList className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Your transactions will show here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
