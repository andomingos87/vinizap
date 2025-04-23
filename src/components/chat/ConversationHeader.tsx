import React from 'react';
import { Contact } from '@/types';
import { UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Search } from './Icons';
interface ConversationHeaderProps {
  contact: Contact;
  onClientRegistrationClick: () => void;
  isClientDrawerOpen: boolean;
  setIsClientDrawerOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}
const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  contact,
  onClientRegistrationClick,
  isClientDrawerOpen,
  setIsClientDrawerOpen,
  children
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
  };
  return <div className="px-4 py-3 bg-white border-b flex items-center shadow-sm">
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
        
        
        <Sheet open={isClientDrawerOpen} onOpenChange={setIsClientDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 mx-0" title="Cadastrar como cliente">
              <UserPlus className="h-5 w-5 text-gray-500" />
            </Button>
          </SheetTrigger>
          {children}
        </Sheet>
      </div>
    </div>;
};
export default ConversationHeader;