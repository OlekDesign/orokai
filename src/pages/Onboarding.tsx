import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { OnboardingStep } from '../components/OnboardingStep';
import { OnboardingPersonalization } from '../components/OnboardingPersonalization';
import { OnboardingWelcome } from '../components/OnboardingWelcome';

const onboardingSteps = [
  {
    heading: "What's your investment experience?",
    description: "Help us understand your background so we can provide the best guidance for you.",
    options: [
      "I'm completely new to investing",
      "I have some basic knowledge",
      "I'm an experienced investor"
    ],
    backgroundImageType: 'setup' as const
  },
  {
    heading: "What's your main investment goal?",
    description: "Understanding your goals helps us recommend the right investment strategy.",
    options: [
      "Build long-term wealth",
      "Generate passive income",
      "Save for a specific goal"
    ],
    backgroundImageType: 'rewards' as const
  }
];

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(new Array(onboardingSteps.length).fill(null));
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
      // Move to personalization step after all questions are answered
      setCurrentStep(totalSteps);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePersonalizationComplete = () => {
    // Move to welcome screen after personalization
    setCurrentStep(totalSteps + 1);
  };

  const canProceed = answers[currentStep] !== null;

  // Show welcome screen after personalization
  if (currentStep >= totalSteps + 1) {
    return <OnboardingWelcome />;
  }

  // Show personalization step after all questions
  if (currentStep === totalSteps) {
    return <OnboardingPersonalization onComplete={handlePersonalizationComplete} />;
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
        options={step.options}
        selectedAnswer={answers[currentStep]}
        backgroundImageType={step.backgroundImageType}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNext}
        onBack={handleBack}
        canProceed={canProceed}
      />
    </AnimatePresence>
  );
}