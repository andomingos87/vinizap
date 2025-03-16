import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock } from 'lucide-react';
import PersonalInfoTab from './PersonalInfoTab';
import SecurityTab from './SecurityTab';

const ProfileTabs: React.FC = () => {
  return (
    <div className="w-full md:w-2/3">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Informações</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Segurança</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <PersonalInfoTab />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
