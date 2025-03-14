
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, MessageCircle } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-center text-2xl">Bem-vindo ao ViniZap</DialogTitle>
      </DialogHeader>
      <p className="text-center text-muted-foreground">
        Vamos configurar sua conta em poucos passos para você aproveitar todos os recursos.
      </p>
      <div className="flex justify-center py-4">
        <MessageCircle size={72} className="text-primary" />
      </div>
      <Button className="w-full" onClick={onNext}>
        Começar <ChevronRight className="ml-2" size={16} />
      </Button>
    </div>
  );
};

export default WelcomeStep;
