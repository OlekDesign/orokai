import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Shield, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading1, Heading2, BodyTextLarge, BodyTextSmall, Caption } from '@/components/ui/typography';
import { motion } from 'framer-motion';
import { useUserProfile } from '../contexts/UserProfileContext';
import { InvestmentCard } from "@/components/InvestmentCard";

export function Investments() {
  const navigate = useNavigate();
  const { investments, removeInvestment, setClosedInvestmentAmount } = useUserProfile();

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const handleWithdraw = (investmentId: string) => {
    // Find the investment before removing it to store its amount
    const investment = investments.find(inv => inv.id === investmentId);
    if (investment) {
      setClosedInvestmentAmount(investment.amount);
      removeInvestment(investmentId);
    }
  };

  // Passive income options data
  const passiveIncomeOptions = [
    {
      id: 1,
      title: "DeFi Staking",
      description: "Stake your crypto assets in decentralized protocols for consistent returns",
      apy: "7.8%",
      minAmount: 1000,
      risk: "Medium",
      duration: "Flexible",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/5"
    },
    {
      id: 2,
      title: "Liquidity Pools",
      description: "Provide liquidity to DEX pools and earn fees from trading activity",
      apy: "12.4%",
      minAmount: 2500,
      risk: "High",
      duration: "30+ days",
      icon: Shield,
      color: "text-info",
      bgColor: "bg-info/5"
    },
    {
      id: 3,
      title: "Yield Farming",
      description: "Maximize returns through automated yield optimization strategies",
      apy: "15.2%",
      minAmount: 5000,
      risk: "High",
      duration: "60+ days",
      icon: Clock,
      color: "text-primary",
      bgColor: "bg-primary/5"
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Banner Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            className="relative px-8 py-12"
          >
            <div className="max-w-2xl">
              <Heading1 className="mb-4">
                Passive Income Starts Here
              </Heading1>
              <BodyTextLarge className="text-muted-foreground mb-8">
                Define how much you want to invest and choose from our carefully curated investment options. 
                Our platform automatically manages your portfolio, reinvests earnings, and optimizes returns 
                so you can earn passive income without the complexity of managing individual positions.
              </BodyTextLarge>
              <Button 
                onClick={() => navigate('/new-investment', {
                  state: { originalSource: 'investments' }
                })}
                className="w-auto h-12"
                variant="default"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Investment
              </Button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 right-8 w-64 h-64 bg-gradient-to-tl from-primary/5 to-transparent rounded-full blur-2xl translate-y-1/2" />
          </motion.div>
        </div>
      </motion.div>

      {/* Passive Income Cards Grid - Hidden */}
      {false && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <Heading2>Investment Options</Heading2>
            <BodyTextSmall className="text-muted-foreground">
              {investments.length} active {investments.length === 1 ? 'investment' : 'investments'}
            </BodyTextSmall>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {passiveIncomeOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full"
                >
                  <Card 
                    className="h-full cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
                    onClick={() => navigate('/transaction-review', { 
                      state: { 
                        selectedOption: option,
                        amount: option.minAmount 
                      } 
                    })}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl ${option.bgColor}`}>
                          <IconComponent className={`h-6 w-6 ${option.color}`} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{option.apy}</div>
                          <span className="text-caption">APY</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{option.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm leading-relaxed">
                        {option.description}
                      </CardDescription>
                      
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Minimum</span>
                          <span className="font-medium">${option.minAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Risk Level</span>
                          <span className={`font-medium ${
                            option.risk === 'Low' ? 'text-success' :
                            option.risk === 'Medium' ? 'text-warning' :
                            'text-destructive'
                          }`}>
                            {option.risk}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">{option.duration}</span>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-4" variant="secondary">
                        Start Earning
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Investments Section */}
      {investments.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="space-y-4 sm:space-y-6"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
          >
            <Heading2>Your Passive Income</Heading2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
              {[...investments]
              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
              .map((investment) => (
                <InvestmentCard
                  key={investment.id}
                  investment={investment}
                  onWithdraw={handleWithdraw}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}