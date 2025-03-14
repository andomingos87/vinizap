import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck, Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (activeTab === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        setShowVerification(true);
        toast({
          title: "Cadastro realizado",
          description: "Por favor, verifique seu email para confirmar o cadastro.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Houve um erro, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setResetSent(true);
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Houve um erro, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const VerificationMessage = () => (
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
        <Button variant="outline" onClick={() => setShowVerification(false)}>
          Voltar para o login
        </Button>
      </div>
    </div>
  );

  const ForgotPasswordForm = () => (
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
            setShowForgotPassword(false);
            setResetSent(false);
          }}
        >
          Voltar para o login
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Brand Section - WhatsApp gradient */}
      <div className="md:w-1/2 bg-gradient-to-br from-[#25D366] via-[#128C7E] to-[#075E54]">
        {/* Empty section with just the gradient */}
      </div>
      
      {/* Auth Form Section */}
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
          
          {showForgotPassword ? (
            <CardContent>
              <ForgotPasswordForm />
            </CardContent>
          ) : showVerification ? (
            <CardContent>
              <VerificationMessage />
            </CardContent>
          ) : (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="login" className="rounded-l-md">Login</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-r-md">Cadastro</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleAuth}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      {activeTab === 'login' && (
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-xs"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowForgotPassword(true);
                          }}
                        >
                          Esqueceu a senha?
                        </Button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      'Processando...'
                    ) : (
                      <span className="flex items-center">
                        {activeTab === 'login' ? 'Entrar' : 'Cadastrar'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-xs text-gray-500">
                        Ao continuar, você concorda com nossos termos
                      </span>
                    </div>
                  </div>
                </CardContent>
              </form>
            </Tabs>
          )}
          
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
