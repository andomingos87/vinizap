
import React, { useState } from 'react';
import { Contact } from '@/types';
import { Search, MessageSquarePlus, Filter, User, Users, AddressBook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ContactItem from './ContactItem';

interface ContactsListProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (contactId: string) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ 
  contacts, 
  selectedContactId, 
  onSelectContact 
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'direct' | 'groups' | 'address'>('all');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchValue.toLowerCase());
    
    switch (activeFilter) {
      case 'direct':
        return matchesSearch && !contact.isGroup && !contact.isAddressBook;
      case 'groups':
        return matchesSearch && contact.isGroup;
      case 'address':
        return matchesSearch && contact.isAddressBook;
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center mb-3">
          <h2 className="text-lg font-semibold flex-grow">Conversas</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MessageSquarePlus className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-vinizap-primary"
            placeholder="Pesquisar conversas"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-2 border-b flex space-x-1 overflow-x-auto">
        <Button 
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 h-8 text-xs rounded-full whitespace-nowrap",
            activeFilter === 'all' && "bg-vinizap-primary text-white hover:text-white hover:bg-vinizap-primary/90"
          )}
          onClick={() => setActiveFilter('all')}
        >
          <Filter className="h-3.5 w-3.5 mr-1" />
          Todos
        </Button>
        <Button 
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 h-8 text-xs rounded-full whitespace-nowrap",
            activeFilter === 'direct' && "bg-vinizap-primary text-white hover:text-white hover:bg-vinizap-primary/90"
          )}
          onClick={() => setActiveFilter('direct')}
        >
          <User className="h-3.5 w-3.5 mr-1" />
          Diretos
        </Button>
        <Button 
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 h-8 text-xs rounded-full whitespace-nowrap",
            activeFilter === 'groups' && "bg-vinizap-primary text-white hover:text-white hover:bg-vinizap-primary/90"
          )}
          onClick={() => setActiveFilter('groups')}
        >
          <Users className="h-3.5 w-3.5 mr-1" />
          Grupos
        </Button>
        <Button 
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 h-8 text-xs rounded-full whitespace-nowrap",
            activeFilter === 'address' && "bg-vinizap-primary text-white hover:text-white hover:bg-vinizap-primary/90"
          )}
          onClick={() => setActiveFilter('address')}
        >
          <AddressBook className="h-3.5 w-3.5 mr-1" />
          Agenda
        </Button>
      </div>

      {/* Contact list */}
      <div className="flex-grow overflow-y-auto">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isActive={contact.id === selectedContactId}
              onClick={() => onSelectContact(contact.id)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            Nenhuma conversa encontrada
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsList;
