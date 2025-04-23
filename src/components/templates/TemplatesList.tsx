
import React from 'react';
import { Template } from '@/types';
import { TemplatesHeader } from './TemplatesHeader';
import { TemplatesGrid } from './TemplatesGrid';
import CreateTemplateModal from './CreateTemplateModal';
import TemplateViewModal from './TemplateViewModal';
import { useTemplatesState } from '@/hooks/use-templates-state';

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
  const {
    searchValue,
    setSearchValue,
    categoryFilter,
    setCategoryFilter,
    viewMode,
    setViewMode,
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedTemplate,
    setSelectedTemplate,
    isViewModalOpen,
    setIsViewModalOpen,
    categories,
    filteredTemplates,
    toast
  } = useTemplatesState(templates);

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
    
    toast({
      title: "Template criado",
      description: `Template "${templateData.name}" foi criado com sucesso.`,
    });
    
    setIsCreateModalOpen(false);
  };

  const handleSaveTemplate = (updatedTemplate: Template) => {
    toast({
      title: "Template atualizado",
      description: `Template "${updatedTemplate.name}" foi atualizado com sucesso.`,
    });
    
    setIsViewModalOpen(false);
  };

  const handleDeleteTemplate = (templateId: string) => {
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
      <TemplatesHeader 
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateClick={() => setIsCreateModalOpen(true)}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
      />

      <div className="p-2 border-b flex justify-end">
        <div className="text-xs text-gray-500">
          {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <TemplatesGrid 
          templates={filteredTemplates}
          viewMode={viewMode}
          onTemplateClick={handleViewTemplate}
        />
      </div>

      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTemplate}
      />

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
