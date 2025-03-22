import React from 'react';
import { TabType } from './Header';
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, Filter, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TabsNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ currentTab, onTabChange }) => {
  const navigate = useNavigate();

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/' },
    { id: 'templates', label: 'Templates', icon: FileText, path: '/templates' },
    { id: 'funnels', label: 'Funis', icon: Filter, path: '/funnels' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  ];

  return (
    <div className="sm:hidden">
      <div className="flex overflow-x-auto space-x-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="outline"
            size="sm"
            className={cn(
              "justify-start rounded-md",
              currentTab === tab.id ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-transparent hover:bg-gray-100"
            )}
            onClick={() => {
              onTabChange(tab.id as TabType);
              navigate(tab.path);
            }}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TabsNavigation;
