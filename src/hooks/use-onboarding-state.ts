
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useOnboardingState = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkExistingConnection = async () => {
      if (!user) {
        setIsCheckingConnection(false);
        return;
      }

      try {
        const connectionData = localStorage.getItem(`whatsapp_connection_${user.id}`);
        if (!connectionData) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error('Error fetching connection status:', err);
      } finally {
        setIsCheckingConnection(false);
      }
    };

    checkExistingConnection();
  }, [user]);

  return {
    showOnboarding,
    setShowOnboarding,
    isCheckingConnection
  };
};
