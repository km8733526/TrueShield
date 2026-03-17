
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2, AlertCircle } from "lucide-react";
import { useGeofenceZones } from "@/hooks/useGeofenceZones";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { AddGeofenceZoneDialog } from "./AddGeofenceZoneDialog";
import { useToast } from "@/hooks/use-toast";

const GeofenceZones = () => {
  const { zones, addZone, deleteZone, loading: zonesLoading } = useGeofenceZones();
  const { location, error: locationError } = useLocationTracking();
  const { toast } = useToast();

  const handleAddZone = ({ name, radius }: { name: string; radius: number }) => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Cannot add safe zone without location data",
        variant: "destructive"
      });
      return;
    }

    addZone({
      name,
      radius,
      center_lat: location.latitude,
      center_lng: location.longitude
    });
  };

  return (
    <Card className="border-trueshield-light shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-trueshield-primary flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Safe Zones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locationError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">Location access is required to create safe zones</p>
            </div>
          )}

          <AddGeofenceZoneDialog 
            onSubmit={handleAddZone}
            disabled={!location}
          />

          {zonesLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-pulse flex space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : zones.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-trueshield-muted">No safe zones added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {zones.map((zone) => (
                <div 
                  key={zone.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-sm text-gray-500">{zone.radius}m radius</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteZone(zone.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GeofenceZones;
