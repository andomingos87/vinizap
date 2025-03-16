import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Bug, 
  HelpCircle, 
  Send, 
  ArrowLeft 
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Help = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugSteps, setBugSteps] = useState('');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, escreva seu feedback antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Feedback enviado",
        description: "Agradecemos pelo seu feedback!",
      });
      setFeedbackMessage('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar seu feedback. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportBug = async () => {
    if (!bugDescription.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva o bug antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Bug reportado",
        description: "Obrigado por reportar este bug. Nossa equipe irá analisá-lo.",
      });
      setBugDescription('');
      setBugSteps('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível reportar o bug. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSupport = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada para o suporte. Responderemos em breve.",
      });
      setSupportSubject('');
      setSupportMessage('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 h-full overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              asChild
            >
              <Link to="/">
                <ArrowLeft className="h-5 w-5 text-vinizap-primary" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Central de Ajuda</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="feedback" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="feedback" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar Feedback
              </TabsTrigger>
              <TabsTrigger value="bug" className="flex items-center">
                <Bug className="h-4 w-4 mr-2" />
                Reportar Bug
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                Suporte
              </TabsTrigger>
            </TabsList>

            {/* Feedback Tab */}
            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle>Enviar Feedback</CardTitle>
                  <CardDescription>
                    Compartilhe suas sugestões e opiniões para nos ajudar a melhorar o ViniZap.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="feedback" className="text-sm font-medium">
                        Seu feedback
                      </label>
                      <Textarea
                        id="feedback"
                        placeholder="Escreva seu feedback aqui..."
                        rows={6}
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={handleSubmitFeedback} 
                    disabled={isSubmitting}
                    className="flex items-center"
                  >
                    {isSubmitting ? "Enviando..." : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Feedback
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Bug Report Tab */}
            <TabsContent value="bug">
              <Card>
                <CardHeader>
                  <CardTitle>Reportar Bug</CardTitle>
                  <CardDescription>
                    Encontrou um problema? Ajude-nos a melhorar reportando bugs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="bug-description" className="text-sm font-medium">
                        Descrição do bug
                      </label>
                      <Textarea
                        id="bug-description"
                        placeholder="Descreva o bug que você encontrou..."
                        rows={4}
                        value={bugDescription}
                        onChange={(e) => setBugDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="bug-steps" className="text-sm font-medium">
                        Passos para reproduzir (opcional)
                      </label>
                      <Textarea
                        id="bug-steps"
                        placeholder="Descreva os passos para reproduzir o bug..."
                        rows={4}
                        value={bugSteps}
                        onChange={(e) => setBugSteps(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={handleReportBug} 
                    disabled={isSubmitting}
                    className="flex items-center"
                  >
                    {isSubmitting ? "Enviando..." : (
                      <>
                        <Bug className="h-4 w-4 mr-2" />
                        Reportar Bug
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support">
              <Card>
                <CardHeader>
                  <CardTitle>Contato com Suporte</CardTitle>
                  <CardDescription>
                    Precisa de ajuda? Entre em contato com nossa equipe de suporte.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="support-email" className="text-sm font-medium">
                        Seu email
                      </label>
                      <Input
                        id="support-email"
                        type="email"
                        placeholder="Seu email de contato"
                        value={user?.email || ''}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="support-subject" className="text-sm font-medium">
                        Assunto
                      </label>
                      <Input
                        id="support-subject"
                        placeholder="Assunto da sua mensagem"
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="support-message" className="text-sm font-medium">
                        Mensagem
                      </label>
                      <Textarea
                        id="support-message"
                        placeholder="Descreva em detalhes como podemos ajudá-lo..."
                        rows={6}
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={handleContactSupport} 
                    disabled={isSubmitting}
                    className="flex items-center"
                  >
                    {isSubmitting ? "Enviando..." : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Help;
