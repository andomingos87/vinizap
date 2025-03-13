
import React, { useState } from 'react';
import { Template, TemplateCategory } from '@/types';
import { 
  Search, 
  PlusCircle, 
  MessageSquare, 
  Image, 
  Video, 
  FileText, 
  Mic,
  Filter,
  MoreVertical 
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
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import CreateTemplateModal from './CreateTemplateModal';
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const getIconByType = (type: Template['type']) => {
    switch (type) {
      case 'text':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-green-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'audio':
        return <Mic className="h-5 w-5 text-purple-500" />;
      case 'file':
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

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

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center mb-3">
          <h2 className="text-lg font-semibold flex-grow">Templates</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="h-5 w-5 text-gray-500" />
          </Button>
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

      {/* Categories filter */}
      <div className="p-2 border-b overflow-x-auto whitespace-nowrap">
        <Button 
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 text-xs mr-1 rounded-full",
            categoryFilter === 'all' && "bg-vinizap-primary text-white hover:text-white hover:bg-vinizap-primary/90"
          )}
          onClick={() => setCategoryFilter('all')}
        >
          <Filter className="h-3.5 w-3.5 mr-1" />
          Todas
        </Button>
        
        {categories.map((category) => (
          <Button 
            key={category}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 text-xs mr-1 rounded-full",
              categoryFilter === category && "bg-vinizap-primary text-white hover:text-white hover:bg-vinizap-primary/90"
            )}
            onClick={() => setCategoryFilter(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates list */}
      <div className="flex-grow overflow-y-auto">
        {filteredTemplates.length > 0 ? (
          <div className="p-2 grid grid-cols-1 gap-2">
            {filteredTemplates.map((template) => (
              <div 
                key={template.id}
                className="bg-white border rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getIconByType(template.type)}
                      <span className="font-medium">{template.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onInsertTemplate?.(template)}>
                            Inserir
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditTemplate?.(template.id)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {template.content}
                  </div>
                  
                  {template.type !== 'text' && (
                    <div className="mt-2 flex items-center text-xs text-blue-500">
                      {template.type === 'image' && 'Imagem'}
                      {template.type === 'video' && 'Vídeo'}
                      {template.type === 'audio' && 'Áudio'}
                      {template.type === 'file' && 'Arquivo'}
                    </div>
                  )}
                </div>
              </div>
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
    </div>
  );
};

export default TemplatesList;
