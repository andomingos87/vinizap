
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { StepIndicator } from './shared/StepIndicator';
import WelcomeStep from './steps/WelcomeStep';
import BenefitsStep from './steps/BenefitsStep';
import HowItWorksStep from './steps/HowItWorksStep';
import ConnectWhatsAppStep from './steps/ConnectWhatsAppStep';

type OnboardingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const OnboardingModal = ({ open, onOpenChange }: OnboardingModalProps) => {
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onOpenChange(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return <BenefitsStep onNext={nextStep} />;
      case 2:
        return <HowItWorksStep onNext={nextStep} />;
      case 3:
        return <ConnectWhatsAppStep onNext={nextStep} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px]"
        aria-describedby="onboarding-description"
      >
        {renderStepContent()}
        <StepIndicator currentStep={step} totalSteps={totalSteps} />
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
