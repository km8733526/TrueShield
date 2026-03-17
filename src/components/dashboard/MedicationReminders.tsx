
import { useState, useEffect } from "react";
import { Pill, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Medication {
  id: string;
  name: string;
  time: string;
  taken: boolean;
  taken_at: string | null;
}

const MedicationReminders = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMedications = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
          .from('medications')
          .select('id, name, time_of_day, taken_at')
          .eq('user_id', user.id)
          .or(`taken_at.is.null,taken_at.gt.${today.toISOString()}`);

        if (error) {
          console.error("Error fetching medications:", error);
          return;
        }

        // Transform the data to match the component's expected format
        const formattedMeds = data.map(med => ({
          id: med.id,
          name: med.name,
          time: med.time_of_day?.[0] || "8:00 AM",
          taken: !!med.taken_at,
          taken_at: med.taken_at
        }));

        setMedications(formattedMeds);
      } catch (error) {
        console.error("Error in medication fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();

    // Subscribe to medication changes
    if (user) {
      const channel = supabase
        .channel('medication_changes')
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'medications',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchMedications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleMarkTaken = async (medId: string) => {
    if (!user) return;

    const now = new Date().toISOString();
    
    try {
      const { error } = await supabase
        .from('medications')
        .update({ taken_at: now })
        .eq('id', medId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setMedications(medications.map(med => 
        med.id === medId ? { ...med, taken: true, taken_at: now } : med
      ));

      toast({
        title: "Medication marked as taken",
        description: "Your medication has been recorded as taken",
      });
    } catch (error) {
      console.error("Error marking medication as taken:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update medication status",
      });
    }
  };

  return (
    <Card className="border-trueshield-light shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-trueshield-primary flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Medication Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse h-6 w-24 bg-trueshield-light/50 rounded"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {medications.length > 0 ? (
              medications.map((med) => (
                <div 
                  key={med.id} 
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    med.taken ? 'bg-trueshield-light/50' : 'bg-white border border-trueshield-light'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      med.taken ? 'bg-trueshield-secondary text-white' : 'bg-trueshield-light text-trueshield-primary'
                    }`}>
                      {med.taken ? <CheckCircle className="h-5 w-5" /> : <Pill className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <div className="flex items-center text-xs text-trueshield-muted">
                        <Clock className="h-3 w-3 mr-1" /> {med.time}
                      </div>
                    </div>
                  </div>
                  
                  {!med.taken && (
                    <Button 
                      className="text-sm font-medium text-trueshield-primary bg-trueshield-light px-3 py-1 rounded-full hover:bg-trueshield-light/70"
                      onClick={() => handleMarkTaken(med.id)}
                    >
                      Mark Taken
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-trueshield-muted">
                <p>No medications scheduled for today</p>
              </div>
            )}
            
            <Link to="/reminders" className="block w-full text-center text-trueshield-primary text-sm mt-2 hover:underline">
              View All Medications
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationReminders;
