
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, Zap, Shield } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Benefit } from '../shared/Benefit';

interface BenefitsStepProps {
  onNext: () => void;
}

const BenefitsStep = ({ onNext }: BenefitsStepProps) => {
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl">Benefícios do ViniZap</DialogTitle>
      </DialogHeader>
      <Separator />
      <div className="py-2">
        <Benefit 
          icon={<Star size={20} />}
          title="Conversa centralizada"
          description="Gerencie todas as suas conversas em um único lugar, sem perder nenhuma mensagem."
        />
        <Benefit 
          icon={<Zap size={20} />}
          title="Automação inteligente"
          description="Crie fluxos automáticos para responder a mensagens comuns e economizar tempo."
        />
        <Benefit 
          icon={<Shield size={20} />}
          title="Segurança garantida"
          description="Suas mensagens são criptografadas e protegidas em nosso sistema."
        />
      </div>
      <Button className="w-full" onClick={onNext}>
        Próximo <ChevronRight className="ml-2" size={16} />
      </Button>
    </div>
  );
};

export default BenefitsStep;
