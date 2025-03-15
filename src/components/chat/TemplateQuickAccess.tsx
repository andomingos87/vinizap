import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateQuickAccessProps {
  onClose: () => void;
  onSelectTemplate: (template: string) => void;
}

const TemplateQuickAccess: React.FC<TemplateQuickAccessProps> = ({
  onClose,
  onSelectTemplate
}) => {
  const templates = ['Boas-vindas', 'Proposta comercial', 'Agendamento', 'Lista de preços'];

  return (
    <div className="bg-white border-t p-2 max-h-[200px] overflow-y-auto animate-slide-in">
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="text-sm font-medium">Templates Rápidos</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template, index) => (
          <div 
            key={index} 
            className="p-2 bg-gray-50 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition-colors" 
            onClick={() => onSelectTemplate(template)}
          >
            {template}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateQuickAccess;