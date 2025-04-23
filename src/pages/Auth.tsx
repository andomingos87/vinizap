import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthForm } from '@/components/auth/AuthForm';
import { VerificationMessage } from '@/components/auth/VerificationMessage';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (activeTab === 'signup') {
        setShowVerification(true);
        toast({
          title: "Cadastro realizado",
          description: "Por favor, verifique seu email para confirmar o cadastro.",
        });
      } else {
        const userId = `user-${Date.now()}`;
        localStorage.setItem('user', JSON.stringify({ id: userId, email }));
        navigate('/admin');
      }
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="md:w-1/2 bg-gradient-to-br from-[#25D366] via-[#128C7E] to-[#075E54]">
        {/* Left side content */}
      </div>
      <div className="md:w-1/2 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {showForgotPassword 
                ? "Recuperar senha" 
                : showVerification 
                  ? "Verificação de email" 
                  : activeTab === 'login' 
                    ? "Bem-vindo de volta" 
                    : "Crie sua conta"}
            </CardTitle>
            <CardDescription className="text-center">
              {showForgotPassword 
                ? "Informe seu email para receber um link de redefinição de senha" 
                : showVerification 
                  ? "Quase lá! Verifique seu email para continuar" 
                  : activeTab === 'login' 
                    ? "Entre com suas credenciais para acessar o sistema" 
                    : "Preencha os dados abaixo para criar sua conta"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {showForgotPassword ? (
              <ForgotPasswordForm 
                email={email}
                setEmail={setEmail}
                onBack={() => setShowForgotPassword(false)}
              />
            ) : showVerification ? (
              <VerificationMessage 
                email={email}
                onBack={() => setShowVerification(false)}
              />
            ) : (
              <AuthForm
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                onForgotPassword={() => setShowForgotPassword(true)}
                onSubmit={handleAuth}
              />
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center text-sm text-gray-500 pt-0">
            {!showVerification && !showForgotPassword && (
              <p>
                {activeTab === 'login' ? 'Novo por aqui? ' : 'Já tem uma conta? '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                >
                  {activeTab === 'login' ? 'Crie sua conta' : 'Faça login'}
                </Button>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
