import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Caption, BodyText } from '@/components/ui/typography';
import { Copy, Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
    user: 'k3m9pq...x4n2',
    level: 1,
    totalRewards: 1250.50,
  },
  {
    id: '2',
    user: 'r7t2nh...p9m4',
    level: 2,
    totalRewards: 850.25,
  },
  {
    id: '3',
    user: 'w5h8jk...m3v7',
    level: 1,
    totalRewards: 625.75,
  },
  {
    id: '4',
    user: 'f9q4dx...y2k8',
    level: 3,
    totalRewards: 385.50,
  },
];

export function Affiliate() {
  const [copied, setCopied] = useState(false);
  const affiliateLink = 'https://platform.example.com/ref/user123';

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
        <Card>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          >
            <CardHeader>
              <div>
                <CardDescription>Total Affiliate Rewards</CardDescription>
                <h1 className="text-heading-1 text-foreground mt-1">
                  ${(3112).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </h1>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={affiliateLink}
              readOnly
              className="flex-1 px-3 py-2 bg-accent rounded-md text-sm"
            />
            <Button
              onClick={copyToClipboard}
              variant="secondary"
              className="flex items-center gap-2"
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
          </div>
            </CardContent>
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
            <CardHeader>
              <CardDescription>Your Affiliation History</CardDescription>
            </CardHeader>
            <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Caption>Affiliated User</Caption></TableHead>
                  <TableHead><Caption>Level of Affiliation</Caption></TableHead>
                  <TableHead><Caption>Total Rewards</Caption></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliateHistory.map((affiliate) => (
                  <TableRow key={affiliate.id}>
                    <TableCell>
                      <BodyText className="font-medium">
                        {affiliate.user}
                      </BodyText>
                    </TableCell>
                    <TableCell>
                      <BodyText className={cn(
                        "px-2 py-1 rounded-full font-medium",
                        affiliate.level === 1 && "bg-primary/30 text-primary",
                        affiliate.level === 2 && "bg-primary/20 text-primary",
                        affiliate.level === 3 && "bg-primary/10 text-primary"
                      )}>
                        {affiliate.level}
                      </BodyText>
                    </TableCell>
                    <TableCell>
                      <BodyText>
                        ${affiliate.totalRewards.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </BodyText>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
        <Card className="relative overflow-hidden min-h-[300px] flex items-end">
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ 
              backgroundImage: `url(${import.meta.env.BASE_URL}affiliate.png)`,
            }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
          >
            <CardHeader className="relative z-20 pb-12">
              <CardTitle className="text-left text-2xl text-white">Grow Your Passive Income Network</CardTitle>
              <CardDescription className="text-left mt-3 max-w-[40%] text-white/80">
                Share your affiliate link with friends and earn a percentage of their transactions. The more friends you bring, 
                the more passive income you generate. Your affiliates help you earn while they earn - it's a win-win for everyone 
                in your network.
              </CardDescription>
            </CardHeader>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
