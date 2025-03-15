import React, { useState } from 'react';
import { Template, TemplateCategory } from '@/types';
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
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import CreateTemplateModal from './CreateTemplateModal';
import TemplateViewModal from './TemplateViewModal';
import TemplateCard from './TemplateCard';
import { useToast } from "@/hooks/use-toast";

interface TemplatesListProps {
  templates: Template[];
  onInsertTemplate?: (template: Template) => void;
  onNewTemplate?: () => void;
  onEditTemplate?: (templateId: string) => void;
}

const TemplatesList: React.FC<TemplatesListProps> = ({ 
  templates,
  onInsertTemplate,
  onNewTemplate,
  onEditTemplate,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();

  const categories: TemplateCategory[] = ['Atendimento', 'Vendas', 'Financeiro', 'Outros'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchValue.toLowerCase()) || 
                          template.content.toLowerCase().includes(searchValue.toLowerCase());
    
    if (categoryFilter === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && template.category === categoryFilter;
    }
  });

  const handleCreateTemplate = (templateData: any) => {
    // In a real application, this would send the data to an API
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: templateData.name,
      content: templateData.content,
      type: templateData.type,
      category: templateData.category,
      fileUrl: templateData.fileUrl,
    };
    
    // Normally you would update the state with the new template
    // This is just simulating that functionality
    toast({
      title: "Template criado",
      description: `Template "${templateData.name}" foi criado com sucesso.`,
    });
    
    setIsCreateModalOpen(false);
  };

  const handleSaveTemplate = (updatedTemplate: Template) => {
    // In a real application, this would send the data to an API to update the template
    // For now, we'll just show a toast
    toast({
      title: "Template atualizado",
      description: `Template "${updatedTemplate.name}" foi atualizado com sucesso.`,
    });
    
    setIsViewModalOpen(false);
  };

  const handleDeleteTemplate = (templateId: string) => {
    // In a real application, this would send a request to delete the template
    // For now, we'll just show a toast
    toast({
      title: "Template excluído",
      description: "O template foi excluído com sucesso.",
      variant: "destructive",
    });
    
    setIsViewModalOpen(false);
  };

  const handleViewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center mb-3">
          <h2 className="text-lg font-semibold flex-grow">Templates</h2>
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
              onClick={() => setIsCreateModalOpen(true)}
              title="Criar novo template"
            >
              <PlusCircle className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-vinizap-primary"
            placeholder="Pesquisar templates"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-2 border-b flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              {categoryFilter === 'all' ? 'Todas categorias' : categoryFilter}
              <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={categoryFilter} onValueChange={(value: any) => setCategoryFilter(value)}>
              <DropdownMenuRadioItem value="all">Todas categorias</DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuRadioItem key={category} value={category}>
                  {category}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="text-xs text-gray-500">
          {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}
        </div>
      </div>

      {/* Templates list */}
      <div className="flex-grow overflow-y-auto">
        {filteredTemplates.length > 0 ? (
          <div className={cn(
            "p-2",
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" 
              : "flex flex-col gap-2"
          )}>
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                viewMode={viewMode}
                onClick={() => handleViewTemplate(template)}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Nenhum template encontrado
          </div>
        )}
      </div>

      {/* Create Template Modal */}
      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTemplate}
      />

      {/* View/Edit/Delete Template Modal */}
      <TemplateViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        template={selectedTemplate}
        onSave={handleSaveTemplate}
        onDelete={handleDeleteTemplate}
      />
    </div>
  );
};

export default TemplatesList;
