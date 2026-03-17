
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { GeofenceZone } from "@/hooks/useGeofenceZones";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

interface GeofenceAlert {
  id: string;
  zone_id: string;
  user_id: string;
  type: 'entry' | 'exit';
  created_at: string;
  zone_name: string;
}

export const useLocationTracking = (checkGeofences = false, geofenceZones: GeofenceZone[] = []) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<GeofenceAlert[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load alerts from localStorage
  const loadLocalAlerts = () => {
    try {
      const storedAlerts = localStorage.getItem(`geofence_alerts_${user?.id}`);
      return storedAlerts ? JSON.parse(storedAlerts) as GeofenceAlert[] : [];
    } catch (error) {
      console.error('Error loading alerts from localStorage:', error);
      return [];
    }
  };

  // Save alerts to localStorage
  const saveLocalAlerts = (updatedAlerts: GeofenceAlert[]) => {
    if (!user) return;
    try {
      localStorage.setItem(`geofence_alerts_${user.id}`, JSON.stringify(updatedAlerts));
    } catch (error) {
      console.error('Error saving alerts to localStorage:', error);
    }
  };

  const createAlert = async (zone: GeofenceZone, type: 'entry' | 'exit'): Promise<GeofenceAlert> => {
    if (!user) throw new Error('User not authenticated');
    
    const newAlert: GeofenceAlert = {
      id: crypto.randomUUID(),
      zone_id: zone.id,
      user_id: user.id,
      type,
      created_at: new Date().toISOString(),
      zone_name: zone.name
    };
    
    // Save to local state first for responsiveness
    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    saveLocalAlerts(updatedAlerts);
    
    // Try to save to database if available
    try {
      await supabase.functions.invoke('create-geofence-alert', {
        body: { alert: newAlert }
      });
    } catch (error) {
      console.log('Could not save alert to database, using local storage only:', error);
      // Already saved to localStorage, so continue
    }
    
    // Show toast notification
    toast({
      title: `Geofence ${type === 'entry' ? 'Entered' : 'Exited'}`,
      description: `You have ${type === 'entry' ? 'entered' : 'exited'} the safe zone "${zone.name}"`,
      variant: type === 'entry' ? 'default' : 'destructive',
    });
    
    return newAlert;
  };

  // Load alerts on initial mount
  useEffect(() => {
    if (user && checkGeofences) {
      const localAlerts = loadLocalAlerts();
      setAlerts(localAlerts);
      
      // Try to fetch from database if available, but don't depend on it
      const fetchAlerts = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('get-geofence-alerts', {
            body: { userId: user.id }
          });
          
          if (!error && data && Array.isArray(data)) {
            const typedData = data as GeofenceAlert[];
            setAlerts(typedData);
            saveLocalAlerts(typedData);
          }
        } catch (error) {
          console.error('Error fetching geofence alerts:', error);
          // Continue using local alerts
        }
      };
      
      fetchAlerts();
    }
  }, [user, checkGeofences]);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // distance in meters

    return distance;
  };

  // Check if location is inside any geofence
  const checkGeofenceStatus = (loc: LocationData) => {
    if (!checkGeofences || !user) return;
    
    for (const zone of geofenceZones) {
      const distance = calculateDistance(
        loc.latitude,
        loc.longitude,
        zone.center_lat,
        zone.center_lng
      );
      
      const isInside = distance <= zone.radius;
      const lastAlertForZone = alerts
        .filter(a => a.zone_id === zone.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
      const lastStatus = lastAlertForZone?.type || 'exit';
      
      if (isInside && lastStatus === 'exit') {
        createAlert(zone, 'entry');
      } else if (!isInside && lastStatus === 'entry') {
        createAlert(zone, 'exit');
      }
    }
  };

  // Update profile location in Supabase
  const updateProfileLocation = async (loc: LocationData) => {
    if (!user) return;
    
    try {
      await supabase
        .from('profiles')
        .update({
          last_location_lat: loc.latitude,
          last_location_lng: loc.longitude,
          last_location_updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    } catch (error) {
      console.error('Error updating profile location:', error);
      // Continue even if update fails
    }
  };

  // Start location tracking
  const startTracking = () => {
    if (tracking) return;
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    
    setTracking(true);
    setError(null);
    
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        
        setLocation(newLocation);
        setError(null);
        
        // Check geofences if enabled
        checkGeofenceStatus(newLocation);
        
        // Update profile location
        updateProfileLocation(newLocation);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError(error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    );
    
    setWatchId(id);
  };
  
  // Stop location tracking
  const stopTracking = () => {
    if (!tracking || watchId === null) return;
    
    navigator.geolocation.clearWatch(watchId);
    setTracking(false);
    setWatchId(null);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);
  
  return {
    location,
    tracking,
    startTracking,
    stopTracking,
    error,
    alerts
  };
};
