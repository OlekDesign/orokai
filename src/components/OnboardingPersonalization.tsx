import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heading1 } from "@/components/ui/typography";

interface OnboardingPersonalizationProps {
  onComplete: () => void;
}

export function OnboardingPersonalization({ onComplete }: OnboardingPersonalizationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);


  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center space-y-12">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Heading1>
              Personalizing your account...
            </Heading1>
          </motion.div>

          {/* Elegant loading animation */}
          <div className="space-y-8">


            {/* Progress bar */}
            <div className="w-48 mx-auto">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                />
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
