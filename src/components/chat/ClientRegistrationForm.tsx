import React, { useState, useEffect } from 'react';
import { Contact } from '@/types';
import { Check } from 'lucide-react';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

interface ClientRegistrationFormProps {
  contact: Contact;
  isOpen: boolean;
  onSubmit: (data: any) => void;
  onOpenChange: (isOpen: boolean) => void;
}

const ClientRegistrationForm: React.FC<ClientRegistrationFormProps> = ({
  contact,
  isOpen,
  onSubmit,
  onOpenChange
}) => {
  const [reminderCustomTexts, setReminderCustomTexts] = useState({
    oneWeek: '',
    threeDays: '',
    onDay: '',
    overdue: ''
  });

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
    if (contact && isOpen) {
      form.setValue('name', contact.name);
      form.setValue('phone', contact.phone || '');
    }
  }, [contact, isOpen, form]);

  const handleSubmitClientForm = (data: any) => {
    // Add reminder custom texts to data
    const submissionData = {
      ...data,
      reminderCustomTexts
    };
    
    onSubmit(submissionData);
  };

  return (
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
  );
};

export default ClientRegistrationForm;