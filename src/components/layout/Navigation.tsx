
import React, { useMemo } from 'react';
import { MessageSquare, FileText, Filter, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TabType } from './Header';

interface NavigationProps {
  currentTab?: TabType;
  onTabChange: (tab: TabType) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  showViewToggle?: boolean;
}

const Navigation = ({
  currentTab,
  onTabChange,
  viewMode = 'grid',
  onViewModeChange,
  showViewToggle = false
}: NavigationProps) => {
  // Navigation tabs configuration
  const navItems = useMemo(() => [
    { id: 'chat' as const, name: 'Chat', icon: MessageSquare, path: '/' },
    { id: 'templates' as const, name: 'Templates', icon: FileText, path: '/' },
    { id: 'funnels' as const, name: 'Funis', icon: Filter, path: '/' }
  ], []);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  return (
    <div className="flex mt-2 -mb-0.5 items-center">
      <div className="flex-1 flex">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              currentTab === item.id 
                ? "border-vinizap-primary text-vinizap-dark" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className={cn(
              "w-4 h-4 mr-2",
              currentTab === item.id ? "text-vinizap-primary" : "text-gray-400"
            )} />
            {item.name}
          </button>
        ))}
      </div>
      
      {/* View mode toggle for templates - only shown when on templates tab and showViewToggle is true */}
      {showViewToggle && currentTab === 'templates' && onViewModeChange && (
        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            onClick={() => handleViewModeChange('grid')}
            className={cn(
              "p-1.5 transition-colors",
              viewMode === 'grid' 
                ? "bg-vinizap-primary text-white" 
                : "bg-white text-gray-500 hover:bg-gray-100"
            )}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={cn(
              "p-1.5 transition-colors",
              viewMode === 'list' 
                ? "bg-vinizap-primary text-white" 
                : "bg-white text-gray-500 hover:bg-gray-100"
            )}
          >
            <List size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(Navigation);
