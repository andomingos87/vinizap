
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, PieChart, DollarSign, UserCheck, UserX, Wallet } from 'lucide-react';

// Mock data for the dashboard
const mockUsers = [
  { id: 1, name: 'João Silva', email: 'joao@example.com', status: 'active', plan: 'Premium', lastActive: '2 horas atrás' },
  { id: 2, name: 'Maria Oliveira', email: 'maria@example.com', status: 'active', plan: 'Basic', lastActive: '5 horas atrás' },
  { id: 3, name: 'Pedro Santos', email: 'pedro@example.com', status: 'inactive', plan: 'Premium', lastActive: '3 dias atrás' },
  { id: 4, name: 'Ana Costa', email: 'ana@example.com', status: 'active', plan: 'Premium', lastActive: '1 hora atrás' },
  { id: 5, name: 'Carlos Mendes', email: 'carlos@example.com', status: 'inactive', plan: 'Basic', lastActive: '1 semana atrás' },
];

const AdminDashboard = () => {
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(user => user.status === 'active').length;
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
          
          <TabsContent value="overview" className="space-y-6">
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
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.status === 'active' ? 'Ativo' : 'Inativo'}
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
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuários</CardTitle>
                <CardDescription>Detalhes de todos os usuários registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Última Atividade</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </TableCell>
                        <TableCell>{user.plan}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Detalhes</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard 
                title="Receita Mensal" 
                value="R$ 15.200" 
                description="Mês atual"
                icon={<DollarSign className="h-5 w-5" />}
              />
              <MetricCard 
                title="Receita Total" 
                value="R$ 124.500" 
                description="Desde o início"
                icon={<PieChart className="h-5 w-5" />}
              />
              <MetricCard 
                title="Crescimento" 
                value="+12%" 
                description="Em relação ao mês anterior"
                icon={<TrendingUp className="h-5 w-5" />}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Histórico Financeiro</CardTitle>
                <CardDescription>Resumo dos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Receita</TableHead>
                      <TableHead>Novos Usuários</TableHead>
                      <TableHead>Cancelamentos</TableHead>
                      <TableHead>Crescimento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Março 2025</TableCell>
                      <TableCell>R$ 15.200</TableCell>
                      <TableCell>32</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell className="text-green-600">+12%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Fevereiro 2025</TableCell>
                      <TableCell>R$ 13.600</TableCell>
                      <TableCell>28</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell className="text-green-600">+8%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Janeiro 2025</TableCell>
                      <TableCell>R$ 12.500</TableCell>
                      <TableCell>24</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell className="text-green-600">+5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Dezembro 2024</TableCell>
                      <TableCell>R$ 11.900</TableCell>
                      <TableCell>22</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell className="text-green-600">+3%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Novembro 2024</TableCell>
                      <TableCell>R$ 11.500</TableCell>
                      <TableCell>19</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell className="text-green-600">+6%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Outubro 2024</TableCell>
                      <TableCell>R$ 10.800</TableCell>
                      <TableCell>17</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell className="text-green-600">+4%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Componente para cartões de métricas
const MetricCard = ({ title, value, description, icon }: { title: string, value: string | number, description: string, icon: React.ReactNode }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default AdminDashboard;
