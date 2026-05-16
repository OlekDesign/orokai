import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heading1, BodyText } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { getBackgroundImage, type BackgroundImageType } from '@/lib/getBackgroundImage';

interface OnboardingInfoStepProps {
  step: number;
  totalSteps: number;
  heading: string;
  description: string;
  bullets?: string[];
  backgroundImageType: BackgroundImageType;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingInfoStep({
  step,
  totalSteps,
  heading,
  description,
  bullets,
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

  const backgroundImage = getBackgroundImage(backgroundImageType);

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

  const renderBullets = () =>
    bullets && bullets.length > 0 ? (
      <ol className="space-y-3 pt-2">
        {bullets.map((bullet, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
            className="flex items-start gap-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {index + 1}
            </span>
            <BodyText className="font-medium pt-0.5">{bullet}</BodyText>
          </motion.li>
        ))}
      </ol>
    ) : null;

  const renderProgressDots = () => (
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
            'w-2 h-2 rounded-full transition-colors duration-300',
            index < step ? 'bg-primary' : 'bg-muted-foreground/40'
          )}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
        />
      ))}
    </motion.div>
  );

  const renderButtons = () => (
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
          className="px-6 py-3 min-h-[44px] md:min-h-0 md:py-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </motion.div>
      <Button onClick={onNext} className="shadow-lg px-6 py-3 min-h-[44px] md:min-h-0 md:py-2" size="lg">
        Continue
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/50 px-4 lg:py-8">
      {/* Desktop */}
      <div className="hidden lg:flex min-h-screen items-center justify-center">
        <motion.div
          key={`info-${step}`}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="w-full max-w-6xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center h-full">
            <div className="flex flex-col space-y-4 sm:space-y-6 max-w-lg">
              <motion.div
                key={`info-content-${step}`}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="space-y-6 sm:space-y-8 flex-1 flex flex-col"
              >
                <div className="space-y-4">
                  <Heading1 as="h1">{heading}</Heading1>
                  <BodyText className="text-muted-foreground leading-relaxed text-body-large">
                    {description}
                  </BodyText>
                </div>

                <div className="flex-1">{renderBullets()}</div>

                <div className="flex justify-between items-center">
                  {renderProgressDots()}
                  {renderButtons()}
                </div>
              </motion.div>
            </div>

            <div
              className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <motion.div
          key={`info-${step}-mobile`}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex-1 overflow-y-auto px-4 pt-8"
        >
          <div className="max-w-lg mx-auto w-full pb-32">
            <motion.div
              key={`info-content-${step}-mobile`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="space-y-4">
                <Heading1 as="h1" className="text-4xl font-bold">
                  {heading}
                </Heading1>
                <BodyText className="text-muted-foreground leading-relaxed text-lg">
                  {description}
                </BodyText>
              </div>
              {renderBullets()}
            </motion.div>
          </div>
        </motion.div>

        <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-background border-t border-border">
          <div className="flex justify-between items-center">
            {renderProgressDots()}
            {renderButtons()}
          </div>
        </div>
      </div>
    </div>
  );
}
