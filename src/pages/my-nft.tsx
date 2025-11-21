import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Heading2 } from '@/components/ui/typography';

export function MyNFT() {
  const navigate = useNavigate();

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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-6">
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
          className="text-center"
        >
          <Heading2>
            You don't have any OROKAI NFT yet.
          </Heading2>
        </motion.div>

        {/* Button */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.2, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Button
            size="lg"
            className="min-w-[200px]"
          >
            Mint Your Free NFT
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
