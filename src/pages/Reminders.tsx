
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, Check, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReminderForm from "@/components/reminders/ReminderForm";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useTheme } from "@/hooks/use-theme";

interface Reminder {
  id: string;
  title: string;
  time?: string;
  date?: string;
  completed: boolean;
  notes?: string;
  taken_at?: string | null;
}

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { location } = useLocationTracking();
  const { theme } = useTheme();

  useEffect(() => {
    if (!user) return;

    const fetchReminders = async () => {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      try {
        const { data, error } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id)
          .or(`taken_at.is.null,taken_at.gt.${today.toISOString()}`);

        if (error) {
          console.error('Error fetching reminders:', error);
          setLoading(false);
          return;
        }

        const formattedReminders = data.map(item => ({
          id: item.id,
          title: item.name,
          time: item.time_of_day?.[0] || "",
          date: item.start_date,
          completed: !!item.taken_at,
          notes: item.notes,
          taken_at: item.taken_at
        }));

        setReminders(formattedReminders);
        setLoading(false);
      } catch (error) {
        console.error('Error in reminder fetch:', error);
        setLoading(false);
      }
    };

    fetchReminders();

    // Subscribe to reminder changes
    const channel = supabase
      .channel('reminder_changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchReminders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const toggleComplete = async (id: string) => {
    if (!user) return;

    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    const now = new Date().toISOString();
    const taken_at = reminder.completed ? null : now;

    try {
      const { error } = await supabase
        .from('medications')
        .update({ taken_at })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: taken_at ? "Medication marked as taken" : "Medication unmarked",
        description: `${reminder.title} has been ${taken_at ? 'marked as taken' : 'unmarked'}`,
      });

      // Update local state
      setReminders(reminders.map(r =>
        r.id === id ? { ...r, completed: !r.completed, taken_at } : r
      ));
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update reminder status",
      });
    }
  };

  const refreshReminders = () => {
    if (user) {
      // Fetch reminders again from the database
      const fetchReminders = async () => {
        setLoading(true);
        
        try {
          const { data, error } = await supabase
            .from('medications')
            .select('*')
            .eq('user_id', user.id);

          if (error) throw error;

          const formattedReminders = data.map(item => ({
            id: item.id,
            title: item.name,
            time: item.time_of_day?.[0] || "",
            date: item.start_date,
            completed: !!item.taken_at,
            notes: item.notes,
            taken_at: item.taken_at
          }));

          setReminders(formattedReminders);
        } catch (error) {
          console.error('Error refreshing reminders:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchReminders();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-trueshield-primary'} mb-1`}>
              Reminders
            </h2>
            <p className="text-trueshield-muted">Keep track of your schedule</p>
          </div>
          <ReminderForm onSuccess={refreshReminders} />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-12 bg-trueshield-light/30 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {reminders.map((reminder) => (
              <Card key={reminder.id} className={reminder.completed ? "opacity-70" : ""}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`rounded-full ${reminder.completed ? "bg-green-100 text-green-600 border-green-200" : "text-trueshield-muted"}`}
                        onClick={() => toggleComplete(reminder.id)}
                      >
                        {reminder.completed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Bell className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div>
                      <h3 className={`font-medium ${reminder.completed ? "line-through text-trueshield-muted" : theme === 'dark' ? "text-white" : "text-trueshield-primary"}`}>
                        {reminder.title}
                      </h3>
                      <div className="flex items-center text-sm text-trueshield-muted mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {reminder.time}
                        {reminder.date && <span className="ml-2">{reminder.date}</span>}
                      </div>
                      {reminder.notes && (
                        <p className="text-xs text-trueshield-muted mt-1">
                          {reminder.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    {!reminder.completed && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleComplete(reminder.id)}
                        className={`${theme === 'dark' ? 'text-white border-gray-700' : 'text-trueshield-primary border-trueshield-light'}`}
                      >
                        Mark as Taken
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {reminders.length === 0 && (
              <div className="text-center py-8 text-trueshield-muted">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-1">No reminders yet</h3>
                <p className="text-sm">Create your first reminder to get started</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reminders;
