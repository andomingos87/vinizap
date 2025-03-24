
import React, { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, FileText, Filter, Grid, List } from 'lucide-react';
import UserMenu from './UserMenu';
import { cn } from '@/lib/utils';

export type TabType = 'chat' | 'templates' | 'funnels';

interface HeaderProps {
  currentTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  viewMode = 'grid',
  onViewModeChange
}) => {
  const location = useLocation();

  // Determine if we're on dashboard page - memoized for performance
  const isDashboard = useMemo(() => 
    location.pathname.includes('/dashboard'), 
    [location.pathname]
  );

  // Navigation tabs configuration
  const navItems = useMemo(() => [
    { id: 'chat' as const, name: 'Chat', icon: MessageSquare },
    { id: 'templates' as const, name: 'Templates', icon: FileText },
    { id: 'funnels' as const, name: 'Funis', icon: Filter }
  ], []);

  // Handle tab change with useCallback for better performance
  const handleTabChange = useCallback((tab: TabType) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  }, [onTabChange]);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  }, [onViewModeChange]);

  return (
    <header className="border-b bg-white py-3 px-6 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-xl font-bold text-vinizap-primary">ZapVenda</h1>
        
        {/* Navigation - Hide on Dashboard */}
        {!isDashboard && (
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex items-center px-4 py-1 rounded-full text-sm font-medium transition-colors",
                  currentTab === item.id 
                    ? "bg-vinizap-primary/10 text-vinizap-primary" 
                    : "text-gray-500 hover:bg-gray-100"
                )}
                onClick={() => handleTabChange(item.id)}
              >
                <item.icon className={cn(
                  "w-4 h-4 mr-2",
                  currentTab === item.id ? "text-vinizap-primary" : "text-gray-400"
                )} />
                {item.name}
              </button>
            ))}
            
            {/* View mode toggle for templates */}
            {currentTab === 'templates' && onViewModeChange && (
              <div className="flex items-center border rounded-md overflow-hidden ml-2">
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={cn(
                    "p-1.5 transition-colors",
                    viewMode === 'grid' 
                      ? "bg-vinizap-primary text-white" 
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  )}
                >
                  <Grid size={16} />
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
                  <List size={16} />
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
};

export default React.memo(Header);
