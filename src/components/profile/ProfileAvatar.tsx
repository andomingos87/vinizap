import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';

const ProfileAvatar: React.FC = () => {
  const { user } = useAuth();
  const { profile, uploading, uploadAvatar, getInitials } = useProfile();
  
  return (
    <Card className="w-full md:w-1/3">
      <CardHeader className="text-center pb-2">
        <div className="flex flex-col items-center">
          <div className="relative mb-5">
            <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="Avatar" className="object-cover" />
              ) : null}
              <AvatarFallback className="text-3xl bg-vinizap-primary/10 text-vinizap-primary">
                {getInitials(profile?.full_name || '')}
              </AvatarFallback>
            </Avatar>
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-1 right-1 bg-vinizap-primary text-white p-2 rounded-full cursor-pointer hover:bg-vinizap-primary/80 transition-all hover:scale-110 shadow-md"
              title="Alterar foto de perfil"
            >
              <Camera className="h-4 w-4" />
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={uploadAvatar}
                disabled={uploading}
              />
            </label>
          </div>
          <CardTitle className="text-xl font-bold mb-1">{profile?.full_name || user?.email}</CardTitle>
          <CardDescription className="text-sm">
            {profile?.username ? `@${profile.username}` : user?.email}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-3 mt-2 px-2">
          <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800">
            <span className="font-medium min-w-24">Email:</span> 
            <span className="text-gray-600 dark:text-gray-300 truncate">{user?.email}</span>
          </div>
          
          {profile?.phone && (
            <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800">
              <span className="font-medium min-w-24">Telefone:</span> 
              <span className="text-gray-600 dark:text-gray-300">{profile.phone}</span>
            </div>
          )}
          
          <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800">
            <span className="font-medium min-w-24">Membro desde:</span>
            <span className="text-gray-600 dark:text-gray-300">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '-'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileAvatar;
