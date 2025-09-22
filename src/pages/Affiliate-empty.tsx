import { useState } from 'react';
import { cn } from "@/lib/utils";
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

export default function AffiliateEmpty() {
  const [copied, setCopied] = useState(false);
  const affiliateLink = 'https://platform.example.com/ref/user123';

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
      <Card>
        <CardHeader>
          <div>
            <CardDescription>Total Affiliate Rewards</CardDescription>
            <h1 className="text-heading-1 text-foreground mt-1">
              Let's start affiliating
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
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Your Affiliation History</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No affiliation history yet.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden min-h-[300px] flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: `url(${import.meta.env.BASE_URL}affiliate-network.jpg)`,
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
        <CardHeader className="relative z-20 pb-12">
          <CardTitle className="text-left text-2xl text-white">Grow Your Passive Income Network</CardTitle>
          <CardDescription className="text-left mt-3 max-w-[40%] text-white/80">
            Share your affiliate link with friends and earn a percentage of their transactions. The more friends you bring, 
            the more passive income you generate. Your affiliates help you earn while they earn - it's a win-win for everyone 
            in your network.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
