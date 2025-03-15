import React, { ReactNode } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';
import { MessageSquare, FileText, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'chat' | 'templates' | 'funnels';

interface MainLayoutProps {
  children: ReactNode;
  activeTab?: TabType;
  onChangeTab?: (tab: TabType) => void;
}

const MainLayout = ({ children, activeTab, onChangeTab }: MainLayoutProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from URL if not provided
  const currentPath = location.pathname;
  const isDashboard = currentPath.includes('/dashboard');
  const currentTab = activeTab || 
    (currentPath.includes('/chat') ? 'chat' : 
     currentPath.includes('/templates') ? 'templates' : 
     currentPath.includes('/funnels') ? 'funnels' : undefined);

  // Navigation tabs
  const navItems = [
    { id: 'chat' as const, name: 'Chat', icon: MessageSquare, path: '/' },
    { id: 'templates' as const, name: 'Templates', icon: FileText, path: '/' },
    { id: 'funnels' as const, name: 'Funis', icon: Filter, path: '/' }
  ];

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    if (onChangeTab) {
      onChangeTab(tab);
    }
  };

  // Redirect to auth page if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
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
        
        {/* Navigation Tabs - Hide on Dashboard */}
        {!isDashboard && (
          <div className="flex mt-2 -mb-0.5">
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
                  onClick={() => handleTabChange(item.id)}
                >
                  <item.icon className={cn(
                    "w-4 h-4 mr-2",
                    currentTab === item.id ? "text-vinizap-primary" : "text-gray-400"
                  )} />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
