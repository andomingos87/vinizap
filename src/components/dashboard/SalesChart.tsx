
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip } from 'recharts';

// Custom tooltip component
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

interface SalesChartProps {
  data: Array<{
    month: string;
    sales: number;
  }>;
}

const SalesChart = ({ data }: SalesChartProps) => {
  return (
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
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="sales" name="Vendas" fill="#25D366" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
