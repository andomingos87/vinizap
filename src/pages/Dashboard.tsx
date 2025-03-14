import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, LineChart, Line } from 'recharts';
import { Users, Clock, AlertTriangle, CreditCard, TrendingUp, MessageSquare, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <div className="p-6 h-full overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              asChild
            >
              <Link to="/">
                <ArrowLeft className="h-5 w-5 text-vinizap-primary" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Dashboard de Vendas</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <MetricCard 
            title="Total de Clientes" 
            value={totalCustomers} 
            description="Clientes cadastrados"
            icon={<Users className="h-5 w-5 text-vinizap-primary" />}
          />
          <MetricCard 
            title="Clientes Ativos" 
            value={activeCustomers} 
            description={`${Math.round((activeCustomers/totalCustomers) * 100)}% do total`}
            icon={<TrendingUp className="h-5 w-5 text-vinizap-primary" />}
          />
          <MetricCard 
            title="Pagamentos Vencidos" 
            value={overdueCustomers} 
            description={`${Math.round((overdueCustomers/totalCustomers) * 100)}% do total`}
            icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          />
          <MetricCard 
            title="A Vencer" 
            value={upcomingPayments} 
            description="Nos próximos 7 dias"
            icon={<Clock className="h-5 w-5 text-blue-500" />}
          />
          <MetricCard 
            title="Faturamento" 
            value={totalRevenue} 
            description="Total no mês"
            icon={<CreditCard className="h-5 w-5 text-emerald-500" />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-lg border-b">
              <CardTitle>Vendas por Mês</CardTitle>
              <CardDescription>Número de clientes adquiridos</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer 
                className="h-[300px]"
                config={{
                  sales: {
                    label: "Vendas",
                    color: "#25D366"
                  }
                }}
              >
                <BarChart data={mockSalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="sales" name="Vendas" fill="#25D366" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-lg border-b">
              <CardTitle>Faturamento por Mês</CardTitle>
              <CardDescription>Receita mensal (R$)</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer 
                className="h-[300px]"
                config={{
                  revenue: {
                    label: "Faturamento",
                    color: "#25D366"
                  }
                }}
              >
                <LineChart data={mockRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomRevenueTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Faturamento" stroke="#25D366" activeDot={{ r: 8 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-lg border-b">
            <CardTitle>Próximos Vencimentos</CardTitle>
            <CardDescription>Clientes com pagamentos a vencer nos próximos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Plano</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Valor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Vencimento</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 font-medium">Maria Oliveira</td>
                    <td className="py-3 px-4">Premium</td>
                    <td className="py-3 px-4">R$ 300,00</td>
                    <td className="py-3 px-4">12/06/2025</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">A vencer</span>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 font-medium">Carlos Santos</td>
                    <td className="py-3 px-4">Básico</td>
                    <td className="py-3 px-4">R$ 150,00</td>
                    <td className="py-3 px-4">13/06/2025</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">A vencer</span>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 font-medium">Ana Costa</td>
                    <td className="py-3 px-4">Premium</td>
                    <td className="py-3 px-4">R$ 300,00</td>
                    <td className="py-3 px-4">14/06/2025</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">A vencer</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

// Componente para cartões de métricas
const MetricCard = ({ title, value, description, icon }: { title: string, value: string | number, description: string, icon: React.ReactNode }) => (
  <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
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
