import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading1, BodyText } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import setupImage from '/setup.png';
import rewardsImage from '/rewards.png';
import freedomImage from '/freedom.png';
import transparentImage from '/transparent.png';
import oakImage from '/oak.png';

interface OnboardingStepProps {
  step: number;
  totalSteps: number;
  heading: string;
  description: string;
  buttonText: string;
  backgroundImageType?: 'setup' | 'rewards' | 'freedom' | 'transparent' | 'oak';
  onNext: () => void;
}

export function OnboardingStep({ 
  step, 
  totalSteps, 
  heading, 
  description, 
  buttonText, 
  backgroundImageType = 'oak',
  onNext
}: OnboardingStepProps) {
  const getBackgroundImage = () => {
    switch (backgroundImageType) {
      case 'setup':
        return setupImage;
      case 'rewards':
        return rewardsImage;
      case 'freedom':
        return freedomImage;
      case 'transparent':
        return transparentImage;
      case 'oak':
      default:
        return oakImage;
    }
  };
  
  const backgroundImage = getBackgroundImage();
  
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const backgroundVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 }
  };

  const contentVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <motion.div
        key={`step-${step}`}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="w-full"
        style={{ maxWidth: '360px' }}
      >
        <Card className="h-[624px] relative overflow-hidden">
          {/* Background Image with fade animation */}
          <motion.div
            key={`bg-${step}`}
            variants={backgroundVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          <CardContent className="h-full flex flex-col p-6 relative z-10">
            {/* Progress Dots - Top */}
            <motion.div 
              className="flex justify-start space-x-2 mb-auto"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {Array.from({ length: totalSteps }, (_, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    index < step ? "bg-primary" : "bg-white/40"
                  )}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
                />
              ))}
            </motion.div>

            {/* Content - Bottom */}
            <motion.div 
              key={`content-${step}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-left space-y-8"
            >
              <div className="space-y-4">
                <Heading1 as="h1" className="text-white text-4xl font-bold">{heading}</Heading1>
                <BodyText className="text-white leading-relaxed">
                  {description}
                </BodyText>
              </div>

              {/* Continue Button */}
              <Button
                onClick={onNext}
                className="w-full shadow-lg"
                size="lg"
              >
                {buttonText}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
