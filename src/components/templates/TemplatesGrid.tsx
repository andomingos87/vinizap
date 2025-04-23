
import React from 'react';
import { Template } from '@/types';
import { cn } from '@/lib/utils';
import TemplateCard from './TemplateCard';

interface TemplatesGridProps {
  templates: Template[];
  viewMode: 'grid' | 'list';
  onTemplateClick: (template: Template) => void;
}

export const TemplatesGrid: React.FC<TemplatesGridProps> = ({
  templates,
  viewMode,
  onTemplateClick
}) => {
  if (templates.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum template encontrado
      </div>
    );
  }

  return (
    <div className={cn(
      "p-2",
      viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" 
        : "flex flex-col gap-2"
    )}>
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          viewMode={viewMode}
          onClick={() => onTemplateClick(template)}
        />
      ))}
    </div>
  );
};
