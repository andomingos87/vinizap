import React, { ReactNode, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header, { TabType } from './Header';

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
      <Header 
        currentTab={currentTab}
        onTabChange={onChangeTab}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default React.memo(MainLayout);