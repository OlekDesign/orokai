import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { OnboardingStep } from '../components/OnboardingStep';
import { OnboardingWelcome } from '../components/OnboardingWelcome';

const onboardingSteps = [
  {
    heading: "Simple Setup",
    description: "We've made it incredibly easy to start investing. Just a few taps and you're ready to begin your journey towards financial growth.",
    buttonText: "Got it",
    backgroundImageType: 'setup' as const
  },
  {
    heading: "Guaranteed Frequent Rewards",
    description: "Earn fixed returns on a predictable schedule. No surprises, just consistent rewards that help your money grow over time.",
    buttonText: "Cool!",
    backgroundImageType: 'rewards' as const
  },
  {
    heading: "Flexible Access Whenever You Need",
    description: "Your money isn't locked away. Withdraw your investments anytime without penalties or waiting periods. Complete flexibility, complete control.",
    buttonText: "I see",
    backgroundImageType: 'freedom' as const
  },
  {
    heading: "Full Transparency",
    description: "Every transaction is clear and traceable. While processing may take a few minutes, we keep you informed every step of the way.",
    buttonText: "Let's go!",
    backgroundImageType: 'transparent' as const
  }
];

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = onboardingSteps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Move to welcome screen
      setCurrentStep(totalSteps);
    }
  };

  // Show welcome screen after all steps
  if (currentStep >= totalSteps) {
    return <OnboardingWelcome />;
  }

  const step = onboardingSteps[currentStep];

  return (
    <AnimatePresence mode="wait">
      <OnboardingStep
        key={currentStep}
        step={currentStep + 1}
        totalSteps={totalSteps}
        heading={step.heading}
        description={step.description}
        buttonText={step.buttonText}
        backgroundImageType={step.backgroundImageType}
        onNext={handleNext}
      />
    </AnimatePresence>
  );
}