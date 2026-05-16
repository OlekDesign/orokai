import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
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
import { Button } from "@/components/ui/button";
import { Heading1, Heading3, Heading4, Caption } from '@/components/ui/typography';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CryptoIcon } from "@/components/CryptoIcon";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useUserProfile } from '../contexts/UserProfileContext';
import { useToast } from '../contexts/ToastContext';
import { useTransactions } from '../contexts/TransactionsContext';

export function Investments() {
  const navigate = useNavigate();
  const { investments, removeInvestment, setClosedInvestmentAmount } = useUserProfile();
  const { showToast } = useToast();
  const { addTransaction } = useTransactions();

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [investmentToClose, setInvestmentToClose] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const handleWithdraw = (investmentId: string) => {
    setInvestmentToClose(investmentId);
    setIsCloseModalOpen(true);
  };

  const handleCloseModalCancel = () => {
    setIsCloseModalOpen(false);
    setInvestmentToClose(null);
  };

  const handleCloseModalConfirm = async () => {
    if (!investmentToClose) return;
    
    setIsClosing(true);
    
    // Find the investment before removing it to store its amount and create transaction
    const investment = investments.find(inv => inv.id === investmentToClose);
    
    if (investment) {
      // Create closure transaction (initially pending, will auto-complete after 10s)
      const token = getTokenForChain(investment.chain);
      addTransaction('closure', investment.amount, token);
      
      setClosedInvestmentAmount(investment.amount);
    }
    
    // Simulate API call delay
    setTimeout(() => {
      if (investment) {
        removeInvestment(investmentToClose);
        
        // Show success toast
        showToast(
          'success',
          'Investment Closed',
          'Your funds will be available in your wallet within a couple of minutes.'
        );
      }
      
      setIsClosing(false);
      setIsCloseModalOpen(false);
      setInvestmentToClose(null);
    }, 1500);
  };

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        const buttonRef = menuRefs.current[openMenuId];
        const menuElement = document.getElementById(`menu-${openMenuId}`);
        if (buttonRef && !buttonRef.contains(event.target as Node) && 
            menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
          setMenuPosition(null);
        }
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Update menu position on scroll/resize
  useEffect(() => {
    const updatePosition = () => {
      if (openMenuId) {
        const buttonRef = menuRefs.current[openMenuId];
        if (buttonRef) {
          const rect = buttonRef.getBoundingClientRect();
          setMenuPosition({
            top: rect.bottom + window.scrollY + 4,
            left: rect.right + window.scrollX - 180 // 180px is min-w-[180px]
          });
        }
      }
    };

    if (openMenuId) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [openMenuId]);

  // Map chain to token symbol
  const getTokenForChain = (chain: string): string => {
    const chainToTokenMap: Record<string, string> = {
      'Ethereum': 'ETH',
      'Solana': 'SOL',
      'Bitcoin': 'BTC',
      'Cosmos': 'ATOM',
      'Agoric': 'ATOM',
      'Aptos': 'APT',
      'Avalanche': 'AVAX',
      'Axelar': 'AXL',
      'BNB Smart Chain': 'BNB',
      'Cardano': 'ADA',
      'Celo': 'CELO',
      'Flow': 'FLOW'
    };
    return chainToTokenMap[chain] || 'USDT'; // Default to USDT if chain not found
  };

  // Helper function to calculate next reward value and time
  const getNextReward = (investment: { amount: number; apy: number; startDate: string }) => {
    // Calculate daily reward: (amount * apy / 100) / 365
    const dailyReward = (investment.amount * investment.apy / 100) / 365;
    
    // Calculate time until next reward (assuming 24h cycle)
    // Use a fixed offset from start date to simulate next reward time
    const startTime = new Date(investment.startDate).getTime();
    const now = Date.now();
    const hoursSinceStart = (now - startTime) / (1000 * 60 * 60);
    const hoursUntilNextReward = 24 - (hoursSinceStart % 24);
    
    const hours = Math.floor(hoursUntilNextReward);
    const minutes = Math.floor((hoursUntilNextReward - hours) * 60);
    
    return {
      value: dailyReward,
      time: `${hours}h ${minutes}min`
    };
  };

  // Helper function to calculate time since investment start
  const getTimeSince = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  };


  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="border border-border">
        <CardHeader className="flex-shrink-0">
          <CardDescription>Total invested</CardDescription>
          <Heading1 className="mt-1 tabular-nums">
            ${totalInvested.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Heading1>
        </CardHeader>
      </Card>

      <Button
        className="w-full"
        size="lg"
        onClick={() => navigate('/invest/new')}
      >
        New Passive Income
      </Button>

      {/* Active Investments Section */}
      {investments.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.2, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-4 sm:space-y-6"
        >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          transition={{ duration: 0.2, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Desktop Card Layout */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardDescription>Your passive income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><Caption>Provider</Caption></TableHead>
                      <TableHead><Caption>Investment</Caption></TableHead>
                      <TableHead><Caption>Active since</Caption></TableHead>
                      <TableHead><Caption>APY</Caption></TableHead>
                      <TableHead><Caption>Next reward</Caption></TableHead>
                      <TableHead><Caption>All rewards</Caption></TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
            {[...investments]
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .map((investment) => {
                      const timeSince = getTimeSince(investment.startDate);
                      return (
                        <TableRow key={investment.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CryptoIcon symbol={investment.chain === 'Ethereum' ? 'ETH' : 'BTC'} size={16} />
                              <span className="font-medium">{investment.chain}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">${investment.amount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{timeSince.days}d {timeSince.hours}h</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{investment.apy}%</span>
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const nextReward = getNextReward(investment);
                              return (
                                <span className="font-medium">
                                  ${nextReward.value.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })} in {nextReward.time}
                                </span>
                              );
                            })()}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-success">
                              ${investment.earned.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              ref={(el) => { menuRefs.current[investment.id] = el; }}
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (openMenuId === investment.id) {
                                  setOpenMenuId(null);
                                  setMenuPosition(null);
                                } else {
                                  const buttonRef = menuRefs.current[investment.id];
                                  if (buttonRef) {
                                    const rect = buttonRef.getBoundingClientRect();
                                    setMenuPosition({
                                      top: rect.bottom + window.scrollY + 4,
                                      left: rect.right + window.scrollX - 180
                                    });
                                    setOpenMenuId(investment.id);
                                  }
                                }
                              }}
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                            {openMenuId === investment.id && menuPosition && createPortal(
                              <AnimatePresence>
                                <motion.div
                                  id={`menu-${investment.id}`}
                                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                                  style={{
                                    position: 'fixed',
                                    top: `${menuPosition.top}px`,
                                    left: `${menuPosition.left}px`,
                                    zIndex: 50
                                  }}
                                  className="bg-popover rounded-lg shadow-lg border border-border py-1 min-w-[180px]"
                                >
                                  <button
                                    onClick={() => {
                                      handleWithdraw(investment.id);
                                      setOpenMenuId(null);
                                      setMenuPosition(null);
                                    }}
                                    className="w-full flex items-center px-4 py-2 hover:bg-muted transition-colors text-left text-sm"
                                  >
                                    Close this investment
                                  </button>
                                </motion.div>
                              </AnimatePresence>,
                              document.body
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Flex Layout */}
          <div className="md:hidden flex flex-col space-y-4">
            <Heading3>Your Passive Income</Heading3>
            <div className="space-y-3">
              {[...investments]
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                .map((investment) => {
                  const timeSince = getTimeSince(investment.startDate);
                  return (
                    <Card key={investment.id} className="border">
                      <CardContent className="p-4">
                        {/* Title */}
                        <div className="flex items-center justify-between mb-[28px]">
                          <div className="flex items-center gap-2">
                            <CryptoIcon symbol={investment.chain === 'Ethereum' ? 'ETH' : 'BTC'} size={16} />
                            <Heading4>{investment.chain}</Heading4>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleWithdraw(investment.id)}
                          >
                            Close
                          </Button>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-2 gap-x-4 text-sm my-2">
                          <div className="text-muted-foreground">Investment</div>
                          <div className="font-medium text-right">${investment.amount.toLocaleString()}</div>
                          
                          <div className="text-muted-foreground mt-6">Active since</div>
                          <div className="font-medium text-right mt-6">{timeSince.days}d {timeSince.hours}h</div>
                          
                          <div className="text-muted-foreground mt-6">APY</div>
                          <div className="font-medium text-right mt-6">{investment.apy}%</div>
                          
                          <div className="text-muted-foreground mt-6">Next reward</div>
                          <div className="font-medium text-right mt-6">
                            {(() => {
                              const nextReward = getNextReward(investment);
                              return (
                                <span>
                                  ${nextReward.value.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })} in {nextReward.time}
                                </span>
                              );
                            })()}
                          </div>
                          
                          <div className="text-muted-foreground mt-6">All rewards</div>
                          <div className="font-bold text-right text-success mt-6">
                            ${investment.earned.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        </motion.div>
        </motion.div>
      )}

      {/* Close Investment Modal */}
      <ConfirmationModal
        isOpen={isCloseModalOpen}
        onClose={handleCloseModalCancel}
        onConfirm={handleCloseModalConfirm}
        isLoading={isClosing}
      />
    </div>
  );
}