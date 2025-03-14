
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div 
          key={index} 
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            index === currentStep ? 'bg-primary scale-125' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
};
