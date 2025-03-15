import React, { useState, useRef, useEffect } from 'react';
import { Contact, Message } from '@/types';
import { Paperclip, Send, Smile, Mic, Image as ImageIcon, FileText, X, UserPlus, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import MessageBubble from './MessageBubble';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface ConversationPanelProps {
  contact: Contact | null;
  messages: Message[];
  onSendMessage: (content: string, type: 'text') => void;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({
  contact,
  messages,
  onSendMessage
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isClientDrawerOpen, setIsClientDrawerOpen] = useState(false);
  const [reminderCustomTexts, setReminderCustomTexts] = useState({
    oneWeek: '',
    threeDays: '',
    onDay: '',
    overdue: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      appName: '',
      server: '',
      plan: '',
      planValue: '',
      billing: 'monthly',
      customBilling: '',
      reminders: {
        oneWeek: false,
        threeDays: false,
        onDay: false,
        overdue: false
      }
    }
  });

  useEffect(() => {
    if (contact && isClientDrawerOpen) {
      form.setValue('name', contact.name);
      form.setValue('phone', contact.phone || '');
    }
  }, [contact, isClientDrawerOpen, form]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    onSendMessage(inputValue.trim(), 'text');
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
  };

  const handleSubmitClientForm = (data: any) => {
    console.log("Form submitted with data:", data);
    
    // Add reminder custom texts to data
    const submissionData = {
      ...data,
      reminderCustomTexts
    };
    
    toast({
      title: "Cliente cadastrado",
      description: `${data.name} foi registrado como cliente.`,
    });
    
    setIsClientDrawerOpen(false);
  };

  if (!contact) {
    return <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-vinizap-primary/10 flex items-center justify-center mx-auto mb-4">
            <MessageIcon className="w-8 h-8 text-vinizap-primary" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Vinizap</h3>
          <p className="text-gray-500 mb-4">
            Selecione um contato para iniciar uma conversa ou criar novos templates de mensagens.
          </p>
        </div>
      </div>;
  }
  return <div className="flex flex-col h-full bg-vinizap-chat-bg">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b flex items-center shadow-sm">
        <Avatar className="h-9 w-9">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
        </Avatar>
        <div className="ml-3 flex-grow">
          <div className="font-medium">{contact.name}</div>
          <div className="text-xs text-gray-500">
            {contact.status === 'online' ? 'Online' : 'Último acesso há pouco tempo'}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-5 w-5 text-gray-500" />
          </Button>
          
          <Sheet open={isClientDrawerOpen} onOpenChange={setIsClientDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 mx-0" title="Cadastrar como cliente">
                <UserPlus className="h-5 w-5 text-gray-500" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Cadastrar Cliente</SheetTitle>
              </SheetHeader>
              
              <form onSubmit={form.handleSubmit(handleSubmitClientForm)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    {...form.register('name')} 
                    defaultValue={contact.name}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    {...form.register('phone')} 
                    defaultValue={contact.phone || ''}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    {...form.register('email')} 
                    type="email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="appName">Nome do app</Label>
                  <Input 
                    id="appName" 
                    {...form.register('appName')} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="server">Servidor</Label>
                  <Input 
                    id="server" 
                    {...form.register('server')} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plan">Plano</Label>
                  <Select onValueChange={(value) => form.setValue('plan', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="standard">Padrão</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="planValue">Valor do plano</Label>
                  <Input 
                    id="planValue" 
                    {...form.register('planValue')} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billing">Cobrança</Label>
                  <Select defaultValue="monthly" onValueChange={(value) => form.setValue('billing', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de cobrança" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="semiannual">Semestral</SelectItem>
                      <SelectItem value="annual">Anual</SelectItem>
                      <SelectItem value="custom">Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {form.watch('billing') === 'custom' && (
                  <div className="space-y-2">
                    <Label htmlFor="customBilling">Cobrança personalizada</Label>
                    <Textarea 
                      id="customBilling" 
                      {...form.register('customBilling')} 
                      placeholder="Descreva o modelo de cobrança personalizado"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Programar lembretes</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="oneWeek" 
                        checked={form.watch('reminders.oneWeek')}
                        onCheckedChange={(checked) => 
                          form.setValue('reminders.oneWeek', checked as boolean)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="oneWeek" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          1 semana antes
                        </Label>
                        {form.watch('reminders.oneWeek') && (
                          <Textarea 
                            placeholder="Texto personalizado para lembrete de 1 semana"
                            className="mt-2"
                            value={reminderCustomTexts.oneWeek}
                            onChange={(e) => setReminderCustomTexts({...reminderCustomTexts, oneWeek: e.target.value})}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="threeDays" 
                        checked={form.watch('reminders.threeDays')}
                        onCheckedChange={(checked) => 
                          form.setValue('reminders.threeDays', checked as boolean)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="threeDays" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          3 dias antes
                        </Label>
                        {form.watch('reminders.threeDays') && (
                          <Textarea 
                            placeholder="Texto personalizado para lembrete de 3 dias"
                            className="mt-2"
                            value={reminderCustomTexts.threeDays}
                            onChange={(e) => setReminderCustomTexts({...reminderCustomTexts, threeDays: e.target.value})}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="onDay" 
                        checked={form.watch('reminders.onDay')}
                        onCheckedChange={(checked) => 
                          form.setValue('reminders.onDay', checked as boolean)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="onDay" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          No dia
                        </Label>
                        {form.watch('reminders.onDay') && (
                          <Textarea 
                            placeholder="Texto personalizado para lembrete no dia"
                            className="mt-2"
                            value={reminderCustomTexts.onDay}
                            onChange={(e) => setReminderCustomTexts({...reminderCustomTexts, onDay: e.target.value})}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="overdue" 
                        checked={form.watch('reminders.overdue')}
                        onCheckedChange={(checked) => 
                          form.setValue('reminders.overdue', checked as boolean)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="overdue" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Em atraso
                        </Label>
                        {form.watch('reminders.overdue') && (
                          <Textarea 
                            placeholder="Texto personalizado para lembrete em atraso"
                            className="mt-2"
                            value={reminderCustomTexts.overdue}
                            onChange={(e) => setReminderCustomTexts({...reminderCustomTexts, overdue: e.target.value})}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Button type="submit" className="w-full">
                    <Check className="mr-2 h-4 w-4" />
                    Cadastrar cliente
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 mx-0">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-1">
          {messages.map(message => <MessageBubble key={message.id} message={message} isUser={message.senderId === 'user'} />)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Templates quickaccess (conditional) */}
      {showTemplates && <div className="bg-white border-t p-2 max-h-[200px] overflow-y-auto animate-slide-in">
          <div className="flex justify-between items-center mb-2 px-2">
            <h3 className="text-sm font-medium">Templates Rápidos</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowTemplates(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['Boas-vindas', 'Proposta comercial', 'Agendamento', 'Lista de preços'].map((template, index) => <div key={index} className="p-2 bg-gray-50 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
          setInputValue(`Template: ${template}`);
          setShowTemplates(false);
        }}>
                {template}
              </div>)}
          </div>
        </div>}

      {/* Input area */}
      <div className="bg-white border-t p-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0 text-gray-500 hover:text-vinizap-primary hover:bg-gray-100 rounded-full" onClick={() => setShowTemplates(!showTemplates)}>
              <FileText className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0 text-gray-500 hover:text-vinizap-primary hover:bg-gray-100 rounded-full">
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-grow relative bg-gray-100 rounded-full">
            <textarea className="w-full bg-transparent border-0 focus:ring-0 rounded-full py-2 px-4 max-h-[120px] resize-none" placeholder="Digite uma mensagem" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown} rows={1} style={{
            minHeight: '40px',
            height: 'auto',
            overflow: inputValue.length > 100 ? 'auto' : 'hidden'
          }} />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-vinizap-primary hover:bg-gray-200 rounded-full">
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" className={cn("h-10 w-10 flex-shrink-0 rounded-full", inputValue ? "bg-vinizap-primary text-white hover:bg-vinizap-primary/90" : "text-gray-500 hover:text-vinizap-primary hover:bg-gray-100")} onClick={handleSendMessage} disabled={!inputValue}>
            {inputValue ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>;
};

const MessageIcon = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>;

const Search = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>;

const MoreVertical = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>;

export default ConversationPanel;
