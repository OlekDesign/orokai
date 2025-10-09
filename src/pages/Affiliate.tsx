import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Caption, BodyText, Heading1, BodyTextLarge } from '@/components/ui/typography';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for affiliate history
const affiliateHistory = [
  {
    id: '1',
    profileName: 'Alex Johnson',
    walletAddress: 'k3m9pq...x4n2',
    level: 1,
    totalRewards: 1250.50,
  },
  {
    id: '2',
    profileName: 'Sarah Chen',
    walletAddress: 'r7t2nh...p9m4',
    level: 2,
    totalRewards: 850.25,
  },
  {
    id: '3',
    profileName: 'Michael Rodriguez',
    walletAddress: 'w5h8jk...m3v7',
    level: 1,
    totalRewards: 625.75,
  },
  {
    id: '4',
    profileName: 'Emma Thompson',
    walletAddress: 'f9q4dx...y2k8',
    level: 3,
    totalRewards: 385.50,
  },
];

export function Affiliate() {
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="relative overflow-hidden rounded-2xl border border-border">
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ 
              backgroundImage: `url(${import.meta.env.BASE_URL}affiliate.png)`,
            }} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 pointer-events-none" />
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            className="relative px-8 pb-8 flex flex-col items-center justify-end min-h-[300px]"
          >
            <div className="max-w-md text-center ">
              <Heading1 className="mb-4 ">They Win and You Win</Heading1>
              <BodyText className="mb-6">
                Share your affiliate link with friends and earn a percentage of their transactions. 
              </BodyText>
            </div>
            <div className="flex items-center space-x-4 w-full max-w-md">
              <input
                type="text"
                value={affiliateLink}
                readOnly
                className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-md text-sm h-10 text-white placeholder-white/70 shadow-lg"
              />
              <Button
                onClick={copyToClipboard}
                variant="default"
                className="flex items-center gap-2 h-10 px-4"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="hidden sm:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="hidden sm:inline">Copy link</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </Card>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      >
        <Card>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
          >
            <CardHeader className="pb-4">
              <div>
                <CardDescription>Total Affiliate Rewards</CardDescription>
                <Heading1 className="mt-1">
                  ${(3112).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Heading1>
              </div>
            </CardHeader>
            <Separator />
            <div className="px-6 py-4">
              <div className="flex items-center justify-between gap-3">
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
            <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {/* Desktop Header (full columns) */}
                <TableRow className="hidden md:table-row hover:bg-transparent">
                  <TableHead><Caption>Affiliate</Caption></TableHead>
                  <TableHead><Caption>Level</Caption></TableHead>
                  <TableHead><Caption>Rewards</Caption></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAffiliates.map((affiliate) => (
                  <>
                    {/* Mobile Layout (default) */}
                    <TableRow key={`${affiliate.id}-mobile`} className="md:hidden hover:bg-transparent">
                      <TableCell className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar name={affiliate.profileName} size="sm" className="w-8 h-8" />
                            <div>
                              <BodyText className="text-foreground font-medium">
                                {affiliate.profileName}
                              </BodyText>
                              <Caption className="text-muted-foreground">
                                {affiliate.walletAddress}
                              </Caption>
                            </div>
                          </div>
                          <div className="text-right">
                            <BodyText className="text-foreground font-medium">
                              ${affiliate.totalRewards.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </BodyText>
                            <div className="flex justify-end mt-1">
                              <span className={cn(
                                "inline-block px-2 py-1 rounded-full w-fit text-xs font-light leading-none",
                                affiliate.level === 1 && "bg-primary/30 text-primary",
                                affiliate.level === 2 && "bg-primary/20 text-primary",
                                affiliate.level === 3 && "bg-primary/10 text-primary"
                              )}>
                                Level {affiliate.level}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Desktop Layout (md and up) */}
                    <TableRow key={`${affiliate.id}-desktop`} className="hidden md:table-row hover:bg-transparent">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar name={affiliate.profileName} size="sm" className="w-8 h-8" />
                          <div className="space-y-1">
                            <BodyText>
                              {affiliate.profileName}
                            </BodyText>
                            <Caption>
                              {affiliate.walletAddress}
                            </Caption>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-fit">
                        <BodyText className={cn(
                          "px-2 py-1 rounded-full font-medium inline-block",
                          affiliate.level === 1 && "bg-primary/30 text-primary",
                          affiliate.level === 2 && "bg-primary/20 text-primary",
                          affiliate.level === 3 && "bg-primary/10 text-primary"
                        )}>
                          Level {affiliate.level}
                        </BodyText>
                      </TableCell>
                      <TableCell className="w-fit">
                        <BodyText>
                          ${affiliate.totalRewards.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </BodyText>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>

    </div>
  );
}
