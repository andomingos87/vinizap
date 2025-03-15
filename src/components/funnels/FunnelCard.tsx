import React, { useState } from 'react';
import { Funnel } from '@/types';
import { ArrowRight, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import CreateFunnelModal from './CreateFunnelModal';

interface FunnelCardProps {
  funnel: Funnel;
  viewMode: 'grid' | 'list';
  onClick?: () => void;
  onEdit?: (funnelId: string) => void;
  onDelete?: (funnelId: string) => void;
  templates: { id: string; name: string }[];
}

const FunnelCard: React.FC<FunnelCardProps> = ({ 
  funnel, 
  viewMode, 
  onClick, 
  onEdit, 
  onDelete,
  templates
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
    if (onClick) onClick();
  };

  const handleEditFunnel = (updatedFunnel: Funnel) => {
    if (onEdit) onEdit(updatedFunnel.id);
    setIsModalOpen(false);
  };

  const handleDeleteFunnel = (funnelId: string) => {
    if (onDelete) onDelete(funnelId);
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        className={cn(
          "bg-white border rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer",
          viewMode === 'list' ? "flex items-center" : ""
        )}
        onClick={handleCardClick}
      >
        {viewMode === 'list' ? (
          <>
            <div className="p-3 flex-grow flex items-center gap-3">
              <div className="flex-shrink-0">
                <Filter className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-medium truncate">{funnel.name}</div>
                <div className="text-sm text-gray-600 truncate">{funnel.description}</div>
              </div>
            </div>
            <div className="p-3 flex-shrink-0 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {funnel.steps.length} etapas
              </Badge>
            </div>
          </>
        ) : (
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-purple-500" />
                <div className="font-medium truncate">{funnel.name}</div>
              </div>
              <Badge variant="outline" className="text-xs">
                {funnel.steps.length} etapas
              </Badge>
            </div>
            <div className="text-sm text-gray-600 mb-3 line-clamp-2">
              {funnel.description}
            </div>
            
            <div className="mt-3 flex items-center text-xs">
              {funnel.steps.slice(0, 3).map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="px-2 py-1 bg-gray-100 rounded text-xs whitespace-nowrap">
                    {step.name}
                  </div>
                  {index < Math.min(funnel.steps.length - 1, 2) && (
                    <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                  )}
                </div>
              ))}
              {funnel.steps.length > 3 && (
                <span className="ml-1 text-xs text-gray-500">
                  +{funnel.steps.length - 3} mais
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <CreateFunnelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleEditFunnel}
        onDelete={handleDeleteFunnel}
        templates={templates}
        funnel={funnel}
        mode="edit"
      />
    </>
  );
};

export default FunnelCard;
