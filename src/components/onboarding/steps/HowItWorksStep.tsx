
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface HowItWorksStepProps {
  onNext: () => void;
}

const HowItWorksStep = ({ onNext }: HowItWorksStepProps) => {
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
      <Button className="w-full" onClick={onNext}>
        Próximo <ChevronRight className="ml-2" size={16} />
      </Button>
    </div>
  );
};

export default HowItWorksStep;
