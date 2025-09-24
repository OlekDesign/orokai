import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
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

  // Animation variants for the loading dots
  const dotVariants = {
    initial: { scale: 0.8, opacity: 0.3 },
    animate: { scale: 1.2, opacity: 1 },
  };

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
        className="w-full"
        style={{ maxWidth: '360px' }}
      >
        <Card className="h-[700px] relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
          
          <CardContent className="h-full flex flex-col items-center justify-center p-6 relative z-10">
            <div className="text-center space-y-12">
              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Heading1 className="text-3xl font-bold">
                  Personalizing your account...
                </Heading1>
              </motion.div>

              {/* Elegant loading animation */}
              <div className="space-y-8">
                {/* Pulsing circle animation */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="w-20 h-20 rounded-full border-4 border-primary/30"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute w-12 h-12 rounded-full bg-primary"
                    animate={{ 
                      scale: [0.8, 1, 0.8],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                </div>

                {/* Animated dots */}
                <div className="flex justify-center space-x-2">
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="w-3 h-3 rounded-full bg-primary"
                      variants={dotVariants}
                      initial="initial"
                      animate="animate"
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: index * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>

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

                {/* Status text */}
                <motion.div
                  className="text-sm text-muted-foreground"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Setting up your personalized experience
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
