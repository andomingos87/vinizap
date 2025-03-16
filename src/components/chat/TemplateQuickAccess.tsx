import React, { useState } from 'react';
import { X, ArrowLeft, MessageSquare, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateQuickAccessProps {
  onClose: () => void;
  onSelectTemplate: (template: string) => void;
  onSelectFunnel?: (funnelId: string) => void;
}

type ContentType = 'initial' | 'templates' | 'funnels' | 'templateTypes';
type TemplateType = 'text' | 'audio' | 'image' | 'video' | 'file';

const TemplateQuickAccess: React.FC<TemplateQuickAccessProps> = ({
  onClose,
  onSelectTemplate,
  onSelectFunnel
}) => {
  const [contentType, setContentType] = useState<ContentType>('initial');
  const [selectedTemplateType, setSelectedTemplateType] = useState<TemplateType | null>(null);

  // Mock data - replace with actual data from your application
  const templateTypes = [
    { id: 'text', name: 'Texto', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'audio', name: 'Áudio', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'image', name: 'Imagem', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'video', name: 'Vídeo', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'file', name: 'Arquivo', icon: <MessageSquare className="h-4 w-4" /> }
  ];

  const templates = {
    text: ['Boas-vindas', 'Proposta comercial', 'Agendamento', 'Lista de preços'],
    audio: ['Áudio de boas-vindas', 'Áudio informativo'],
    image: ['Banner promocional', 'Logo da empresa'],
    video: ['Vídeo institucional', 'Tutorial de produto'],
    file: ['Catálogo de produtos', 'Manual do usuário']
  };

  const funnels = [
    { id: 'funnel1', name: 'Funil de Vendas' },
    { id: 'funnel2', name: 'Funil de Atendimento' },
    { id: 'funnel3', name: 'Funil de Pós-Venda' },
    { id: 'funnel4', name: 'Funil de Recuperação' }
  ];

  const handleBackClick = () => {
    if (contentType === 'templates' || contentType === 'funnels') {
      setContentType('initial');
    } else if (contentType === 'templateTypes') {
      setContentType('initial');
    }
  };

  const renderContent = () => {
    switch (contentType) {
      case 'initial':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div 
              className="p-3 bg-gray-50 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition-colors flex flex-col items-center justify-center"
              onClick={() => setContentType('templateTypes')}
            >
              <MessageSquare className="h-5 w-5 mb-1" />
              <span>Templates</span>
            </div>
            <div 
              className="p-3 bg-gray-50 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition-colors flex flex-col items-center justify-center"
              onClick={() => setContentType('funnels')}
            >
              <GitBranch className="h-5 w-5 mb-1" />
              <span>Funis</span>
            </div>
          </div>
        );
      
      case 'templateTypes':
        return (
          <div className="grid grid-cols-2 gap-2">
            {templateTypes.map((type) => (
              <div 
                key={type.id} 
                className="p-2 bg-gray-50 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition-colors flex items-center"
                onClick={() => {
                  setSelectedTemplateType(type.id as TemplateType);
                  setContentType('templates');
                }}
              >
                {type.icon}
                <span className="ml-2">{type.name}</span>
              </div>
            ))}
          </div>
        );
      
      case 'templates':
        return (
          <div className="grid grid-cols-2 gap-2">
            {selectedTemplateType && templates[selectedTemplateType].map((template, index) => (
              <div 
                key={index} 
                className="p-2 bg-gray-50 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSelectTemplate(template)}
              >
                {template}
              </div>
            ))}
          </div>
        );
      
      case 'funnels':
        return (
          <div className="grid grid-cols-2 gap-2">
            {funnels.map((funnel) => (
              <div 
                key={funnel.id} 
                className="p-2 bg-gray-50 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSelectFunnel && onSelectFunnel(funnel.id)}
              >
                {funnel.name}
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (contentType) {
      case 'initial':
        return 'Escolha uma opção';
      case 'templateTypes':
        return 'Escolha um tipo de template';
      case 'templates':
        return `Templates de ${selectedTemplateType}`;
      case 'funnels':
        return 'Funis disponíveis';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white border-t h-[300px] flex flex-col animate-slide-in">
      <div className="flex justify-between items-center p-2 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center">
          {contentType !== 'initial' && (
            <Button variant="ghost" size="icon" className="h-6 w-6 mr-1" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h3 className="text-sm font-medium">{getTitle()}</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-2 overflow-y-auto flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default TemplateQuickAccess;