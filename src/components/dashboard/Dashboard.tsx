
import { useState, useEffect } from "react";
import HealthStatus from "./HealthStatus";
import MedicationReminders from "./MedicationReminders";
import EmergencyButton from "./EmergencyButton";
import FallDetection from "./FallDetection";
import CaregiverChat from "./CaregiverChat";
import LocationTracker from "./LocationTracker";
import LoadingCard from "./LoadingCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/use-theme";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ first_name?: string; last_name?: string } | null>(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const userName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`
    : user?.email?.split('@')[0] || "User";
  
  return (
    <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'text-white' : ''}`}>
      <div className="mb-8">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-trueshield-primary'} mb-1`}>
          Hello, {userName}
        </h2>
        <p className="text-trueshield-muted">{currentDate}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <EmergencyButton />
          {loading ? <LoadingCard /> : <HealthStatus />}
          {loading ? <LoadingCard /> : <MedicationReminders />}
        </div>
        <div className="space-y-6">
          {loading ? <LoadingCard /> : <FallDetection />}
          {loading ? <LoadingCard /> : <LocationTracker />}
          {loading ? <LoadingCard /> : <CaregiverChat />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
