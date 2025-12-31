import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Minus, Plus, Sliders } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Heading2, Caption, Heading1 } from '@/components/ui/typography';

interface SemiCircularGaugeProps {
  currentAmount: number;
  targetAmount: number;
}

function SemiCircularGauge({ currentAmount, targetAmount }: SemiCircularGaugeProps) {
  const percentage = Math.min(100, Math.max(0, (currentAmount / targetAmount) * 100));
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  
  const totalArcDegrees = 260;
  const centerAngle = 270;
  const startAngle = centerAngle - (totalArcDegrees / 2);
  const endAngle = centerAngle + (totalArcDegrees / 2);
  const progressEndAngle = startAngle + (percentage * totalArcDegrees / 100);
  
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;
  const progressEndAngleRad = (progressEndAngle * Math.PI) / 180;
  
  const startX = centerX + radius * Math.cos(startAngleRad);
  const startY = centerY + radius * Math.sin(startAngleRad);
  const endX = centerX + radius * Math.cos(endAngleRad);
  const endY = centerY + radius * Math.sin(endAngleRad);
  const progressEndX = centerX + radius * Math.cos(progressEndAngleRad);
  const progressEndY = centerY + radius * Math.sin(progressEndAngleRad);
  
  const largeArcFlag = totalArcDegrees > 180 ? 1 : 0;
  const progressLargeArcFlag = (percentage * totalArcDegrees / 100) > 180 ? 1 : 0;
  
  const backgroundPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  const progressPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${progressLargeArcFlag} 1 ${progressEndX} ${progressEndY}`;
  
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
            </linearGradient>
          </defs>
          <path
            d={backgroundPath}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-border"
          />
          <path
            d={progressPath}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-heading-1 text-foreground">{percentage.toFixed(0)}%</h1>
          <Heading2 className="text-foreground mt-1">${currentAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Heading2>
        </div>
      </div>
      <Caption className="text-foreground text-center">Collect ${targetAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} affiliate rewards to unlock Premium</Caption>
    </div>
  );
}

export function AffiliateProgram() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [directInvites, setDirectInvites] = useState(10);
  const [indirectInvites, setIndirectInvites] = useState(0);
  const [theirInvites, setTheirInvites] = useState(0);

  const totalPoints = directInvites + indirectInvites + theirInvites;
  const pointsLeft = 10 - totalPoints;

  const handleDecrease = (type: 'direct' | 'indirect' | 'their') => {
    if (type === 'direct' && directInvites > 0) {
      setDirectInvites(directInvites - 1);
    } else if (type === 'indirect' && indirectInvites > 0) {
      setIndirectInvites(indirectInvites - 1);
    } else if (type === 'their' && theirInvites > 0) {
      setTheirInvites(theirInvites - 1);
    }
  };

  const handleIncrease = (type: 'direct' | 'indirect' | 'their') => {
    if (pointsLeft > 0) {
      if (type === 'direct') {
        setDirectInvites(directInvites + 1);
      } else if (type === 'indirect') {
        setIndirectInvites(indirectInvites + 1);
      } else if (type === 'their') {
        setTheirInvites(theirInvites + 1);
      }
    }
  };

  const handleSave = () => {
    // Save logic here
    setIsDialogOpen(false);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
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

      {/* Full Width Empty Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card className="border border-border">
          <CardContent className="p-6">
            <SemiCircularGauge currentAmount={3112} targetAmount={10000} />
          </CardContent>
        </Card>
      </motion.div>

      {/* My Commissions Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardDescription>My commissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Direct invites:</span>
                  <span className="text-sm font-medium text-foreground">{directInvites}%</span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Sliders className="h-4 w-4" />
                  Distribute
                </Button>
              </div>
              {indirectInvites > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Indirect invites:</span>
                  <span className="text-sm font-medium text-foreground">{indirectInvites}%</span>
                </div>
              )}
              {theirInvites > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Their invites:</span>
                  <span className="text-sm font-medium text-foreground">{theirInvites}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Premium Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card className="border border-border">
          <CardHeader>
            <CardDescription>Premium</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Direct invites:</span>
              <span className="text-sm font-medium text-foreground">15%</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pro Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card className="border border-border">
          <CardHeader>
            <CardDescription>Pro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Direct invites:</span>
                <span className="text-sm font-medium text-foreground">20%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Indirect invites:</span>
                <span className="text-sm font-medium text-foreground">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* VIP Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card className="border border-border">
          <CardHeader>
            <CardDescription>VIP</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Direct invites:</span>
                <span className="text-sm font-medium text-foreground">22%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Indirect invites:</span>
                <span className="text-sm font-medium text-foreground">6%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Their invites:</span>
                <span className="text-sm font-medium text-foreground">2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Legend Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card className="border border-border">
          <CardHeader>
            <CardDescription>Legend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Direct invites:</span>
                <span className="text-sm font-medium text-foreground">25%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Indirect invites:</span>
                <span className="text-sm font-medium text-foreground">10%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Their invites:</span>
                <span className="text-sm font-medium text-foreground">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Commission Settings Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md p-6">
          <div className="flex flex-row items-start mb-4">
            <div className="flex flex-col">
              <h1 className="text-3xl font-zodiak font-medium text-foreground">{pointsLeft}</h1>
              <Caption className="text-muted-foreground">% points left to distribute</Caption>
            </div>
          </div>
          
          <div className="space-y-4 mt-4">
            {/* Direct Invites */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Direct invites</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDecrease('direct')}
                  disabled={directInvites === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={directInvites}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (value >= 0 && value <= 10) {
                      const diff = value - directInvites;
                      if (diff <= pointsLeft) {
                        setDirectInvites(value);
                      }
                    }
                  }}
                  className="w-16 text-center"
                  min="0"
                  max="10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleIncrease('direct')}
                  disabled={pointsLeft === 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Indirect Invites */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Indirect invites</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDecrease('indirect')}
                  disabled={indirectInvites === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={indirectInvites}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (value >= 0 && value <= 10) {
                      const diff = value - indirectInvites;
                      if (diff <= pointsLeft) {
                        setIndirectInvites(value);
                      }
                    }
                  }}
                  className="w-16 text-center"
                  min="0"
                  max="10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleIncrease('indirect')}
                  disabled={pointsLeft === 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Their Invites */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Their invites</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDecrease('their')}
                  disabled={theirInvites === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={theirInvites}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (value >= 0 && value <= 10) {
                      const diff = value - theirInvites;
                      if (diff <= pointsLeft) {
                        setTheirInvites(value);
                      }
                    }
                  }}
                  className="w-16 text-center"
                  min="0"
                  max="10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleIncrease('their')}
                  disabled={pointsLeft === 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleSave}
              className="w-full"
              size="lg"
            >
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

