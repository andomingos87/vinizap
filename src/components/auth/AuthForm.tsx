
import React from 'react';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface AuthFormProps {
  activeTab: 'login' | 'signup';
  setActiveTab: (tab: 'login' | 'signup') => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  loading: boolean;
  onForgotPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  activeTab,
  setActiveTab,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  onForgotPassword,
  onSubmit,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
      <TabsList className="grid grid-cols-2 w-full mb-4">
        <TabsTrigger value="login" className="rounded-l-md">Login</TabsTrigger>
        <TabsTrigger value="signup" className="rounded-r-md">Cadastro</TabsTrigger>
      </TabsList>
      
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
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
                    onForgotPassword();
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
        </div>
      </form>
    </Tabs>
  );
};
