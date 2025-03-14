
import React from 'react';

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const Benefit = ({ icon, title, description }: BenefitProps) => {
  return (
    <div className="flex gap-4 items-start mb-4">
      <div className="mt-0.5 p-2 bg-primary/10 rounded-full text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
