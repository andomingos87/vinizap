
import React from 'react';
import { Search, PlusCircle, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CategoryFilter } from './CategoryFilter';

interface TemplatesHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateClick: () => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: any) => void;
  categories: string[];
}

export const TemplatesHeader: React.FC<TemplatesHeaderProps> = ({
  searchValue,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onCreateClick,
  categoryFilter,
  onCategoryFilterChange,
  categories
}) => {
  return (
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
            onClick={() => onViewModeChange('grid')}
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
            onClick={() => onViewModeChange('list')}
            title="Visualização em lista"
          >
            <List className="h-4 w-4 text-gray-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onCreateClick}
            title="Criar novo template"
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
            placeholder="Pesquisar templates"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <CategoryFilter
          value={categoryFilter}
          onChange={onCategoryFilterChange}
          categories={categories}
        />
      </div>
    </div>
  );
};
