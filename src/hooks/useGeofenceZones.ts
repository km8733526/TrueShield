
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface GeofenceZone {
  id: string;
  name: string;
  radius: number;
  center_lat: number;
  center_lng: number;
  created_at: string;
  user_id: string;
}

export const useGeofenceZones = () => {
  const [zones, setZones] = useState<GeofenceZone[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load zones from localStorage
  const loadLocalZones = () => {
    try {
      const storedZones = localStorage.getItem(`geofence_zones_${user?.id}`);
      return storedZones ? JSON.parse(storedZones) as GeofenceZone[] : [];
    } catch (error) {
      console.error('Error loading zones from localStorage:', error);
      return [];
    }
  };

  // Save zones to localStorage
  const saveLocalZones = (updatedZones: GeofenceZone[]) => {
    if (!user) return;
    try {
      localStorage.setItem(`geofence_zones_${user.id}`, JSON.stringify(updatedZones));
    } catch (error) {
      console.error('Error saving zones to localStorage:', error);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const fetchZones = async () => {
      try {
        console.log('Fetching geofence zones for user:', user.id);
        
        // Always use localStorage as the source of truth
        const localZones = loadLocalZones();
        setZones(localZones);
        setLoading(false);
        
        // Try to fetch from database if available, but don't depend on it
        try {
          const { data, error } = await supabase.functions.invoke('get-geofence-zones', {
            body: { userId: user.id }
          });

          if (!error && data && Array.isArray(data)) {
            console.log('Fetched geofence zones:', data);
            const typedData = data as GeofenceZone[];
            setZones(typedData);
            // Backup to localStorage
            saveLocalZones(typedData);
          }
        } catch (error) {
          console.error('Error accessing geofence data:', error);
          // Continue using local zones
        }
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, [user, toast]);

  const addZone = async (zone: Omit<GeofenceZone, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      console.error('Cannot add zone: User not authenticated');
      toast({
        title: "Error",
        description: "You must be logged in to add safe zones",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a new zone with generated ID
      const newZone: GeofenceZone = {
        id: crypto.randomUUID(),
        ...zone,
        user_id: user.id,
        created_at: new Date().toISOString()
      };
      
      // Add to local state first for responsiveness
      const updatedZones = [...zones, newZone];
      setZones(updatedZones);
      saveLocalZones(updatedZones);
      
      // Try to save to database if available
      try {
        await supabase.functions.invoke('add-geofence-zone', {
          body: { zone: newZone }
        });
      } catch (error) {
        console.log('Could not save to database, using local storage only:', error);
        // Already saved to localStorage, so continue
      }
      
      toast({
        title: "Success",
        description: "Safe zone added successfully"
      });
    } catch (err) {
      console.error('Error adding geofence zone:', err);
      toast({
        title: "Error",
        description: "Failed to add safe zone",
        variant: "destructive"
      });
    }
  };

  const deleteZone = async (zoneId: string) => {
    try {
      console.log('Deleting geofence zone:', zoneId);

      // Update local state first for responsiveness
      const updatedZones = zones.filter(zone => zone.id !== zoneId);
      setZones(updatedZones);
      saveLocalZones(updatedZones);
      
      // Try to delete from database if available
      try {
        await supabase.functions.invoke('delete-geofence-zone', {
          body: { zoneId }
        });
      } catch (error) {
        console.log('Could not delete from database, using local storage only:', error);
        // Already deleted from localStorage, so continue
      }
      
      toast({
        title: "Success",
        description: "Safe zone removed successfully"
      });
    } catch (error) {
      console.error('Error deleting geofence zone:', error);
      toast({
        title: "Error",
        description: "Failed to remove safe zone",
        variant: "destructive"
      });
    }
  };

  return { zones, loading, addZone, deleteZone };
};
