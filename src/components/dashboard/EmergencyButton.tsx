
import { AlertCircle, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";

const EmergencyButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const { sendEmergencyAlert } = useEmergencyContacts();
  const { location } = useLocationTracking();
  const { toast } = useToast();
  const { sendNotification } = useNotifications();
  const { user } = useAuth();

  const handleMouseDown = () => {
    setIsHolding(true);
    const holdTimer = setTimeout(() => {
      triggerEmergency();
    }, 2000);
    
    setTimer(holdTimer);
  };
  
  const handleMouseUp = () => {
    if (timer) {
      clearTimeout(timer);
    }
    setIsHolding(false);
  };
  
  const triggerEmergency = async () => {
    setIsPressed(true);
    
    try {
      // Get user's caregivers
      const { data: caregivers, error: caregiverError } = await supabase
        .from('caregivers')
        .select('caregiver_id')
        .eq('user_id', user?.id)
        .eq('status', 'approved');

      if (caregiverError) throw caregiverError;

      // Send notification to each caregiver
      for (const caregiver of caregivers || []) {
        await sendNotification(
          caregiver.caregiver_id,
          'emergency_alert',
          'Emergency Alert',
          `${user?.email || 'A user'} has triggered their emergency button. ${location ? `Location: ${location.latitude},${location.longitude}` : 'Location not available'}`
        );
      }
      
      // Send emergency alert with current location if available
      sendEmergencyAlert(location || undefined);
      
      toast({
        title: "Emergency Alert Sent",
        description: "Your emergency contacts and caregivers have been notified",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error sending emergency notifications:', error);
      toast({
        title: "Error",
        description: "Failed to send all notifications, but emergency contacts have been alerted",
        variant: "destructive"
      });
    }
    
    setTimeout(() => {
      setIsPressed(false);
    }, 2000);
  };
  
  return (
    <Card className="border-trueshield-accent border-2 shadow-md bg-white">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-8 w-8 text-trueshield-accent" />
          </div>
          
          <h3 className="text-xl font-bold text-trueshield-text">Emergency Assistance</h3>
          
          <p className="text-trueshield-muted text-sm">Press and hold the button for 2 seconds to send emergency alert</p>
          
          <button
            className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all ${
              isPressed 
                ? 'bg-trueshield-error scale-95 shadow-inner' 
                : isHolding
                  ? 'bg-trueshield-accent/80 scale-95 shadow-inner'
                  : 'bg-trueshield-accent shadow-lg hover:bg-trueshield-error'
            }`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
          >
            <Phone className="h-12 w-12 text-white" />
          </button>
          
          <p className="text-xs text-trueshield-muted pt-2">
            This will alert your emergency contacts and caregivers immediately
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyButton;
