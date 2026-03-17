
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const sendNotification = async (
    caregiverId: string,
    type: 'fall_detected' | 'missed_medication' | 'emergency_alert' | 'health_update',
    title: string,
    message: string
  ) => {
    try {
      const { error } = await supabase
        .from('caregiver_notifications')
        .insert({
          user_id: user?.id,
          caregiver_id: caregiverId,
          type,
          title,
          message
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  };

  return { sendNotification };
};
