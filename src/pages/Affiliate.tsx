import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Caption, BodyText, Heading1, BodyTextLarge } from '@/components/ui/typography';
import { Copy, Check, ChevronDown, ChartSpline, FileCheck, Gift, Settings2, Minus, Plus } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// Mock data for affiliate history with hierarchical structure
const affiliateHistory = [
  {
    id: '1',
    profileName: 'Alex Johnson',
    walletAddress: 'k3m9pq...x4n2',
    level: 1,
    percentage: 10,
    totalRewards: 1250.50,
    subAffiliates: [
      {
        id: '1-1',
        profileName: 'Megan Sandy',
        walletAddress: 'm5g2an...s4d7',
        level: 2,
        percentage: 0,
        totalRewards: 0.00,
        subAffiliates: [
          {
            id: '1-1-1',
            profileName: 'Luke Pachytel',
            walletAddress: 'l8k3pa...t2l9',
            level: 3,
            percentage: 0,
            totalRewards: 0.00,
            subAffiliates: []
          }
        ]
      },
      {
        id: '1-2',
        profileName: 'Carol Cox',
        walletAddress: 'c9r4ol...x6c8',
        level: 2,
        percentage: 0,
        totalRewards: 0.00,
        subAffiliates: []
      }
    ]
  },
  {
    id: '2',
    profileName: 'Sarah Chen',
    walletAddress: 'r7t2nh...p9m4',
    level: 2,
    percentage: 0,
    totalRewards: 0.00,
    subAffiliates: []
  },
  {
    id: '3',
    profileName: 'Michael Rodriguez',
    walletAddress: 'w5h8jk...m3v7',
    level: 1,
    percentage: 10,
    totalRewards: 625.75,
    subAffiliates: []
  },
  {
    id: '4',
    profileName: 'Emma Thompson',
    walletAddress: 'f9q4dx...y2k8',
    level: 3,
    percentage: 0,
    totalRewards: 0.00,
    subAffiliates: []
  },
];

export function Affiliate() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 1 | 2 | 3>('all');
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const [hideInactive, setHideInactive] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [directInvites, setDirectInvites] = useState(10);
  const [indirectInvites, setIndirectInvites] = useState(0);
  const [theirInvites, setTheirInvites] = useState(0);
  const affiliateLink = 'https://platform.example.com/ref/user123';

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

  // Calculate counts for each level (flatten all affiliates including sub-affiliates)
  const flattenAffiliates = (affiliates: any[]): any[] => {
    return affiliates.reduce((acc: any[], affiliate: any) => {
      acc.push(affiliate);
      if (affiliate.subAffiliates && affiliate.subAffiliates.length > 0) {
        acc.push(...flattenAffiliates(affiliate.subAffiliates));
      }
      return acc;
    }, []);
  };

  const allAffiliates = flattenAffiliates(affiliateHistory);
  const totalAffiliates = allAffiliates.length;
  const level1Count = allAffiliates.filter(a => a.level === 1).length;
  const level2Count = allAffiliates.filter(a => a.level === 2).length;
  const level3Count = allAffiliates.filter(a => a.level === 3).length;

  // Filter affiliates based on selected level
  const filteredAffiliates = selectedLevel === 'all' 
    ? allAffiliates 
    : allAffiliates.filter(affiliate => affiliate.level === selectedLevel);

  // Level options for dropdown
  const levelOptions = [
    { key: 'all', label: 'All invites', count: totalAffiliates },
    { key: 1, label: 'Level 1', count: level1Count },
    { key: 2, label: 'Level 2', count: level2Count },
    { key: 3, label: 'Level 3', count: level3Count },
  ];

  const selectedOption = levelOptions.find(option => option.key === selectedLevel) || levelOptions[0];

  // Component to render each affiliate as a table row
  const AffiliateRow = ({ affiliate }: { affiliate: any }) => {
    return (
      <TableRow>
        <TableCell>
          <div className="flex items-center space-x-3">
            <Avatar name={affiliate.profileName} size="sm" className="w-8 h-8" />
            <BodyText className="text-foreground text-sm">
              {affiliate.profileName}
            </BodyText>
          </div>
        </TableCell>
        <TableCell>
          <BodyText className={affiliate.percentage === 0 ? "text-muted-foreground text-sm" : "text-foreground text-sm"}>
            {affiliate.percentage}%
          </BodyText>
        </TableCell>
        <TableCell>
          <BodyText className={affiliate.totalRewards === 0 ? "text-muted-foreground text-sm" : "text-foreground text-sm"}>
            ${affiliate.totalRewards.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </BodyText>
        </TableCell>
      </TableRow>
    );
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6">

      {/* Two Cards Layout */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-6"
      >
        <div className="space-y-6">
          {/* First Row - Cards 1 and 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1 - Total Affiliate Rewards */}
            <Card className="border border-border">
              <CardHeader className="flex-shrink-0">
                <CardDescription>Total affiliate rewards</CardDescription>
                <Heading1 className="mt-1">
                  ${(3112).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Heading1>
              </CardHeader>
              <CardContent>
                {/* Label buttons below value */}
                <div className="flex gap-2 -ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => navigate('/affiliate-analytics')}
                  >
                    <ChartSpline className="h-4 w-4" />
                    Analytics
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => navigate('/my-nft')}
                  >
                    <FileCheck className="h-4 w-4" />
                    My NFT
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 - My Commissions */}
            <Card className="border border-border">
              <CardHeader className="flex-shrink-0">
              <CardDescription>My commissions</CardDescription>
              <div className="flex items-baseline gap-2 mt-1">
                <Heading1>10%</Heading1>
                <Caption className="text-foreground">of direct invites</Caption>
              </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 -ml-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Settings2 className="h-4 w-4" />
                    Adjust
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => navigate('/affiliate-program')}
                  >
                    <Gift className="h-4 w-4" />
                    Unlock higher commissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Row - Card 3 Full Width */}
          <Card className="border border-border">
            <CardHeader className="flex-shrink-0">
              <CardDescription>My unique link</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1">
                <input
                  type="text"
                  value={affiliateLink}
                  readOnly
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm h-10 text-muted-foreground truncate"
                />
              </div>
              <Button
                onClick={copyToClipboard}
                variant="default"
                className="flex items-center gap-2 sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy link
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* My Affiliates Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card className="border border-border">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{ duration: 0.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between gap-3">
                <CardDescription>My affiliates</CardDescription>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHideInactive(!hideInactive)}
                    className="text-sm"
                  >
                    {hideInactive ? 'Show Inactive' : 'Hide Inactive'}
                  </Button>
                  <div className="relative w-48">
                    <button
                      onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                      className="w-full px-4 py-2 bg-secondary rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium">{selectedOption.label}</span>
                        <div className="flex items-center gap-2">
                          <Caption className="text-muted-foreground text-xs">({selectedOption.count})</Caption>
                          <ChevronDown size={16} className={`transition-transform ${isLevelDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </button>

                    {isLevelDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-secondary rounded-lg shadow-md border border-border py-1 z-50">
                        {levelOptions.map(option => (
                          <button
                            key={option.key}
                            onClick={() => {
                              setSelectedLevel(option.key as 'all' | 1 | 2 | 3);
                              setIsLevelDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2 hover:bg-muted transition-colors ${
                              option.key === selectedLevel ? 'bg-muted' : ''
                            }`}
                          >
                            <span className="text-sm">{option.label}</span>
                            <Caption className="text-muted-foreground text-xs">({option.count})</Caption>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    {/* Desktop Header (full columns) */}
                    <TableRow className="hidden md:table-row">
                      <TableHead><Caption>Affiliate</Caption></TableHead>
                      <TableHead><Caption>Commission</Caption></TableHead>
                      <TableHead><Caption>Total Rewards</Caption></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAffiliates.map((affiliate) => (
                      <AffiliateRow key={affiliate.id} affiliate={affiliate} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>

      {/* Commission Settings Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="pt-6 px-6 pb-10 md:p-6 md:max-w-md">
          <div className="flex flex-row items-start mb-4">
            <div className="flex flex-col">
              <h2 className="text-heading-1 text-foreground">{pointsLeft}</h2>
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
