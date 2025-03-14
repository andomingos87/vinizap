
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Star, Shield, Zap, QrCode, ChevronRight, Check } from "lucide-react";

type BenefitProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const Benefit = ({ icon, title, description }: BenefitProps) => {
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

type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
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
            <Button className="w-full" onClick={nextStep}>
              Começar <ChevronRight className="ml-2" size={16} />
            </Button>
          </div>
        );
      case 1:
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
            <Button className="w-full" onClick={nextStep}>
              Próximo <ChevronRight className="ml-2" size={16} />
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl">Como funciona</DialogTitle>
            </DialogHeader>
            <Separator />
            <div className="space-y-4 py-2">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border bg-muted">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Conecte seu WhatsApp</h4>
                  <p className="text-sm text-muted-foreground">
                    Escaneie o QR code que aparecerá no próximo passo.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border bg-muted">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Receba mensagens</h4>
                  <p className="text-sm text-muted-foreground">
                    Todas as mensagens do WhatsApp aparecerão automaticamente no ViniZap.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border bg-muted">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Responda de qualquer lugar</h4>
                  <p className="text-sm text-muted-foreground">
                    Use o ViniZap no computador, tablet ou celular.
                  </p>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={nextStep}>
              Próximo <ChevronRight className="ml-2" size={16} />
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl">Conecte seu WhatsApp</DialogTitle>
            </DialogHeader>
            <Separator />
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <QrCode size={32} className="text-primary mb-2" />
              <div className="h-56 w-56 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground">
                    QR Code para conexão
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    (Esta é uma demonstração - o QR Code real seria gerado pelo backend)
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground text-center max-w-sm">
                Abra o WhatsApp no seu celular, vá em Configurações &gt; Dispositivos Conectados &gt; Conectar Dispositivo
              </div>
            </div>
            <Button className="w-full" onClick={nextStep}>
              Concluir <Check className="ml-2" size={16} />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {renderStepContent()}
        <StepIndicator currentStep={step} totalSteps={totalSteps} />
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
