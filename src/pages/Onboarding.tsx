import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { OnboardingStep } from '../components/OnboardingStep';
import { OnboardingInfoStep } from '../components/OnboardingInfoStep';
import { OnboardingPersonalization } from '../components/OnboardingPersonalization';
import { OnboardingWelcome } from '../components/OnboardingWelcome';
import type { BackgroundImageType } from '@/lib/getBackgroundImage';

type StakingIllustrationKey =
  | 'staking-savings'
  | 'staking-different'
  | 'staking-earns'
  | 'staking-ready';

type OnboardingStepDef =
  | {
      type: 'question';
      heading: string;
      description: string;
      options: string[];
      backgroundImageType: BackgroundImageType;
    }
  | {
      type: 'info';
      heading: string;
      description: string;
      backgroundImageType: StakingIllustrationKey;
    };

const onboardingSteps: OnboardingStepDef[] = [
  {
    type: 'question',
    heading: "What's your investment experience?",
    description:
      'Help us understand your background so we can provide the best guidance for you.',
    options: [
      "I'm completely new to investing",
      'I have some basic knowledge',
      "I'm an experienced investor",
    ],
    backgroundImageType: 'setup',
  },
  {
    type: 'info',
    heading: 'Like a savings account, but for crypto',
    description:
      'You set money aside in a bank, and it earns interest over time. Here, you set crypto aside, and it earns rewards the same way.',
    backgroundImageType: 'staking-savings',
  },
  {
    type: 'info',
    heading: 'But it works a bit differently',
    description:
      "There's no bank in the middle. Your crypto helps secure the network, and the network rewards you directly — which is why the returns tend to be higher than a typical savings account.",
    backgroundImageType: 'staking-different',
  },
  {
    type: 'info',
    heading: 'Earn passive income, day after day',
    description:
      'Set aside $1,000 and earn around $100 over a year — paid automatically as crypto added to your balance. The more you set aside, the more it grows.',
    backgroundImageType: 'staking-earns',
  },
  {
    type: 'info',
    heading: "You're ready to start",
    description: 'It only takes three things: pick a strategy, choose how much to set aside, and watch your rewards grow.',
    backgroundImageType: 'staking-ready',
  },
  {
    type: 'question',
    heading: "What's your main investment goal?",
    description:
      'Understanding your goals helps us recommend the right investment strategy.',
    options: ['Build long-term wealth', 'Generate passive income', 'Save for a specific goal'],
    backgroundImageType: 'rewards',
  },
];

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    new Array(onboardingSteps.length).fill(null)
  );
  const totalSteps = onboardingSteps.length;

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(totalSteps);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePersonalizationComplete = () => {
    setCurrentStep(totalSteps + 1);
  };

  if (currentStep >= totalSteps + 1) {
    return <OnboardingWelcome />;
  }

  if (currentStep === totalSteps) {
    return <OnboardingPersonalization onComplete={handlePersonalizationComplete} />;
  }

  const step = onboardingSteps[currentStep];

  const canProceed = step.type === 'info' || answers[currentStep] !== null;

  return (
    <AnimatePresence mode="wait">
      {step.type === 'info' ? (
        <OnboardingInfoStep
          key={currentStep}
          step={currentStep + 1}
          totalSteps={totalSteps}
          heading={step.heading}
          description={step.description}
          backgroundImageType={step.backgroundImageType}
          onNext={handleNext}
          onBack={handleBack}
        />
      ) : (
        <OnboardingStep
          key={currentStep}
          step={currentStep + 1}
          totalSteps={totalSteps}
          heading={step.heading}
          description={step.description}
          options={step.options}
          selectedAnswer={answers[currentStep]}
          backgroundImageType={step.backgroundImageType}
          onAnswerSelect={handleAnswerSelect}
          onNext={handleNext}
          onBack={currentStep > 0 ? handleBack : undefined}
          canProceed={canProceed}
        />
      )}
    </AnimatePresence>
  );
}
