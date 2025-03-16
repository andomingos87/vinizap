import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { 
  ProfileHeader, 
  ProfileAvatar, 
  ProfileTabs, 
  DangerZone 
} from '@/components/profile';

const Profile = () => {
  return (
    <ProfileProvider>
      <MainLayout>
        <div className="p-6 h-full overflow-auto bg-gray-50 dark:bg-gray-900">
          <ProfileHeader title="Perfil do Usuário" />
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <ProfileAvatar />
              <ProfileTabs />
            </div>
            
            <DangerZone />
          </div>
        </div>
      </MainLayout>
    </ProfileProvider>
  );
};

export default Profile;
