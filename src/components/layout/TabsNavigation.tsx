
import React from 'react';
import { MessageSquare, FileText, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'chat' | 'templates' | 'funnels';

interface TabsNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ 
  activeTab, 
  onChangeTab 
}) => {
  const tabs = [
    { id: 'chat' as const, name: 'Chat', icon: MessageSquare },
    { id: 'templates' as const, name: 'Templates', icon: FileText },
    { id: 'funnels' as const, name: 'Funis', icon: Filter }
  ];

  return (
    <div className="flex w-full justify-center bg-white border-b shadow-sm">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors relative",
              activeTab === tab.id 
                ? "border-vinizap-primary text-vinizap-dark" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <tab.icon className={cn(
              "w-4 h-4 mr-2",
              activeTab === tab.id ? "text-vinizap-primary" : "text-gray-400"
            )} />
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsNavigation;
