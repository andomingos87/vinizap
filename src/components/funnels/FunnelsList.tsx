import React, { useState } from 'react';
import { Funnel, Template } from '@/types';
import { 
  Search, 
  PlusCircle, 
  LayoutGrid, 
  List,
  Filter,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import CreateFunnelModal from './CreateFunnelModal';
import FunnelCard from './FunnelCard';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredFunnels = currentFunnels.filter(funnel => {
    const matchesSearch = funnel.name.toLowerCase().includes(searchValue.toLowerCase()) || 
                         funnel.description.toLowerCase().includes(searchValue.toLowerCase());
    
    if (statusFilter === 'all') {
      return matchesSearch;
    } else if (statusFilter === 'active') {
      return matchesSearch && funnel.isActive;
    } else {
      return matchesSearch && !funnel.isActive;
    }
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

  const handleDeleteFunnel = (funnelId: string) => {
    // In a real application, this would send a request to delete the funnel
    // For now, we'll just update the local state and show a toast
    setCurrentFunnels(currentFunnels.filter(funnel => funnel.id !== funnelId));
    
    toast({
      title: "Funil excluído",
      description: "O funil foi excluído com sucesso.",
      variant: "destructive",
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
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8",
                viewMode === 'grid' && "bg-gray-100"
              )}
              onClick={() => setViewMode('grid')}
              title="Visualização em grade"
            >
              <LayoutGrid className="h-4 w-4 text-gray-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8",
                viewMode === 'list' && "bg-gray-100"
              )}
              onClick={() => setViewMode('list')}
              title="Visualização em lista"
            >
              <List className="h-4 w-4 text-gray-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleOpenCreateModal}
              title="Criar novo funil"
            >
              <PlusCircle className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-vinizap-primary"
              placeholder="Pesquisar funis"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1 whitespace-nowrap">
                <Filter className="h-3.5 w-3.5" />
                {statusFilter === 'all' ? 'Todos status' : statusFilter === 'active' ? 'Ativos' : 'Inativos'}
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <DropdownMenuRadioItem value="all">Todos status</DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                <DropdownMenuRadioItem value="active">Ativos</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="inactive">Inativos</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <div className="p-2 border-b flex justify-end">
        <div className="text-xs text-gray-500">
          {filteredFunnels.length} {filteredFunnels.length === 1 ? 'funil' : 'funis'}
        </div>
      </div>

      {/* Funnels list */}
      <div className="flex-grow overflow-y-auto">
        {filteredFunnels.length > 0 ? (
          <div className={cn(
            "p-2",
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" 
              : "flex flex-col gap-2"
          )}>
            {filteredFunnels.map((funnel) => (
              <FunnelCard
                key={funnel.id}
                funnel={funnel}
                viewMode={viewMode}
                onClick={() => onSelectFunnel?.(funnel.id)}
                onEdit={onEditFunnel}
                onDelete={handleDeleteFunnel}
                templates={templates}
              />
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

export default FunnelsList;
