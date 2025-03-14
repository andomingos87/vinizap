
// Message types
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  type: MessageType;
  senderId: string;
  status: MessageStatus;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileThumbnail?: string;
}

// Contact/Chat types
export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  isGroup?: boolean;
  participants?: number;
  isAddressBook?: boolean; // Flag to identify contacts from the address book
  unreadCount: number;
  lastMessage?: Message;
  phone?: string; // Adding the phone property as optional
}

// Admin types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline';
  plan: string;
  lastActive: string;
  avatar: string;
  lastSeen: Date;
  unreadCount: number;
}

// Template types
export type TemplateType = 'text' | 'image' | 'video' | 'audio' | 'file';
export type TemplateCategory = 'Atendimento' | 'Vendas' | 'Financeiro' | 'Outros';

export interface Template {
  id: string;
  name: string;
  content: string;
  type: TemplateType;
  category: TemplateCategory;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

// Funnel types
export type StepCondition = 'none' | 'response' | 'click' | 'custom';

export interface FunnelStep {
  id: string;
  name: string;
  templateId: string;
  delay: number; // in minutes
  condition: StepCondition;
  customCondition?: string;
}

export interface Funnel {
  id: string;
  name: string;
  description: string;
  steps: FunnelStep[];
}
