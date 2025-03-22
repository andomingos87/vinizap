
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { TabType } from '@/components/layout/Header';
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
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Check if user has existing WhatsApp connection
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (!user) {
        setIsCheckingConnection(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('whatsapp_connections')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'connected')
          .maybeSingle();

        if (error) {
          console.error('Error checking connection status:', error);
        }

        // If no active connection found, show onboarding
        if (!data) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error('Error fetching connection status:', err);
      } finally {
        setIsCheckingConnection(false);
      }
    };

    checkExistingConnection();
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

  // Handle onboarding completion
  const handleOnboardingClose = () => {
    setShowOnboarding(false);
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

  // Show loading indicator while checking connection status
  if (isCheckingConnection) {
    return (
      <MainLayout activeTab={activeTab} onChangeTab={handleTabChange}>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeTab={activeTab} onChangeTab={handleTabChange}>
      <div className="h-full flex flex-col overflow-hidden">
        {renderMainContent()}

        {/* Onboarding Modal */}
        <OnboardingModal 
          open={showOnboarding} 
          onOpenChange={handleOnboardingClose} 
        />
      </div>
    </MainLayout>
  );
};

export default Index;
