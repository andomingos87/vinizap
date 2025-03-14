
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from '@/components/admin/OverviewTab';
import UsersTab from '@/components/admin/UsersTab';
import FinancialTab from '@/components/admin/FinancialTab';
import { mockUsers } from '@/data/adminMockData';

const AdminDashboard = () => {
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(user => user.status === 'online').length;
  const premiumUsers = mockUsers.filter(user => user.plan === 'Premium').length;
  
  return (
    <MainLayout>
      <div className="p-6 h-full overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab 
              mockUsers={mockUsers} 
              totalUsers={totalUsers} 
              activeUsers={activeUsers} 
              premiumUsers={premiumUsers} 
            />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersTab mockUsers={mockUsers} />
          </TabsContent>
          
          <TabsContent value="financial">
            <FinancialTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
