
import React from 'react';
import { MailCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface VerificationMessageProps {
  email: string;
  onBack: () => void;
}

export const VerificationMessage: React.FC<VerificationMessageProps> = ({ email, onBack }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center">
          <MailCheck className="h-8 w-8 text-blue-500" />
        </div>
      </div>
      <Alert className="bg-blue-50 border-blue-200">
        <AlertTitle className="text-blue-700 text-lg font-semibold">Verifique seu email</AlertTitle>
        <AlertDescription className="text-blue-600">
          Enviamos um link de confirmação para <strong>{email}</strong>. 
          Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
        </AlertDescription>
      </Alert>
      <div className="text-center">
        <Button variant="outline" onClick={onBack}>
          Voltar para o login
        </Button>
      </div>
    </div>
  );
};
