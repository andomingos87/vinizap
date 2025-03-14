
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Users, Clock, AlertTriangle, CreditCard, TrendingUp, ArrowLeft } from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import SalesChart from '@/components/dashboard/SalesChart';
import RevenueChart from '@/components/dashboard/RevenueChart';
import UpcomingPaymentsTable from '@/components/dashboard/UpcomingPaymentsTable';
import { mockSalesData, mockRevenueData, mockUpcomingPayments } from '@/data/dashboardMockData';

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
          <SalesChart data={mockSalesData} />
          <RevenueChart data={mockRevenueData} />
        </div>
        
        <UpcomingPaymentsTable payments={mockUpcomingPayments} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
