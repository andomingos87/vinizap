import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { TabType } from '@/components/layout/MainLayout';
import ContactsList from '@/components/chat/ContactsList';
import ConversationPanel from '@/components/chat/ConversationPanel';
import TemplatesList from '@/components/templates/TemplatesList';
import FunnelsList from '@/components/funnels/FunnelsList';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Contact, Message } from '@/types';
import { contacts, conversations, templates, funnels } from '@/data/mockData';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Show onboarding modal when user logs in
  useEffect(() => {
    if (user) {
      // In a real app, you might want to check if user has completed onboarding before
      // For now, we'll just show it every time they log in
      setShowOnboarding(true);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab !== 'chat') {
      setSelectedContactId(null);
      setSelectedContact(null);
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedContactId) {
      const contact = contacts.find(c => c.id === selectedContactId) || null;
      setSelectedContact(contact);
      
      const msgs = conversations[selectedContactId] || [];
      setCurrentMessages(msgs);
    } else {
      setCurrentMessages([]);
    }
  }, [selectedContactId]);

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
    
    if (activeTab !== 'chat') {
      setActiveTab('chat');
    }
  };

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

  const handleInsertTemplate = (template: any) => {
    if (activeTab === 'chat' && selectedContactId) {
      handleSendMessage(template.content, 'text');
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex flex-grow overflow-hidden">
            {(!isMobile || !selectedContactId) && (
              <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 ${isMobile && selectedContactId ? 'hidden' : 'block'}`}>
                <ContactsList 
                  contacts={contacts} 
                  selectedContactId={selectedContactId}
                  onSelectContact={handleSelectContact} 
                />
              </div>
            )}
            <div className={`flex-grow ${(!selectedContactId && isMobile) ? 'hidden' : 'block'}`}>
              <ConversationPanel 
                contact={selectedContact}
                messages={currentMessages}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        );
      case 'templates':
        return (
          <div className="flex flex-grow overflow-hidden">
            <div className="w-full">
              <TemplatesList 
                templates={templates} 
                onInsertTemplate={handleInsertTemplate}
              />
            </div>
          </div>
        );
      case 'funnels':
        return (
          <div className="flex flex-grow overflow-hidden">
            <div className="w-full">
              <FunnelsList 
                funnels={funnels} 
                templates={templates}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout activeTab={activeTab} onChangeTab={handleTabChange}>
      <div className="h-full flex flex-col overflow-hidden">
        {renderMainContent()}

        {/* Onboarding Modal */}
        <OnboardingModal 
          open={showOnboarding} 
          onOpenChange={setShowOnboarding} 
        />
      </div>
    </MainLayout>
  );
};

export default Index;
