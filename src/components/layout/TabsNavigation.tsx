import React from 'react';
import type { TabType } from './MainLayout';

// This file is kept for backward compatibility
// The navigation has been moved to MainLayout.tsx

interface TabsNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ 
  activeTab, 
  onChangeTab 
}) => {
  // This component is now just a placeholder
  // The actual navigation is integrated into MainLayout
  return null;
};

export type { TabType };
export default TabsNavigation;
