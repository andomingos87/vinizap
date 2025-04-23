
import { useState, useEffect } from 'react';
import { Contact, Message } from '@/types';
import { conversations } from '@/data/mockData';

export const useChatState = () => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (selectedContactId) {
      const msgs = conversations[selectedContactId] || [];
      setCurrentMessages(msgs);
    } else {
      setCurrentMessages([]);
    }
  }, [selectedContactId]);

  const handleSendMessage = (content: string, type: 'text') => {
    if (!selectedContactId) return;
    
    const newMessage: Message = {
      id: `new-${Date.now()}`,
      content,
      timestamp: new Date(),
      type,
      senderId: 'user',
      status: 'sending'
    };
    
    setCurrentMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      setCurrentMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      );
    }, 1000);
  };

  return {
    selectedContactId,
    setSelectedContactId,
    currentMessages,
    selectedContact,
    setSelectedContact,
    handleSendMessage
  };
};
