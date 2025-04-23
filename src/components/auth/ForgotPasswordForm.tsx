
import React, { useState } from 'react';
import { Mail, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  onBack: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  email, 
  setEmail, 
  onBack 
}) => {
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResetSent(true);
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Houve um erro, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {resetSent ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-700 text-lg font-semibold">Email enviado</AlertTitle>
            <AlertDescription className="text-green-600">
              Enviamos um link para redefinir sua senha para <strong>{email}</strong>. 
              Por favor, verifique sua caixa de entrada e siga as instruções.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="reset-email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar link de redefinição'}
          </Button>
        </form>
      )}
      <div className="text-center">
        <Button 
          variant="link" 
          onClick={() => {
            onBack();
            setResetSent(false);
          }}
        >
          Voltar para o login
        </Button>
      </div>
    </div>
  );
};
