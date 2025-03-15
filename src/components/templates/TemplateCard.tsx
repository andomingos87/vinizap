import React from 'react';
import { Template } from '@/types';
import { MessageSquare, Image, Video, FileText, Mic } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: Template;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, viewMode, onClick }) => {
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

  return (
    <div 
      className={cn(
        "bg-white border rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer",
        viewMode === 'list' ? "flex items-center" : ""
      )}
      onClick={onClick}
    >
      {viewMode === 'list' ? (
        <>
          <div className="p-3 flex-grow flex items-center gap-3">
            <div className="flex-shrink-0">
              {getIconByType(template.type)}
            </div>
            <div className="flex-grow min-w-0">
              <div className="font-medium truncate">{template.name}</div>
              <div className="text-sm text-gray-600 truncate">{template.content}</div>
            </div>
          </div>
          <div className="p-3 flex-shrink-0">
            <Badge variant="secondary" className="text-xs">
              {template.category}
            </Badge>
          </div>
        </>
      ) : (
        <div className="p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {getIconByType(template.type)}
              <span className="font-medium truncate">{template.name}</span>
            </div>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {template.category}
            </Badge>
          </div>
          
          <div className="text-sm text-gray-600 truncate">
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
      )}
    </div>
  );
};

export default TemplateCard;
