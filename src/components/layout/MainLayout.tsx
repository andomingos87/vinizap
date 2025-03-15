import React, { ReactNode, useMemo, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';
import Navigation from './Navigation';
import { cn } from '@/lib/utils';

export type TabType = 'chat' | 'templates' | 'funnels';

interface MainLayoutProps {
  children: ReactNode;
  activeTab?: TabType;
  onChangeTab?: (tab: TabType) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

// Loading spinner component
const LoadingSpinner = React.memo(() => (
  <div className="flex items-center justify-center w-full h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

const MainLayout = ({ 
  children, 
  activeTab, 
  onChangeTab,
  viewMode = 'grid',
  onViewModeChange
}: MainLayoutProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from URL if not provided - memoized for performance
  const currentTab = useMemo(() => {
    const currentPath = location.pathname;
    return activeTab || 
      (currentPath.includes('/chat') ? 'chat' : 
       currentPath.includes('/templates') ? 'templates' : 
       currentPath.includes('/funnels') ? 'funnels' : undefined);
  }, [activeTab, location.pathname]);

  // Determine if we're on dashboard page - memoized for performance
  const isDashboard = useMemo(() => 
    location.pathname.includes('/dashboard'), 
    [location.pathname]
  );

  // Handle tab change with useCallback for better performance
  const handleTabChange = useCallback((tab: TabType) => {
    if (onChangeTab) {
      onChangeTab(tab);
    }
  }, [onChangeTab]);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  }, [onViewModeChange]);

  // Redirect to auth page if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full flex flex-col">
      <header className="border-b bg-white py-2 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">ViniZap</h1>
          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </div>
        
        {/* Navigation - Hide on Dashboard */}
        {!isDashboard && (
          <Navigation 
            currentTab={currentTab} 
            onTabChange={handleTabChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            showViewToggle={currentTab === 'templates'}
          />
        )}
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default React.memo(MainLayout);
