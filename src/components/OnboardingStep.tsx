import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Heading1, BodyText } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import setupImage from '/setup.png';
import rewardsImage from '/rewards.png';
import freedomImage from '/freedom.png';
import transparentImage from '/transparent.png';
import oakImage from '/oak.png';

// Dynamic images for step 1
import step1_0 from '/1-0.png';
import step1_1 from '/1-1.png';
import step1_2 from '/1-2.png';
import step1_3 from '/1-3.png';

interface OnboardingStepProps {
  step: number;
  totalSteps: number;
  heading: string;
  description: string;
  options: string[];
  selectedAnswer: string | null;
  backgroundImageType?: 'setup' | 'rewards' | 'freedom' | 'transparent' | 'oak';
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
  onBack?: () => void;
  canProceed: boolean;
}

export function OnboardingStep({ 
  step, 
  totalSteps, 
  heading, 
  description, 
  options,
  selectedAnswer,
  backgroundImageType = 'oak',
  onAnswerSelect,
  onNext,
  onBack,
  canProceed
}: OnboardingStepProps) {
  const getBackgroundImage = () => {
    // Special handling for step 1 with dynamic images
    if (step === 1) {
      if (!selectedAnswer) {
        return step1_0; // Default image for step 1
      }
      
      // Get the index of the selected answer
      const answerIndex = options.indexOf(selectedAnswer);
      switch (answerIndex) {
        case 0:
          return step1_1;
        case 1:
          return step1_2;
        case 2:
          return step1_3;
        default:
          return step1_0;
      }
    }
    
    // Default behavior for other steps
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


  const contentVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-8">
      <motion.div
        key={`step-${step}`}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="w-full max-w-6xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
          {/* Left Column - Content */}
          <div className="flex flex-col space-y-6 max-w-lg">
            {/* Progress Dots - Top Left */}
            <motion.div 
              className="flex justify-start space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {Array.from({ length: totalSteps }, (_, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    index < step ? "bg-primary" : "bg-muted-foreground/40"
                  )}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
                />
              ))}
            </motion.div>

            {/* Back Button - Below Progress */}
            {step > 1 && onBack && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="text-muted-foreground hover:text-foreground p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Main Content */}
            <motion.div 
              key={`content-${step}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Heading1 as="h1" className="text-4xl font-bold">{heading}</Heading1>
                <BodyText className="text-muted-foreground leading-relaxed text-lg">
                  {description}
                </BodyText>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                    onClick={() => onAnswerSelect(option)}
                    className={cn(
                      "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                      selectedAnswer === option
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <BodyText className="font-medium">
                      {option}
                    </BodyText>
                  </motion.button>
                ))}
              </div>

              {/* Continue Button */}
              <Button
                onClick={onNext}
                disabled={!canProceed}
                className={cn(
                  "w-full shadow-lg",
                  !canProceed && "opacity-50 bg-muted text-muted-foreground cursor-not-allowed"
                )}
                size="lg"
              >
                Continue
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Standalone Image */}
          <div 
            className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
