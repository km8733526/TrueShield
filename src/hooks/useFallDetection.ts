import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";

export const useFallDetection = () => {
  const [lastTested, setLastTested] = useState<Date | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { sendNotification } = useNotifications();

  const detectFall = (sensitivity: number) => {
    const detectionThreshold = 6 - sensitivity;
    const simulatedMovement = Math.random() * 10;
    return simulatedMovement > detectionThreshold;
  };

  const runTest = async (sensitivity: number, isActive: boolean) => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please log in to run fall detection tests",
        variant: "destructive"
      });
      return;
    }

    if (!isActive) {
      toast({
        title: "Fall Detection Inactive",
        description: "Please enable fall detection first",
        variant: "destructive"
      });
      return;
    }
    
    setIsTesting(true);
    
    setTimeout(async () => {
      const fallDetected = detectFall(sensitivity);
      
      try {
        const { error: testError } = await supabase
          .from('fall_detection_tests')
          .insert({
            user_id: user.id,
            sensitivity: sensitivity,
            fall_detected: fallDetected
          });

        if (testError) throw testError;

        if (fallDetected) {
          const { data: caregivers, error: caregiverError } = await supabase
            .from('caregivers')
            .select('caregiver_id')
            .eq('user_id', user.id)
            .eq('status', 'approved');

          if (caregiverError) throw caregiverError;

          for (const caregiver of caregivers || []) {
            await sendNotification(
              caregiver.caregiver_id,
              'fall_detected',
              'Fall Detected',
              'A fall was detected for your patient. Please check on them.'
            );
          }

          const { data: contacts } = await supabase
            .from('emergency_contacts')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_primary', true);

          for (const contact of contacts || []) {
            await supabase.functions.invoke('send-sms', {
              body: {
                to: contact.phone,
                message: `ALERT: Fall detected for your loved one. Please check on them immediately.`,
                type: 'fall_detected'
              }
            });
          }

          toast({
            title: "Fall Detected",
            description: "Test successful - fall correctly detected. Caregivers have been notified.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "No Fall Detected",
            description: "Test completed - no fall detected",
          });
        }
        
        setLastTested(new Date());
      } catch (error) {
        console.error('Error in fall detection test:', error);
        toast({
          title: "Test Failed",
          description: "Could not save fall detection test",
          variant: "destructive"
        });
      } finally {
        setIsTesting(false);
      }
    }, 2000);
  };

  useEffect(() => {
    if (!user) return;
    
    const fetchLastTest = async () => {
      try {
        const { data, error } = await supabase
          .from('fall_detection_tests')
          .select()
          .eq('user_id', user.id)
          .order('tested_at', { ascending: false })
          .limit(1);
          
        if (error) {
          console.error('Error fetching last fall detection test:', error);
          return;
        }
        
        if (data && data.length > 0) {
          const testData = data[0] as { tested_at: string };
          setLastTested(new Date(testData.tested_at));
        }
      } catch (err) {
        console.error('Error in fetchLastTest:', err);
      }
    };
    
    fetchLastTest();
  }, [user]);

  return { lastTested, isTesting, runTest };
};
