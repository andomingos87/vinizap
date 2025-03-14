
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, PieChart, TrendingUp } from 'lucide-react';
import MetricCard from './MetricCard';

const FinancialTab = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default FinancialTab;
