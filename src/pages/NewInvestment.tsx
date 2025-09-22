import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Check, TrendingUp, Shield, Clock, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/PageHeader";

export function NewInvestment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [investAmount, setInvestAmount] = useState(10000);
  const [showOffering, setShowOffering] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1); // Solana is selected by default
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);

  // Investment options data
  const investmentOptions = [
    {
      id: 1,
      title: "Solana",
      description: "Stake your crypto assets in decentralized protocols for consistent returns",
      apy: "7.8%",
      rewardsFrequency: "Daily",
      fee: "2.5%",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/5"
    },
    {
      id: 2,
      title: "Ethereum",
      description: "Provide liquidity to DEX pools and earn fees from trading activity",
      apy: "12.4%",
      rewardsFrequency: "Weekly",
      fee: "3.0%",
      icon: Shield,
      color: "text-info",
      bgColor: "bg-info/5"
    },
    {
      id: 3,
      title: "Cosmos",
      description: "Maximize returns through automated yield optimization strategies",
      apy: "15.2%",
      rewardsFrequency: "Daily",
      fee: "4.5%",
      icon: Clock,
      color: "text-primary",
      bgColor: "bg-primary/5"
    },
    {
      id: 4,
      title: "Luna",
      description: "Stable returns through bonds and traditional financial instruments",
      apy: "5.5%",
      rewardsFrequency: "Monthly",
      fee: "1.5%",
      icon: DollarSign,
      color: "text-warning",
      bgColor: "bg-warning/5"
    },
    {
      id: 5,
      title: "Polygon",
      description: "Layer 2 scaling solution for Ethereum",
      apy: "9.2%",
      rewardsFrequency: "Daily",
      fee: "2.0%",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/5"
    },
    {
      id: 6,
      title: "Avalanche",
      description: "High-performance blockchain platform",
      apy: "11.8%",
      rewardsFrequency: "Weekly",
      fee: "3.5%",
      icon: Shield,
      color: "text-destructive",
      bgColor: "bg-destructive/5"
    },
    {
      id: 7,
      title: "Cardano",
      description: "Proof-of-stake blockchain platform",
      apy: "6.7%",
      rewardsFrequency: "Daily",
      fee: "1.8%",
      icon: Clock,
      color: "text-info",
      bgColor: "bg-info/5"
    },
    {
      id: 8,
      title: "Polkadot",
      description: "Multi-chain blockchain platform",
      apy: "13.5%",
      rewardsFrequency: "Weekly",
      fee: "4.0%",
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/5"
    }
  ];


  const handleReviewOrder = () => {
    const originalSource = location.state?.originalSource || 'investments'; // Default to investments if no source
    
    navigate('/transaction-review', { 
      state: { 
        amount: investAmount,
        from: 'new-investment',
        originalSource: originalSource
      } 
    });
  };

  const handleToggleOffering = () => {
    setShowOffering(!showOffering);
  };

  // Calculate reward amount and APY based on selected or hovered option
  const calculateRewardAmount = (optionId?: number) => {
    const targetOptionId = optionId || hoveredOption || selectedOption;
    const targetOpt = investmentOptions.find(opt => opt.id === targetOptionId);
    if (!targetOpt) return { amount: 0, frequency: 'day', apy: '7.8%' };

    const apyDecimal = parseFloat(targetOpt.apy) / 100;
    const yearlyReward = investAmount * apyDecimal;
    
    let rewardAmount = 0;
    let frequency = 'day';

    switch (targetOpt.rewardsFrequency.toLowerCase()) {
      case 'daily':
        rewardAmount = yearlyReward / 365;
        frequency = 'day';
        break;
      case 'weekly':
        rewardAmount = yearlyReward / 52;
        frequency = 'week';
        break;
      case 'monthly':
        rewardAmount = yearlyReward / 12;
        frequency = 'month';
        break;
      default:
        rewardAmount = yearlyReward / 365;
        frequency = 'day';
    }

    return {
      amount: rewardAmount,
      frequency: frequency,
      apy: targetOpt.apy,
      yearlyReturn: Math.round(investAmount * (1 + apyDecimal))
    };
  };

  const rewardInfo = calculateRewardAmount();

  return (
    <div className="fixed inset-0 bg-background">
      <PageHeader />

      {/* Content container */}
      <div className="h-full flex p-6 items-center justify-center">
        <div className="relative w-full max-w-7xl flex justify-center">
          {/* New Investment Card */}
          <motion.div
            animate={{
              marginTop: showOffering ? '-328px' : '0px',
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center flex-shrink-0 z-10"
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardDescription>New Investment</CardDescription>
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
                      <div className="w-full h-auto pt-6 pb-2 px-4 text-xl font-semibold bg-muted rounded-md flex items-center text-primary">
                        ${rewardInfo.yearlyReturn?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || '0'}
                      </div>
                      <span className="absolute left-4 top-2 text-xs text-muted-foreground font-medium">
                        Estimated Return (APY {rewardInfo.apy})
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-6">
                  <Button 
                    onClick={handleReviewOrder}
                    className="w-full h-12"
                    variant="default"
                    size="lg"
                  >
                    Review Order
                  </Button>

                  <div className="bg-subtle/50 rounded-lg space-y-4">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span>You'll receive ${rewardInfo.amount.toFixed(2)} every {rewardInfo.frequency}</span>
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
            
                    {/* Toggle Offering button */}
                    {!showOffering && (
                      <div className="w-full max-w-md mt-4">
                        <Button 
                          variant="secondary"
                          className="w-full h-12 flex items-center justify-center gap-2"
                          size="lg"
                          onClick={handleToggleOffering}
                        >
                          See the Offering
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
          </motion.div>

          {/* Investment Options Cards */}
          <AnimatePresence>
            {showOffering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                        className="absolute w-80 overflow-y-auto scrollbar-hide"
                        style={{ 
                          height: 'calc(100vh - 80px)',
                          top: '-328px',
                          left: 'calc(50% + 128px + 48px)'
                        }}
              >
                <div className="flex flex-col gap-4">
                  {investmentOptions.map((option, index) => {
                  const IconComponent = option.icon;
                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    >
                      <Card 
                        className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                          selectedOption === option.id 
                            ? 'border-2 border-primary bg-primary/5' 
                            : 'border border-border hover:border-primary/20'
                        }`}
                        onClick={() => setSelectedOption(option.id)}
                        onMouseEnter={() => setHoveredOption(option.id)}
                        onMouseLeave={() => setHoveredOption(null)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl ${option.bgColor}`}>
                              <IconComponent className={`h-6 w-6 ${option.color}`} />
                            </div>
                          </div>
                          <CardDescription className="text-lg font-semibold">{option.title}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">APY</span>
                              <span className="font-medium">{option.apy}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Rewards Frequency</span>
                              <span className="font-medium">{option.rewardsFrequency}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Fee</span>
                              <span className="font-medium">{option.fee}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom gradient overlay */}
          {showOffering && (
            <div 
              className="fixed bottom-0 left-0 right-0 pointer-events-none z-20"
              style={{
                height: '200px',
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
