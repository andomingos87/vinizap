import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const DangerZone: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          <CardTitle>Zona de Perigo</CardTitle>
        </div>
        <CardDescription>
          Ações irreversíveis relacionadas à sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Tenha cuidado com as ações abaixo, pois elas podem resultar na perda permanente de dados ou acesso.
        </p>
        <div className="space-y-4">
          <Button variant="destructive" className="w-full sm:w-auto">
            Excluir Minha Conta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZone;
