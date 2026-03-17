import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { useNotifications } from "@/hooks/useNotifications";

const HealthStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { sendNotification } = useNotifications();
  const [healthData, setHealthData] = useState({
    heartRate: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    temperature: 0,
    lastUpdated: null as Date | null
  });
  const [loading, setLoading] = useState(false);

  const generateHealthData = () => {
    const heartRate = Math.floor(Math.random() * 40) + 60;
    const systolic = Math.floor(Math.random() * 40) + 110;
    const diastolic = Math.floor(Math.random() * 20) + 70;
    const temperature = (Math.random() * 1 + 98).toFixed(1);
    
    return {
      heartRate,
      bloodPressure: { 
        systolic, 
        diastolic 
      },
      temperature: parseFloat(temperature),
      lastUpdated: new Date()
    };
  };

  const updateHealthStatus = async () => {
    if (!user) return;
    
    setLoading(true);
    const newData = generateHealthData();
    
    try {
      const { error } = await supabase
        .from('health_status')
        .insert({
          user_id: user.id,
          heart_rate: newData.heartRate,
          blood_pressure_systolic: newData.bloodPressure.systolic,
          blood_pressure_diastolic: newData.bloodPressure.diastolic,
          temperature: newData.temperature
        });
      
      if (error) throw error;

      const shouldNotify = 
        newData.heartRate > 100 || 
        newData.heartRate < 60 ||
        newData.bloodPressure.systolic > 140 ||
        newData.bloodPressure.diastolic > 90 ||
        newData.temperature > 99.5;

      if (shouldNotify) {
        const { data: caregivers } = await supabase
          .from('caregivers')
          .select('caregiver_id')
          .eq('user_id', user.id)
          .eq('status', 'approved');

        for (const caregiver of caregivers || []) {
          await sendNotification(
            caregiver.caregiver_id,
            'health_update',
            'Concerning Health Readings',
            `Patient has concerning health readings: HR=${newData.heartRate}, BP=${newData.bloodPressure.systolic}/${newData.bloodPressure.diastolic}, Temp=${newData.temperature}°F`
          );
        }
      }
      
      setHealthData(newData);
      toast({
        title: "Health Data Updated",
        description: "Your health readings have been updated",
      });
    } catch (error) {
      console.error('Error updating health status:', error);
      toast({
        title: "Update Failed",
        description: "Could not update health status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchLatestHealthStatus = async () => {
      const { data, error } = await supabase
        .from('health_status')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setHealthData({
          heartRate: data.heart_rate || 0,
          bloodPressure: {
            systolic: data.blood_pressure_systolic || 0,
            diastolic: data.blood_pressure_diastolic || 0
          },
          temperature: data.temperature || 0,
          lastUpdated: new Date(data.recorded_at)
        });
      }

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching health status:', error);
      }
    };

    fetchLatestHealthStatus();
  }, [user]);
  
  return (
    <Card className={`border-trueshield-light shadow-sm ${theme === 'dark' ? 'bg-background text-foreground' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-xl ${theme === 'dark' ? 'text-foreground' : 'text-trueshield-primary'} flex items-center gap-2`}>
          <Heart className="h-5 w-5" />
          Health Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Heart Rate</span>
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-foreground' : 'text-trueshield-primary'}`}>{healthData.heartRate} BPM</span>
            </div>
            <Progress value={healthData.heartRate} max={120} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Blood Pressure</span>
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-foreground' : 'text-trueshield-secondary'}`}>{healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}</span>
            </div>
            <Progress value={healthData.bloodPressure.systolic} max={200} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Temperature</span>
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-foreground' : 'text-trueshield-primary'}`}>{healthData.temperature}°F</span>
            </div>
            <Progress value={healthData.temperature} max={105} className="h-2" />
          </div>
          
          <div className="pt-2 flex justify-between text-sm text-trueshield-muted">
            <span>Last updated: {healthData.lastUpdated ? healthData.lastUpdated.toLocaleTimeString() : 'Never updated'}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-trueshield-primary hover:underline"
              onClick={updateHealthStatus}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Now"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthStatus;
