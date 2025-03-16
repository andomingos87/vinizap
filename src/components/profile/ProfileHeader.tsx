import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProfileHeaderProps {
  title: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 text-vinizap-primary" />
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
    </div>
  );
};

export default ProfileHeader;
