
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface Payment {
  customer: string;
  plan: string;
  amount: string;
  dueDate: string;
  status: 'A vencer' | 'Vencido' | 'Pago';
}

interface UpcomingPaymentsTableProps {
  payments: Payment[];
}

const UpcomingPaymentsTable = ({ payments }: UpcomingPaymentsTableProps) => {
  return (
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
              {payments.map((payment, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-medium">{payment.customer}</td>
                  <td className="py-3 px-4">{payment.plan}</td>
                  <td className="py-3 px-4">{payment.amount}</td>
                  <td className="py-3 px-4">{payment.dueDate}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingPaymentsTable;
