
import React from 'react';
import { Template } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface TemplateHandlerProps {
  activeTab: string;
  selectedContactId: string | null;
  onSendMessage: (content: string, type: 'text') => void;
}

export const TemplateHandler = ({ activeTab, selectedContactId, onSendMessage }: TemplateHandlerProps) => {
  const { toast } = useToast();

  const handleInsertTemplate = (template: Template) => {
    if (activeTab === 'chat' && selectedContactId) {
      onSendMessage(template.content, 'text');
      toast({
        title: "Template inserido",
        description: `"${template.name}" adicionado à conversa.`,
      });
    } else {
      toast({
        title: "Selecione uma conversa",
        description: "Para usar um template, selecione primeiro uma conversa.",
      });
    }
  };

  return null; // This is a logic-only component
};
