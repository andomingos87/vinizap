
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, QrCode } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface ConnectWhatsAppStepProps {
  onNext: () => void;
}

const ConnectWhatsAppStep = ({ onNext }: ConnectWhatsAppStepProps) => {
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
      <Button className="w-full" onClick={onNext}>
        Concluir <Check className="ml-2" size={16} />
      </Button>
    </div>
  );
};

export default ConnectWhatsAppStep;
