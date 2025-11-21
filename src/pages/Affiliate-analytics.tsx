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
import { generateChartData, rewardTransactions } from '@/utils/stakingData';
import { Heading2, Caption, Heading1, BodyTextSmall, BodyText } from '@/components/ui/typography';

export function AffiliateAnalytics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [chartData, setChartData] = useState(generateChartData(timeRange));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Total affiliate rewards (matching Affiliate.tsx)
  const totalAffiliateRewards = 3112;

  // Update chart data when time range changes
  useEffect(() => {
    setChartData(generateChartData(timeRange));
  }, [timeRange]);

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
      return (
        <div className="bg-card text-card-foreground p-3 rounded-lg shadow-lg border border-border">
          <span className="text-caption mb-1">{label}</span>
          <BodyTextSmall className="font-medium">
            Total: ${data.value.toLocaleString()}
          </BodyTextSmall>
          {data.reward > 0 && (
            <BodyTextSmall className="text-success mt-1">
              +${data.reward.toLocaleString()} reward
            </BodyTextSmall>
          )}
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
                  <CardDescription>Total Affiliate Rewards</CardDescription>
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
            <CardDescription>Direct invites</CardDescription>
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
                  <TableCell className="text-right"><BodyTextSmall>7,334 USDT</BodyTextSmall></TableCell>
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
            <CardDescription>Indirect invites</CardDescription>
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
                  <TableCell className="text-right"><BodyTextSmall>0 USDT</BodyTextSmall></TableCell>
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
            <CardDescription>Their invites</CardDescription>
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
                  <TableCell className="text-right"><BodyTextSmall>0 USDT</BodyTextSmall></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}

