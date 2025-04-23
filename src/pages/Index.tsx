
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { TabType } from '@/components/layout/Header';
import ContactsList from '@/components/chat/ContactsList';
import ConversationPanel from '@/components/chat/ConversationPanel';
import TemplatesList from '@/components/templates/TemplatesList';
import FunnelsList from '@/components/funnels/FunnelsList';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { useIsMobile } from "@/hooks/use-mobile";
import { contacts, templates, funnels } from '@/data/mockData';
import { useChatState } from '@/hooks/use-chat-state';
import { useOnboardingState } from '@/hooks/use-onboarding-state';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TemplateHandler } from '@/components/chat/TemplateHandler';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const isMobile = useIsMobile();
  const { 
    selectedContactId, 
    setSelectedContactId,
    currentMessages,
    selectedContact,
    setSelectedContact,
    handleSendMessage 
  } = useChatState();
  const {
    showOnboarding,
    setShowOnboarding,
    isCheckingConnection
  } = useOnboardingState();

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
    }
  }, [selectedContactId]);

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
    if (activeTab !== 'chat') {
      setActiveTab('chat');
    }
  };

  if (isCheckingConnection) {
    return (
      <MainLayout activeTab={activeTab} onChangeTab={setActiveTab}>
        <LoadingSpinner />
      </MainLayout>
    );
  }

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
                onInsertTemplate={(template) => handleSendMessage(template.content, 'text')}
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
    <MainLayout activeTab={activeTab} onChangeTab={setActiveTab}>
      <div className="h-full flex flex-col overflow-hidden">
        {renderMainContent()}

        <TemplateHandler 
          activeTab={activeTab}
          selectedContactId={selectedContactId}
          onSendMessage={handleSendMessage}
        />

        <OnboardingModal 
          open={showOnboarding} 
          onOpenChange={() => setShowOnboarding(false)} 
        />
      </div>
    </MainLayout>
  );
};

export default Index;
