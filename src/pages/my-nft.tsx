import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Heading2 } from '@/components/ui/typography';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";

export function MyNFT() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMinted, setIsMinted] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Button and How it works */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
        >
          How it works
        </Button>
      </div>

      {/* Vertical Stack in the Middle */}
      <div className="flex flex-col items-center justify-start min-h-[calc(100vh-200px)] space-y-6 pt-6 md:pt-0">
        {/* Circular Image */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-64 h-64 rounded-full overflow-hidden"
        >
          <img 
            src="./banner.png" 
            alt="Night sky scene" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.2, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center space-y-4"
        >
          <Heading2>
            {isMinted ? 'OROKAI-11x399q3' : "You don't have any OROKAI NFT yet."}
          </Heading2>
          {!isMinted && (
            <p className="text-foreground/80 max-w-sm mx-auto">
              You're earning rewards from your affiliate tree. If you want to transfer that affiliate tree to a different wallet then you need to mint your Orokai NFT first.
            </p>
          )}
          {isMinted && (
            <p className="text-foreground/80">
              This NFT entitles you to collect 10% commissions from the direct invites.
            </p>
          )}
        </motion.div>

        {/* Button */}
        {!isMinted && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.2, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Button
              size="lg"
              className="min-w-[200px]"
              onClick={() => setIsModalOpen(true)}
            >
              Mint Your Free NFT
            </Button>
          </motion.div>
        )}
      </div>

      {/* Mint NFT Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 bg-background border-border pb-6 md:pb-6 md:max-w-md" hideCloseButton>
          <DialogHeader className="w-full">
            <div className="relative w-full pt-6 px-6">
              {/* Custom Close button - positioned inside header for this specific design */}
              <DialogClose className="absolute right-4 top-4 h-10 w-10 flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10">
                <X className="h-4 w-4 text-foreground" />
                <span className="sr-only">Close</span>
              </DialogClose>

              {/* Circular gradient graphic */}
              <div className="flex justify-center mb-6">
                <div className="w-48 h-48 rounded-full overflow-hidden relative">
                  <div 
                    className="w-full h-full"
                    style={{
                      background: 'linear-gradient(to right, rgba(255, 255, 255, 0.9) 0%, rgba(20, 30, 40, 0.95) 100%)',
                      filter: 'blur(40px)',
                    }}
                  />
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                    }}
                  />
                  {/* Add noise texture */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                    }}
                  />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-center text-foreground mb-4 text-heading-2">
                Mint your NFT
              </h2>

              {/* Warning message */}
              <p className="block w-full text-center text-foreground/80 leading-relaxed mb-6">
                Once you mint your NFT, you cannot<br />
                change the distribution of your<br />
                commissions.
              </p>
            </div>
          </DialogHeader>

          {/* Confirm button */}
          <div className="px-6 pb-6">
            <Button
              onClick={() => {
                // Handle mint confirmation here
                setIsMinted(true);
                setIsModalOpen(false);
              }}
              variant="default"
              className="w-full h-12"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
