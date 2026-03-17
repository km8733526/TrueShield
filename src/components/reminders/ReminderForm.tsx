
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/use-theme";

const reminderSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  date: z.string().optional(),
  time: z.string().min(1, "Time is required"),
  notes: z.string().optional(),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

interface ReminderFormProps {
  onSuccess: () => void;
}

const ReminderForm = ({ onSuccess }: ReminderFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { theme } = useTheme();

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: "",
      date: new Date().toISOString().split('T')[0],
      time: "",
      notes: "",
    },
  });

  const onSubmit = async (data: ReminderFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to create reminders",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Insert the reminder into Supabase
      const { error } = await supabase
        .from('medications')
        .insert({
          name: data.title,
          time_of_day: [data.time],
          start_date: data.date,
          notes: data.notes,
          user_id: user.id
        });

      if (error) throw error;

      console.log("Creating reminder:", { ...data, userId: user.id });

      // Schedule notification (in a real app, this would be handled server-side)
      if (data.date && data.time) {
        scheduleNotification(data.title, data.date, data.time);
      }

      toast({
        title: "Reminder created!",
        description: "Your reminder has been successfully created",
      });

      form.reset();
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating reminder:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while creating the reminder",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to schedule a notification
  const scheduleNotification = (title: string, date: string, time: string) => {
    const reminderTime = new Date(`${date}T${time}`);
    const notificationTime = new Date(reminderTime.getTime() - 60 * 60 * 1000); // 1 hour before
    
    const now = new Date();
    const timeUntilNotification = notificationTime.getTime() - now.getTime();
    
    if (timeUntilNotification > 0) {
      // In a real app, you'd call a server-side notification service
      console.log(`Scheduled notification for ${title} at ${notificationTime.toLocaleString()}`);
      
      // For demo purposes, we'll use setTimeout to simulate a notification
      setTimeout(() => {
        // In a real app, this would trigger a push notification
        if (Notification.permission === "granted") {
          new Notification(`Reminder: ${title}`, {
            body: `Your reminder "${title}" is scheduled in 1 hour`,
            icon: "/favicon.ico"
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification(`Reminder: ${title}`, {
                body: `Your reminder "${title}" is scheduled in 1 hour`,
                icon: "/favicon.ico"
              });
            }
          });
        }
        
        // Display toast notification as fallback
        toast({
          title: "Upcoming Reminder",
          description: `${title} is scheduled in 1 hour`,
        });
      }, timeUntilNotification);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-trueshield-primary hover:bg-trueshield-primary/90'}>
          <CalendarClock className="h-4 w-4 mr-2" />
          New Reminder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Reminder</DialogTitle>
          <DialogDescription>
            Add details for your new health reminder
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Take medication" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional details about this reminder" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Reminder"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderForm;
