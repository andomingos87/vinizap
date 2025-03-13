
import React, { useState, useRef, useEffect } from 'react';
import { Contact, Message } from '@/types';
import { 
  Paperclip, 
  Send, 
  Smile, 
  Mic, 
  Image as ImageIcon, 
  FileText,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import MessageBubble from './MessageBubble';
import { cn } from '@/lib/utils';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-vinizap-primary/10 flex items-center justify-center mx-auto mb-4">
            <MessageIcon className="w-8 h-8 text-vinizap-primary" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Vinizap</h3>
          <p className="text-gray-500 mb-4">
            Selecione um contato para iniciar uma conversa ou criar novos templates de mensagens.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-vinizap-chat-bg">
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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-1">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isUser={message.senderId === 'user'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Templates quickaccess (conditional) */}
      {showTemplates && (
        <div className="bg-white border-t p-2 max-h-[200px] overflow-y-auto animate-slide-in">
          <div className="flex justify-between items-center mb-2 px-2">
            <h3 className="text-sm font-medium">Templates Rápidos</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setShowTemplates(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['Boas-vindas', 'Proposta comercial', 'Agendamento', 'Lista de preços'].map((template, index) => (
              <div 
                key={index}
                className="p-2 bg-gray-50 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setInputValue(`Template: ${template}`);
                  setShowTemplates(false);
                }}
              >
                {template}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="bg-white border-t p-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 flex-shrink-0 text-gray-500 hover:text-vinizap-primary hover:bg-gray-100 rounded-full" 
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <FileText className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 flex-shrink-0 text-gray-500 hover:text-vinizap-primary hover:bg-gray-100 rounded-full"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-grow relative bg-gray-100 rounded-full">
            <textarea
              className="w-full bg-transparent border-0 focus:ring-0 rounded-full py-2 px-4 max-h-[120px] resize-none"
              placeholder="Digite uma mensagem"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ 
                minHeight: '40px',
                height: 'auto',
                overflow: inputValue.length > 100 ? 'auto' : 'hidden'
              }}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-vinizap-primary hover:bg-gray-200 rounded-full"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "h-10 w-10 flex-shrink-0 rounded-full",
              inputValue ? "bg-vinizap-primary text-white hover:bg-vinizap-primary/90" : "text-gray-500 hover:text-vinizap-primary hover:bg-gray-100"
            )}
            onClick={handleSendMessage}
            disabled={!inputValue}
          >
            {inputValue ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

const MessageIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Search = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MoreVertical = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

export default ConversationPanel;
