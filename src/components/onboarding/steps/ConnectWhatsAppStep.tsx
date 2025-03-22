
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Check, QrCode, RefreshCw } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface ConnectWhatsAppStepProps {
  onNext: () => void;
}

const ConnectWhatsAppStep = ({ onNext }: ConnectWhatsAppStepProps) => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQRCode = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://vinizap-evolution-api.c8xr0n.easypanel.host/instance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'UDHFSDFU32746237HSDF73RH432DSFI7324HERS768'
        },
        body: JSON.stringify({
          instanceName: `vinizap-${Date.now()}`, // Using timestamp to create unique instance names
          qrcode: true,
          integration: "WHATSAPP-BAILEYS"
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ao conectar com a API: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.qrcode) {
        setQrCodeData(data.qrcode.base64);
      } else {
        throw new Error('QR Code não recebido da API');
      }
    } catch (err) {
      console.error('Erro ao buscar QR code:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao buscar QR code');
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível obter o QR Code para conexão.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCode();
  }, []);

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl">Conecte seu WhatsApp</DialogTitle>
      </DialogHeader>
      <Separator />
      <div className="flex flex-col items-center justify-center py-4 space-y-4">
        <QrCode size={32} className="text-primary mb-2" />
        <div className="h-56 w-56 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="h-48 w-48" />
          ) : error ? (
            <div className="text-center p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : qrCodeData ? (
            <img 
              src={`data:image/png;base64,${qrCodeData}`} 
              alt="WhatsApp QR Code" 
              className="h-48 w-48"
            />
          ) : (
            <div className="text-center p-4">
              <p className="text-sm text-muted-foreground">
                QR Code não disponível
              </p>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground text-center max-w-sm">
          Abra o WhatsApp no seu celular, vá em Configurações &gt; Dispositivos Conectados &gt; Conectar Dispositivo
        </div>
        
        {error && (
          <Button 
            variant="outline" 
            onClick={fetchQRCode} 
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} /> Tentar novamente
          </Button>
        )}
      </div>
      <Button className="w-full" onClick={onNext}>
        Concluir <Check className="ml-2" size={16} />
      </Button>
    </div>
  );
};

export default ConnectWhatsAppStep;
