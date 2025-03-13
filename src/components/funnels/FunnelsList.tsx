
import React, { useState } from 'react';
import { Funnel, Template } from '@/types';
import { Search, PlusCircle, MoreVertical, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import CreateFunnelModal from './CreateFunnelModal';
import { useToast } from "@/hooks/use-toast";

interface FunnelsListProps {
  funnels: Funnel[];
  onNewFunnel?: () => void;
  onEditFunnel?: (funnelId: string) => void;
  onSelectFunnel?: (funnelId: string) => void;
  templates?: Template[];
}

const FunnelsList: React.FC<FunnelsListProps> = ({ 
  funnels,
  onNewFunnel,
  onEditFunnel,
  onSelectFunnel,
  templates = []
}) => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentFunnels, setCurrentFunnels] = useState<Funnel[]>(funnels);

  const filteredFunnels = currentFunnels.filter(funnel => {
    return funnel.name.toLowerCase().includes(searchValue.toLowerCase()) || 
           funnel.description.toLowerCase().includes(searchValue.toLowerCase());
  });

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    if (onNewFunnel) {
      onNewFunnel();
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSaveFunnel = (funnelData: Omit<Funnel, "id">) => {
    const newFunnel: Funnel = {
      ...funnelData,
      id: crypto.randomUUID(),
    };

    setCurrentFunnels([...currentFunnels, newFunnel]);
    setIsCreateModalOpen(false);
    
    toast({
      title: "Funil criado",
      description: `${newFunnel.name} foi criado com sucesso`,
    });
  };

  const templateOptions = templates.map(template => ({
    id: template.id,
    name: template.name
  }));

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center mb-3">
          <h2 className="text-lg font-semibold flex-grow">Funis</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleOpenCreateModal}
          >
            <PlusCircle className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-vinizap-primary"
            placeholder="Pesquisar funis"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* Funnels list */}
      <div className="flex-grow overflow-y-auto">
        {filteredFunnels.length > 0 ? (
          <div className="p-2 grid grid-cols-1 gap-2">
            {filteredFunnels.map((funnel) => (
              <div 
                key={funnel.id}
                className="bg-white border rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <FunnelIcon className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">{funnel.name}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectFunnel?.(funnel.id)}>
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditFunnel?.(funnel.id)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {funnel.description}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Badge variant="outline" className="text-xs">
                      {funnel.steps.length} etapas
                    </Badge>
                  </div>
                  
                  <div className="mt-3 flex items-center text-xs">
                    {funnel.steps.slice(0, 3).map((step, index) => (
                      <React.Fragment key={step.id}>
                        <div className="px-2 py-1 bg-gray-100 rounded text-xs whitespace-nowrap">
                          {step.name}
                        </div>
                        {index < Math.min(funnel.steps.length - 1, 2) && (
                          <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                        )}
                      </React.Fragment>
                    ))}
                    {funnel.steps.length > 3 && (
                      <span className="ml-1 text-xs text-gray-500">
                        +{funnel.steps.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Nenhum funil encontrado
          </div>
        )}
      </div>

      <CreateFunnelModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveFunnel}
        templates={templateOptions}
      />
    </div>
  );
};

const FunnelIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M1 1h22v5l-10 13v4l-4-2v-2L1 6V1z" />
  </svg>
);

export default FunnelsList;
