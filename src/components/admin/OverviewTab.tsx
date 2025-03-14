
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Users, UserCheck, UserX, Wallet } from 'lucide-react';
import MetricCard from './MetricCard';
import { AdminUser } from '@/types';

interface OverviewTabProps {
  mockUsers: AdminUser[];
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
}

const OverviewTab = ({ mockUsers, totalUsers, activeUsers, premiumUsers }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total de Usuários" 
          value={totalUsers} 
          description="Usuários registrados"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard 
          title="Usuários Ativos" 
          value={activeUsers} 
          description={`${Math.round((activeUsers/totalUsers) * 100)}% do total`}
          icon={<UserCheck className="h-5 w-5" />}
        />
        <MetricCard 
          title="Usuários Inativos" 
          value={totalUsers - activeUsers} 
          description={`${Math.round(((totalUsers - activeUsers)/totalUsers) * 100)}% do total`}
          icon={<UserX className="h-5 w-5" />}
        />
        <MetricCard 
          title="Assinantes Premium" 
          value={premiumUsers} 
          description={`${Math.round((premiumUsers/totalUsers) * 100)}% do total`}
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usuários Recentes</CardTitle>
            <CardDescription>Os 5 usuários mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plano</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.slice(0, 5).map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status === 'online' ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell>{user.plan}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Assinatura</CardTitle>
            <CardDescription>Divisão por tipo de plano</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Premium</div>
                <div className="text-sm text-gray-500">{premiumUsers} usuários</div>
              </div>
              <Progress value={premiumUsers / totalUsers * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Básico</div>
                <div className="text-sm text-gray-500">{totalUsers - premiumUsers} usuários</div>
              </div>
              <Progress value={(totalUsers - premiumUsers) / totalUsers * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
