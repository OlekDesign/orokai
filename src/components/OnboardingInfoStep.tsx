import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heading1, BodyText } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { StakingIllustration } from '@/components/illustrations/StakingIllustrations';

type StakingIllustrationKey =
  | 'staking-savings'
  | 'staking-different'
  | 'staking-earns'
  | 'staking-ready';

interface OnboardingInfoStepProps {
  step: number;
  totalSteps: number;
  heading: string;
  description: string;
  backgroundImageType: StakingIllustrationKey;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingInfoStep({
  step,
  totalSteps,
  heading,
  description,
  backgroundImageType,
  onNext,
  onBack,
}: OnboardingInfoStepProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext]);

  const containerVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const contentVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <motion.div
        key={`info-${step}`}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex flex-1 flex-col overflow-y-auto px-4 pt-8 pb-32 sm:px-6 sm:pt-12"
      >
        <motion.div
          key={`info-content-${step}`}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="mx-auto flex w-full max-w-xl flex-col gap-6 sm:my-auto sm:max-w-3xl sm:gap-8"
        >
          <div className="space-y-3 sm:space-y-4">
            <Heading1 as="h1" className="text-3xl sm:text-4xl">
              {heading}
            </Heading1>
            <BodyText className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </BodyText>
          </div>

          <div className="w-full">
            <StakingIllustration type={backgroundImageType} />
          </div>
        </motion.div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 px-4 pb-8 pt-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <motion.div
            className="flex space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {Array.from({ length: totalSteps }, (_, index) => (
              <motion.div
                key={index}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors duration-300',
                  index < step ? 'bg-primary' : 'bg-muted-foreground/40'
                )}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
              />
            ))}
          </motion.div>

          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Button
                variant="secondary"
                size="lg"
                onClick={onBack}
                className="min-h-[44px] px-5 py-3 sm:px-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </motion.div>
            <Button onClick={onNext} size="lg" className="min-h-[44px] px-5 py-3 shadow-lg sm:px-6">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
