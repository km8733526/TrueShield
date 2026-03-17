import { useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import GeofenceZones from "./GeofenceZones";

const LocationTracker = () => {
  const { location } = useLocationTracking();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user || !location) return;

    const updateLocation = async () => {
      await supabase
        .from('profiles')
        .update({
          last_location_lat: location.latitude,
          last_location_lng: location.longitude,
          last_location_updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    };

    updateLocation();
  }, [location, user]);

  return (
    <div className="space-y-6">
      <Card className="border-trueshield-light shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-trueshield-primary flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-100 h-36 rounded-lg relative overflow-hidden">
              {/* Simple map placeholder */}
              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-74.5,40,9,0/300x150?access_token=pk.placeholder')] bg-cover bg-center"></div>
              
              {/* Location pin */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="h-6 w-6 rounded-full bg-trueshield-primary flex items-center justify-center text-white">
                  <Navigation className="h-3 w-3" />
                </div>
                <div className="h-6 w-6 rounded-full bg-trueshield-primary/20 animate-ping absolute top-0 left-0"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Current Location:</span>
                <span className="text-sm text-trueshield-primary">Home</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">Address:</span>
                <span className="text-sm text-trueshield-muted">123 Maple St, Springfield</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">Last Updated:</span>
                <span className="text-sm text-trueshield-muted">2 minutes ago</span>
              </div>
            </div>
            
            <button className="w-full py-2 text-center bg-trueshield-light text-trueshield-primary font-medium rounded-lg hover:bg-trueshield-light/80">
              Update Location
            </button>
          </div>
        </CardContent>
      </Card>
      <GeofenceZones />
    </div>
  );
};

export default LocationTracker;
