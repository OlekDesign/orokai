import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip as RechartsTooltip,
  ReferenceLine
} from 'recharts';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { Heading2, Caption, Heading1, BodyTextSmall, BodyText } from '@/components/ui/typography';

// Helper function to format date based on time range
const formatDate = (date: Date, timeRange: 'week' | 'month' | 'all'): string => {
  switch (timeRange) {
    case 'week':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    case 'month':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
    case 'all':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
    default:
      return date.toLocaleDateString();
  }
};

// Generate affiliate chart data that gradually grows to the target total
const generateAffiliateChartData = (timeRange: 'week' | 'month' | 'all', targetTotal: number) => {
  const today = new Date();
  const data = [];
  
  let daysToShow: number;
  switch (timeRange) {
    case 'week':
      daysToShow = 7;
      break;
    case 'month':
      daysToShow = 30;
      break;
    case 'all':
      daysToShow = 730; // 2 years
      break;
    default:
      daysToShow = 7;
  }

  // Start from 0 and gradually grow to targetTotal
  const startValue = 0;
  const totalGrowth = targetTotal - startValue;
  
  // Calculate average daily growth
  const averageDailyGrowth = totalGrowth / daysToShow;
  
  // Simulate some larger reward spikes at various points (20% of days get rewards)
  const rewardDates: { day: number; amount: number }[] = [];
  const numRewards = Math.max(1, Math.floor(daysToShow * 0.2)); // 20% of days get rewards
  
  // Distribute rewards evenly across the period
  for (let i = 0; i < numRewards; i++) {
    const dayIndex = Math.floor((daysToShow / (numRewards + 1)) * (i + 1));
    // Each reward is 2-3x the average daily growth
    const rewardAmount = averageDailyGrowth * (2 + Math.random());
    rewardDates.push({ day: dayIndex, amount: rewardAmount });
  }

  let currentValue = startValue;
  let totalRewardsDistributed = 0;
  
  for (let i = 0; i < daysToShow; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - (daysToShow - 1 - i));
    
    // Check if there's a reward on this day
    const reward = rewardDates.find(r => r.day === i);
    
    if (reward) {
      currentValue += reward.amount;
      totalRewardsDistributed += reward.amount;
    } else {
      // Small incremental growth between rewards
      const remainingDays = daysToShow - i;
      const remainingGrowth = targetTotal - currentValue;
      const dailyGrowth = remainingGrowth / remainingDays;
      currentValue += dailyGrowth;
    }
    
    // On the last day, ensure we reach exactly the target total
    if (i === daysToShow - 1) {
      currentValue = targetTotal;
    }

    data.push({
      date: formatDate(currentDate, timeRange),
      value: Number(Math.max(0, Math.min(currentValue, targetTotal)).toFixed(2)),
      reward: reward ? Number(reward.amount.toFixed(2)) : 0
    });
  }

  return data;
};

export function AffiliateAnalytics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Level rewards (in USDT)
  const level1Rewards = 7334;
  const level2Rewards = 0;
  const level3Rewards = 0;
  
  // Calculate total affiliate rewards as sum of all levels
  const totalAffiliateRewards = level1Rewards + level2Rewards + level3Rewards;

  // Generate chart data that grows to totalAffiliateRewards
  const [chartData, setChartData] = useState(() => generateAffiliateChartData(timeRange, totalAffiliateRewards));

  // Update chart data when time range changes
  useEffect(() => {
    setChartData(generateAffiliateChartData(timeRange, totalAffiliateRewards));
  }, [timeRange, totalAffiliateRewards]);

  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      // Add year to label if it's missing (for week view)
      let timestampWithYear = label;
      if (!label.match(/\d{4}/)) {
        // If no year found, add current year
        const currentYear = new Date().getFullYear();
        timestampWithYear = `${label}, ${currentYear}`;
      }
      
      return (
        <div className="bg-card text-card-foreground p-3 rounded-lg shadow-lg border border-border flex flex-col gap-1">
          <BodyTextSmall className="text-foreground">
            ${data.value.toLocaleString()}
          </BodyTextSmall>
          {data.reward > 0 && (
            <Caption style={{ color: 'hsl(var(--faded))' }}>
              +${data.reward.toLocaleString()}
            </Caption>
          )}
          <Caption style={{ color: 'hsl(var(--faded))' }}>
            {timestampWithYear}
          </Caption>
        </div>
      );
    }
    return null;
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Total Affiliate Rewards Card with Chart */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card className="h-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{ duration: 0.2, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="h-full flex flex-col"
          >
            <CardHeader className="flex-shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription>Total affiliate rewards</CardDescription>
                  <Heading1 className="mt-1">
                    ${totalAffiliateRewards.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </Heading1>
                </div>
                <div className="hidden md:block scale-90 origin-top-right">
                  <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6">
              <div className="flex-1 min-h-[130px] md:min-h-[200px]">
                <ResponsiveContainer width="100%" height={isMobile ? 130 : 200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="affiliateColorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="white" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="white" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      tickMargin={8}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      hide={isMobile}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    {chartData.map((entry, index) => 
                      entry.reward > 0 ? (
                        <ReferenceLine
                          key={index}
                          x={entry.date}
                          stroke="hsl(var(--primary))"
                          strokeDasharray="3 3"
                          opacity={0.5}
                        />
                      ) : null
                    )}
                    <Area
                      type="stepAfter"
                      dataKey="value"
                      stroke="white"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#affiliateColorValue)"
                      isAnimationActive={true}
                      animationDuration={300}
                      animationBegin={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Mobile TimeRangeSelector - Below chart, centered */}
              <div className="md:hidden flex justify-center">
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
              </div>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>

      {/* Direct Invites Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card>
          <CardHeader>
            <CardDescription>Level 1</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]"><Caption>Affiliates</Caption></TableHead>
                  <TableHead><Caption>Active</Caption></TableHead>
                  <TableHead className="text-right"><Caption>Rewards</Caption></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="w-[120px]"><BodyTextSmall>112</BodyTextSmall></TableCell>
                  <TableCell><BodyTextSmall>43</BodyTextSmall></TableCell>
                  <TableCell className="text-right"><BodyTextSmall>{level1Rewards.toLocaleString()} USDT</BodyTextSmall></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Indirect Invites Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card>
          <CardHeader>
            <CardDescription>Level 2</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]"><Caption>Affiliates</Caption></TableHead>
                  <TableHead><Caption>Active</Caption></TableHead>
                  <TableHead className="text-right"><Caption>Rewards</Caption></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="w-[120px]"><BodyTextSmall>21</BodyTextSmall></TableCell>
                  <TableCell><BodyTextSmall>13</BodyTextSmall></TableCell>
                  <TableCell className="text-right"><BodyTextSmall>{level2Rewards.toLocaleString()} USDT</BodyTextSmall></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Their Invites Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card>
          <CardHeader>
            <CardDescription>Level 3</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]"><Caption>Affiliates</Caption></TableHead>
                  <TableHead><Caption>Active</Caption></TableHead>
                  <TableHead className="text-right"><Caption>Rewards</Caption></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="w-[120px]"><BodyTextSmall>3</BodyTextSmall></TableCell>
                  <TableCell><BodyTextSmall>3</BodyTextSmall></TableCell>
                  <TableCell className="text-right"><BodyTextSmall>{level3Rewards.toLocaleString()} USDT</BodyTextSmall></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card>
          <CardHeader>
            <CardDescription>Total</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]"><Caption>Affiliates</Caption></TableHead>
                  <TableHead><Caption>Active</Caption></TableHead>
                  <TableHead className="text-right"><Caption>Rewards</Caption></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="w-[120px]"><BodyTextSmall>136</BodyTextSmall></TableCell>
                  <TableCell><BodyTextSmall>59</BodyTextSmall></TableCell>
                  <TableCell className="text-right"><BodyTextSmall>{totalAffiliateRewards.toLocaleString()} USDT</BodyTextSmall></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}

