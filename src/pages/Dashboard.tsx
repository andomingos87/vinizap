
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, LineChart, Line } from 'recharts';
import { Users, Clock, AlertTriangle, CreditCard, TrendingUp } from 'lucide-react';

// Mock data for the dashboard
const mockSalesData = [
  { month: 'Jan', sales: 12 },
  { month: 'Fev', sales: 19 },
  { month: 'Mar', sales: 15 },
  { month: 'Abr', sales: 22 },
  { month: 'Mai', sales: 26 },
  { month: 'Jun', sales: 30 },
];

const mockRevenueData = [
  { month: 'Jan', revenue: 1200 },
  { month: 'Fev', revenue: 1900 },
  { month: 'Mar', revenue: 1500 },
  { month: 'Abr', revenue: 2200 },
  { month: 'Mai', revenue: 2600 },
  { month: 'Jun', revenue: 3000 },
];

const Dashboard = () => {
  const totalCustomers = 48;
  const activeCustomers = 35;
  const overdueCustomers = 5;
  const upcomingPayments = 8;
  const totalRevenue = 'R$ 12.500';
  
  return (
    <MainLayout>
      <div className="p-6 h-full overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard de Vendas</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <MetricCard 
            title="Total de Clientes" 
            value={totalCustomers} 
            description="Clientes cadastrados"
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard 
            title="Clientes Ativos" 
            value={activeCustomers} 
            description={`${Math.round((activeCustomers/totalCustomers) * 100)}% do total`}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <MetricCard 
            title="Pagamentos Vencidos" 
            value={overdueCustomers} 
            description={`${Math.round((overdueCustomers/totalCustomers) * 100)}% do total`}
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <MetricCard 
            title="A Vencer" 
            value={upcomingPayments} 
            description="Nos próximos 7 dias"
            icon={<Clock className="h-5 w-5" />}
          />
          <MetricCard 
            title="Faturamento" 
            value={totalRevenue} 
            description="Total no mês"
            icon={<CreditCard className="h-5 w-5" />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Mês</CardTitle>
              <CardDescription>Número de clientes adquiridos</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                className="h-[300px]"
                config={{
                  sales: {
                    label: "Vendas",
                    color: "#6366f1"
                  }
                }}
              >
                <BarChart data={mockSalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="sales" name="Vendas" fill="#6366f1" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Faturamento por Mês</CardTitle>
              <CardDescription>Receita mensal (R$)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                className="h-[300px]"
                config={{
                  revenue: {
                    label: "Faturamento",
                    color: "#10b981"
                  }
                }}
              >
                <LineChart data={mockRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomRevenueTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Faturamento" stroke="#10b981" activeDot={{ r: 8 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Próximos Vencimentos</CardTitle>
            <CardDescription>Clientes com pagamentos a vencer nos próximos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Cliente</th>
                  <th className="text-left py-3 px-4">Plano</th>
                  <th className="text-left py-3 px-4">Valor</th>
                  <th className="text-left py-3 px-4">Vencimento</th>
                  <th className="text-right py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Maria Oliveira</td>
                  <td className="py-3 px-4">Premium</td>
                  <td className="py-3 px-4">R$ 300,00</td>
                  <td className="py-3 px-4">12/06/2025</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">A vencer</span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Carlos Santos</td>
                  <td className="py-3 px-4">Básico</td>
                  <td className="py-3 px-4">R$ 150,00</td>
                  <td className="py-3 px-4">13/06/2025</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">A vencer</span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Ana Costa</td>
                  <td className="py-3 px-4">Premium</td>
                  <td className="py-3 px-4">R$ 300,00</td>
                  <td className="py-3 px-4">14/06/2025</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">A vencer</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
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

// Custom tooltips for the charts
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium">{`${payload[0].payload.month}: ${payload[0].value} vendas`}</p>
      </div>
    );
  }
  return null;
};

const CustomRevenueTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium">{`${payload[0].payload.month}: R$ ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

export default Dashboard;
