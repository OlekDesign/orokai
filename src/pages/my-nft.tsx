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
            {isMinted ? 'OROKAI-11x399q3' : "Your Orokai NFT is not minted yet"}
          </Heading2>
          {!isMinted && (
            <p className="text-muted-foreground max-w-sm mx-auto">
              You're earning rewards from your affiliate tree. You can sell the rights to these rewards or transfer it to another wallet. Get your Orokai NFT to do that.
            </p>
          )}
          {isMinted && (
            <p className="text-muted-foreground max-w-md mx-auto">
              Owning this NFT gives you the rights to collect rewards from the affiliate tree attributed to it. You can list this NFT on a market to sell or transfer it to another wallet.
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
              Get Orokai NFT
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

              {/* Title */}
              <h2 className="text-left text-foreground mb-4 text-heading-2">
                Lock the % distribution
              </h2>

              {/* Warning message */}
              <p className="block w-full text-left text-foreground/80 leading-relaxed mb-6">
                Once you mint your NFT, you cannot change the distribution of your commissions.
              </p>
            </div>
          </DialogHeader>

          {/* Action buttons */}
          <div className="px-6 pb-0 flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 h-12"
              onClick={() => setIsModalOpen(false)}
            >
              Nevermind
            </Button>
            <Button
              onClick={() => {
                // Handle mint confirmation here
                setIsMinted(true);
                setIsModalOpen(false);
              }}
              variant="default"
              className="flex-1 h-12"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
