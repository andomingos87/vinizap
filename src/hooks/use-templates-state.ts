
import { useState } from 'react';
import { Template, TemplateCategory } from '@/types';
import { useToast } from "@/hooks/use-toast";

export const useTemplatesState = (templates: Template[]) => {
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

  return {
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
  };
};
