
import { AdminUser } from "@/types";

// Mock user data for the admin dashboard
export const mockUsers: AdminUser[] = [
  { id: '1', name: 'João Silva', email: 'joao@example.com', status: 'online', plan: 'Premium', lastActive: '2 horas atrás', avatar: '', lastSeen: new Date(), unreadCount: 0 },
  { id: '2', name: 'Maria Oliveira', email: 'maria@example.com', status: 'online', plan: 'Basic', lastActive: '5 horas atrás', avatar: '', lastSeen: new Date(), unreadCount: 0 },
  { id: '3', name: 'Pedro Santos', email: 'pedro@example.com', status: 'offline', plan: 'Premium', lastActive: '3 dias atrás', avatar: '', lastSeen: new Date(), unreadCount: 0 },
  { id: '4', name: 'Ana Costa', email: 'ana@example.com', status: 'online', plan: 'Premium', lastActive: '1 hora atrás', avatar: '', lastSeen: new Date(), unreadCount: 0 },
  { id: '5', name: 'Carlos Mendes', email: 'carlos@example.com', status: 'offline', plan: 'Basic', lastActive: '1 semana atrás', avatar: '', lastSeen: new Date(), unreadCount: 0 },
];
