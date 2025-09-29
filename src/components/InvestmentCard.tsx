import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Heading2 } from "@/components/ui/typography";

interface Investment {
  id: string;
  amount: number;
  earned: number;
  apy: number;
  chain: string;
  startDate: string;
}

interface InvestmentCardProps {
  investment: Investment;
  onWithdraw: (investmentId: string) => void;
}

export function InvestmentCard({ investment, onWithdraw }: InvestmentCardProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Helper function to calculate time since investment start
  const getTimeSince = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  };

  const handleWithdrawClick = () => {
    setIsWithdrawing(true);
  };

  const handleWithdrawConfirm = () => {
    onWithdraw(investment.id);
    setIsWithdrawing(false);
  };

  const handleBackClick = () => {
    setIsWithdrawing(false);
  };

  const timeSince = getTimeSince(investment.startDate);

  return (
    <motion.div className="w-full">
      <Card className="w-full">
        <CardContent className="px-6 pb-6 pt-8 sm:pt-8 flex flex-col">
          {isWithdrawing ? (
            <div className="flex flex-col">
              {/* Back button */}
              <div className="flex justify-start mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackClick}
                  className="rounded-full hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="flex flex-col space-y-6">
                <div className="space-y-4">
                  <Heading2 >Close Investment</Heading2>
                  <p className="text-muted-foreground text-sm leading-relaxed text-left">
                    Your funds will be available in Wallet once you close the investment within a couple of minutes. Do you want to proceed?
                  </p>
                </div>
                <Button
                  onClick={handleWithdrawConfirm}
                  className="w-full"
                >
                  Confirm
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <div>
                  <CardDescription>{investment.chain}</CardDescription>
                  <p className="text-heading-2  mt-1 text-white">
                    ${investment.amount.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Since</span>
                    <span className="font-medium">{timeSince.days}d {timeSince.hours}h</span>
                  </div>
                  
                  <div className="h-[1px] bg-border opacity-30" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">APY</span>
                    <span className="font-medium">{investment.apy}%</span>
                  </div>
                  
                  <div className="h-[1px] bg-border opacity-30" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rewards so far</span>
                    <span className="font-medium">${investment.earned.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</span>
                  </div>
                  
                  <div className="h-[1px] bg-border opacity-30" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next reward</span>
                    <span className="text-white">3h 32min</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Progress value={20} className="h-2" />
                </div>
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    onClick={handleWithdrawClick}
                    className="w-full"
                  >
                    Close Investment
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
