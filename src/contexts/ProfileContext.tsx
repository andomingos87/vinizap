import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProfileData {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  created_at: string;
  updated_at?: string;
}

interface ProfileFormData {
  full_name: string;
  username: string;
  phone: string;
  bio: string;
}

interface SecuritySettings {
  two_factor_auth: boolean;
  login_alerts: boolean;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Interface para os dados retornados pelo Supabase
interface SupabaseProfileData {
  id: string;
  created_at: string;
  updated_at?: string;
  username?: string | null;
  avatar_url?: string | null;
  full_name?: string | null;
  phone?: string | null;
  bio?: string | null;
  [key: string]: any; // Para quaisquer outras propriedades que possam existir
}

interface ProfileContextType {
  profile: ProfileData | null;
  formData: ProfileFormData;
  loading: boolean;
  uploading: boolean;
  security: SecuritySettings;
  passwordData: PasswordData;
  fetchProfile: () => Promise<void>;
  updateProfile: () => Promise<void>;
  changePassword: () => Promise<void>;
  uploadAvatar: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSecurityChange: (key: keyof SecuritySettings) => void;
  setPasswordData: React.Dispatch<React.SetStateAction<PasswordData>>;
  getInitials: (name: string) => string;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    username: '',
    phone: '',
    bio: '',
  });
  
  const [security, setSecurity] = useState<SecuritySettings>({
    two_factor_auth: false,
    login_alerts: true,
  });
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const supabaseData = data as SupabaseProfileData;
        
        const profileData: ProfileData = {
          id: supabaseData.id,
          full_name: supabaseData.full_name || null,
          username: supabaseData.username || null,
          avatar_url: supabaseData.avatar_url || null,
          phone: supabaseData.phone || null,
          bio: supabaseData.bio || null,
          created_at: supabaseData.created_at,
          updated_at: supabaseData.updated_at
        };
        
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          username: profileData.username || '',
          phone: profileData.phone || '',
          bio: profileData.bio || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do perfil.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username,
          phone: formData.phone,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
      
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o perfil.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: 'Senha atualizada',
        description: 'Sua senha foi atualizada com sucesso.',
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a senha.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem para fazer upload.');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user?.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: 'Avatar atualizado',
        description: 'Sua foto de perfil foi atualizada com sucesso.',
      });
      
      fetchProfile();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível fazer o upload da imagem.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSecurityChange = (key: keyof SecuritySettings) => {
    setSecurity(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const getInitials = (name: string) => {
    if (!name) return user?.email?.substring(0, 2).toUpperCase() || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  return (
    <ProfileContext.Provider value={{
      profile,
      formData,
      loading,
      uploading,
      security,
      passwordData,
      fetchProfile,
      updateProfile,
      changePassword,
      uploadAvatar,
      handleInputChange,
      handleSecurityChange,
      setPasswordData,
      getInitials
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
