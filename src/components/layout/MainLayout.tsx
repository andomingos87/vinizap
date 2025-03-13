
import React from 'react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "min-h-screen bg-gray-100 flex flex-col",
      className
    )}>
      {children}
    </div>
  );
};

export default MainLayout;
