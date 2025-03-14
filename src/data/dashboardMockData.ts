
// Mock data for the dashboard

export const mockSalesData = [
  { month: 'Jan', sales: 12 },
  { month: 'Fev', sales: 19 },
  { month: 'Mar', sales: 15 },
  { month: 'Abr', sales: 22 },
  { month: 'Mai', sales: 26 },
  { month: 'Jun', sales: 30 },
];

export const mockRevenueData = [
  { month: 'Jan', revenue: 1200 },
  { month: 'Fev', revenue: 1900 },
  { month: 'Mar', revenue: 1500 },
  { month: 'Abr', revenue: 2200 },
  { month: 'Mai', revenue: 2600 },
  { month: 'Jun', revenue: 3000 },
];

export const mockUpcomingPayments = [
  {
    customer: 'Maria Oliveira',
    plan: 'Premium',
    amount: 'R$ 300,00',
    dueDate: '12/06/2025',
    status: 'A vencer' as const,
  },
  {
    customer: 'Carlos Santos',
    plan: 'Básico',
    amount: 'R$ 150,00',
    dueDate: '13/06/2025',
    status: 'A vencer' as const,
  },
  {
    customer: 'Ana Costa',
    plan: 'Premium',
    amount: 'R$ 300,00',
    dueDate: '14/06/2025',
    status: 'A vencer' as const,
  },
];
