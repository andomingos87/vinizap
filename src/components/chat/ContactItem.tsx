
import React from 'react';
import { Contact } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContactItemProps {
  contact: Contact;
  isActive?: boolean;
  onClick?: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ 
  contact, 
  isActive, 
  onClick 
}) => {
  const formattedTime = contact.lastMessage?.timestamp 
    ? formatDistanceToNow(contact.lastMessage.timestamp, { addSuffix: true, locale: ptBR })
    : '';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div 
      className={cn(
        "flex items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200",
        isActive && "bg-gray-100"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-12 w-12 border border-gray-200">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
        </Avatar>
        {contact.status === 'online' && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-vinizap-primary rounded-full border-2 border-white"></span>
        )}
      </div>
      
      <div className="ml-3 flex-grow overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="font-medium truncate">{contact.name}</span>
          <span className="text-xs text-gray-500">{formattedTime}</span>
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center text-gray-500 text-sm truncate max-w-[70%]">
            {contact.lastMessage?.senderId === 'user' && (
              <CheckCheck className={cn(
                "w-3.5 h-3.5 mr-1",
                contact.lastMessage.status === 'read' ? "text-blue-500" : "text-gray-400"
              )} />
            )}
            <span className="truncate">{contact.lastMessage?.content}</span>
          </div>
          
          {contact.unreadCount > 0 && (
            <span className="bg-vinizap-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
              {contact.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactItem;
