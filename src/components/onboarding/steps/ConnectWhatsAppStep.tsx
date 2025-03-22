
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Check, QrCode, RefreshCw, Loader2 } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface ConnectWhatsAppStepProps {
  onNext: () => void;
}

type ConnectionStatus = 'idle' | 'loading' | 'qr-ready' | 'connecting' | 'connected' | 'error';

const ConnectWhatsAppStep = ({ onNext }: ConnectWhatsAppStepProps) => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [progressValue, setProgressValue] = useState(10);
  const { toast } = useToast();

  const fetchQRCode = async () => {
    setIsLoading(true);
    setError(null);
    setConnectionStatus('loading');
    setProgressValue(10);
    
    try {
      // First progress update - starting connection
      setProgressValue(30);
      
      const response = await fetch('https://vinizap-evolution-api.c8xr0n.easypanel.host/instance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'FD98G1981GER8G4T9HBBFD1G9E8R7TRE5FBDFH8FG49DF8G'
        },
        body: JSON.stringify({
          instanceName: `vinizap-${Date.now()}`, // Using timestamp to create unique instance names
          qrcode: true,
          integration: "WHATSAPP-BAILEYS"
        })
      });

      // Update progress - server responded
      setProgressValue(60);

      if (!response.ok) {
        const responseData = await response.json().catch(() => null);
        const errorMsg = responseData?.error || `Erro de conexão: ${response.status}`;
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      // Update progress - processing data
      setProgressValue(80);
      
      if (data.qrcode && data.qrcode.base64) {
        setQrCodeData(data.qrcode.base64);
        setConnectionStatus('qr-ready');
        setProgressValue(100);
      } else {
        throw new Error('QR Code não recebido da API');
      }
    } catch (err) {
      console.error('Erro ao buscar QR code:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar QR code';
      setError(errorMessage);
      setConnectionStatus('error');
      toast({
        title: "Erro ao conectar",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCode();
  }, []);

  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <Progress value={progressValue} className="w-full h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {progressValue < 30 && "Iniciando conexão..."}
              {progressValue >= 30 && progressValue < 60 && "Conectando ao servidor..."}
              {progressValue >= 60 && progressValue < 80 && "Gerando QR Code..."}
              {progressValue >= 80 && "Finalizando..."}
            </p>
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center p-4 space-y-3">
            <p className="text-sm text-destructive font-medium">{error}</p>
            <p className="text-xs text-muted-foreground">
              Verifique sua conexão com a internet e tente novamente.
            </p>
          </div>
        );
      
      case 'qr-ready':
        return qrCodeData ? (
          <div className="flex flex-col items-center">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <img 
                src={`data:image/png;base64,${qrCodeData}`} 
                alt="WhatsApp QR Code" 
                className="h-48 w-48 object-contain"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              QR Code válido por 60 segundos
            </p>
          </div>
        ) : (
          <Skeleton className="h-48 w-48" />
        );
      
      default:
        return <Skeleton className="h-48 w-48" />;
    }
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl">Conecte seu WhatsApp</DialogTitle>
      </DialogHeader>
      <Separator />
      <div className="flex flex-col items-center justify-center py-4 space-y-4">
        <QrCode size={32} className="text-primary mb-2" />
        <div className="h-64 w-64 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
          {renderConnectionStatus()}
        </div>
        <div className="text-sm text-muted-foreground text-center max-w-sm">
          Abra o WhatsApp no seu celular, vá em Configurações &gt; Dispositivos Conectados &gt; Conectar Dispositivo
        </div>
        
        {connectionStatus === 'error' && (
          <Button 
            variant="outline" 
            onClick={fetchQRCode} 
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> 
            {isLoading ? "Tentando novamente..." : "Tentar novamente"}
          </Button>
        )}

        {connectionStatus === 'qr-ready' && (
          <Button 
            variant="outline" 
            onClick={fetchQRCode} 
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} /> Gerar novo QR Code
          </Button>
        )}
      </div>
      <Button 
        className="w-full"
        onClick={onNext}
        disabled={connectionStatus === 'loading'}
      >
        {connectionStatus === 'qr-ready' ? "Conectado!" : "Pular esta etapa"} 
        <Check className="ml-2" size={16} />
      </Button>
    </div>
  );
};

export default ConnectWhatsAppStep;
