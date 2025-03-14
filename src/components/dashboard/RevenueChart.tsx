
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Custom tooltip component
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

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
  }>;
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
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
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomRevenueTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="Faturamento" stroke="#25D366" activeDot={{ r: 8 }} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
