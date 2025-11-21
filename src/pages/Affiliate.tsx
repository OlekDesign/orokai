import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Caption, BodyText, Heading1, BodyTextLarge } from '@/components/ui/typography';
import { Copy, Check, ChevronDown, ChartSpline, FileCheck, Gift } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data for affiliate history with hierarchical structure
const affiliateHistory = [
  {
    id: '1',
    profileName: 'Alex Johnson',
    walletAddress: 'k3m9pq...x4n2',
    level: 1,
    percentage: 20,
    totalRewards: 1250.50,
    subAffiliates: [
      {
        id: '1-1',
        profileName: 'Megan Sandy',
        walletAddress: 'm5g2an...s4d7',
        level: 2,
        percentage: 15,
        totalRewards: 330.49,
        subAffiliates: [
          {
            id: '1-1-1',
            profileName: 'Luke Pachytel',
            walletAddress: 'l8k3pa...t2l9',
            level: 3,
            percentage: 10,
            totalRewards: 40.00,
            subAffiliates: []
          }
        ]
      },
      {
        id: '1-2',
        profileName: 'Carol Cox',
        walletAddress: 'c9r4ol...x6c8',
        level: 2,
        percentage: 15,
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
    percentage: 15,
    totalRewards: 850.25,
    subAffiliates: []
  },
  {
    id: '3',
    profileName: 'Michael Rodriguez',
    walletAddress: 'w5h8jk...m3v7',
    level: 1,
    percentage: 20,
    totalRewards: 625.75,
    subAffiliates: []
  },
  {
    id: '4',
    profileName: 'Emma Thompson',
    walletAddress: 'f9q4dx...y2k8',
    level: 3,
    percentage: 10,
    totalRewards: 385.50,
    subAffiliates: []
  },
];

export function Affiliate() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 1 | 2 | 3>('all');
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const [hideInactive, setHideInactive] = useState(false);
  const affiliateLink = 'https://platform.example.com/ref/user123';

  // Calculate counts for each level
  const totalAffiliates = affiliateHistory.length;
  const level1Count = affiliateHistory.filter(a => a.level === 1).length;
  const level2Count = affiliateHistory.filter(a => a.level === 2).length;
  const level3Count = affiliateHistory.filter(a => a.level === 3).length;

  // Filter affiliates based on selected level
  const filteredAffiliates = selectedLevel === 'all' 
    ? affiliateHistory 
    : affiliateHistory.filter(affiliate => affiliate.level === selectedLevel);

  // Level options for dropdown
  const levelOptions = [
    { key: 'all', label: 'All levels', count: totalAffiliates },
    { key: 1, label: 'Level 1', count: level1Count },
    { key: 2, label: 'Level 2', count: level2Count },
    { key: 3, label: 'Level 3', count: level3Count },
  ];

  const selectedOption = levelOptions.find(option => option.key === selectedLevel) || levelOptions[0];

  // Recursive component to render affiliate cards
  const AffiliateCard = ({ affiliate, depth = 0 }: { affiliate: any; depth?: number }) => {
    const hasSubAffiliates = affiliate.subAffiliates && affiliate.subAffiliates.length > 0;

    return (
      <Card key={affiliate.id} className="border border-border hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-0">
          {/* Parent affiliate row */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <Avatar name={affiliate.profileName} size="sm" className="w-8 h-8" />
              <div>
                <BodyText className="text-foreground text-sm">
                  {affiliate.profileName}
                </BodyText>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="min-w-[80px]">
                <BodyText className="text-foreground text-sm">
                  {affiliate.percentage}%
                </BodyText>
              </div>
              <div className="min-w-[100px]">
                <BodyText className="text-foreground text-sm">
                  ${affiliate.totalRewards.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </BodyText>
              </div>
            </div>
          </div>
          
          {/* Render sub-affiliates inside the same card - always visible */}
          {hasSubAffiliates && (
            <div className="border-t border-border/50">
              {affiliate.subAffiliates.map((subAffiliate: any, index: number) => (
                <div key={subAffiliate.id}>
                  <SubAffiliateRow affiliate={subAffiliate} depth={depth + 1} />
                  {index < affiliate.subAffiliates.length - 1 && (
                    <div className="border-t border-border mx-4" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Component for rendering sub-affiliates within parent cards
  const SubAffiliateRow = ({ affiliate, depth }: { affiliate: any; depth: number }) => {
    const hasSubAffiliates = affiliate.subAffiliates && affiliate.subAffiliates.length > 0;
    const paddingLeft = depth * 20 + 16; // Increased indentation per level + base padding

    return (
      <div>
        {/* Sub-affiliate row */}
         <div 
           className="flex items-center justify-between py-3 pr-4" 
           style={{ paddingLeft: `${paddingLeft}px` }}
         >
          <div className="flex items-center space-x-3">
            <Avatar name={affiliate.profileName} size="sm" className="w-8 h-8" />
            <div>
              <BodyText className="text-foreground text-sm">
                {affiliate.profileName}
              </BodyText>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="min-w-[80px]">
              <BodyText className="text-foreground text-sm">
                {affiliate.percentage}%
              </BodyText>
            </div>
            <div className="min-w-[100px]">
              <BodyText className="text-foreground text-sm">
                ${affiliate.totalRewards.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </BodyText>
            </div>
          </div>
        </div>
        
        {/* Render nested sub-affiliates - always visible */}
        {hasSubAffiliates && (
          <div>
            <div className="border-t border-border/50 mx-4" />
            {affiliate.subAffiliates.map((nestedAffiliate: any, index: number) => (
              <div key={nestedAffiliate.id}>
                <SubAffiliateRow affiliate={nestedAffiliate} depth={depth + 1} />
                {index < affiliate.subAffiliates.length - 1 && (
                  <div className="border-t border-border/50 mx-4" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
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
                <CardDescription>Total Affiliate Rewards</CardDescription>
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
              <CardDescription>My Commissions</CardDescription>
              <div className="flex items-baseline gap-2 mt-1">
                <Heading1>10%</Heading1>
                <Caption className="text-foreground">of Direct invites</Caption>
              </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 -ml-3"
                  onClick={() => navigate('/affiliate-program')}
                >
                  <Gift className="h-4 w-4" />
                  Unlock higher commissions
                </Button>
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
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm h-10 text-foreground truncate"
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
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between gap-3">
              <CardDescription>My affiliates</CardDescription>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
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
            {/* Header Row */}
            <div className="flex items-center justify-between px-4 py-3 mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8"></div> {/* Avatar space */}
                <Caption>Affiliate</Caption>
              </div>
              <div className="flex items-center space-x-4">
                <div className="min-w-[80px]">
                  <Caption>Commission</Caption>
                </div>
                <div className="min-w-[100px]">
                  <Caption>Total Rewards</Caption>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredAffiliates.map((affiliate) => (
                <AffiliateCard key={affiliate.id} affiliate={affiliate} depth={0} />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}
