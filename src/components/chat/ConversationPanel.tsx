import React, { useState, useRef, useEffect } from 'react';
import { Contact, Message } from '@/types';
import { Paperclip, Send, Smile, Mic, Image as ImageIcon, FileText, X, UserPlus, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import MessageBubble from './MessageBubble';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import ConversationHeader from './ConversationHeader';
import EmptyStateMessage from './EmptyStateMessage';
import ClientRegistrationForm from './ClientRegistrationForm';
import MessageList from './MessageList';
import TemplateQuickAccess from './TemplateQuickAccess';
import MessageInput from './MessageInput';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const handleClientRegistration = (data: any) => {
    console.log("Form submitted with data:", data);
    
    toast({
      title: "Cliente cadastrado",
      description: `${data.name} foi registrado como cliente.`,
    });
    
    setIsClientDrawerOpen(false);
  };

  if (!contact) {
    return <EmptyStateMessage />;
  }

  return (
    <div className="flex flex-col h-full bg-vinizap-chat-bg">
      <ConversationHeader 
        contact={contact} 
        onClientRegistrationClick={() => setIsClientDrawerOpen(true)}
        isClientDrawerOpen={isClientDrawerOpen}
        setIsClientDrawerOpen={setIsClientDrawerOpen}
      >
        <ClientRegistrationForm 
          contact={contact}
          isOpen={isClientDrawerOpen}
          onSubmit={handleClientRegistration}
          onOpenChange={setIsClientDrawerOpen}
        />
      </ConversationHeader>

      <MessageList 
        messages={messages} 
        messagesEndRef={messagesEndRef} 
      />

      {showTemplates && (
        <TemplateQuickAccess 
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={(template) => {
            setInputValue(`Template: ${template}`);
            setShowTemplates(false);
          }}
        />
      )}

      <MessageInput 
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onKeyDown={handleKeyDown}
        onToggleTemplates={() => setShowTemplates(!showTemplates)}
      />
    </div>
  );
};

export default ConversationPanel;
