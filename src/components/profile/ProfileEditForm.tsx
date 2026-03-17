
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

// Define the form schema with Zod
const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  medicalId: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  medicalId: string;
}

interface ProfileEditFormProps {
  initialData: ProfileData;
  onCancel: () => void;
}

const ProfileEditForm = ({ initialData, onCancel }: ProfileEditFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Format date for input if needed
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    try {
      // Try to parse the date and format it correctly for the date input
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return format(date, 'yyyy-MM-dd');
      }
    } catch (error) {
      console.error("Error formatting date for input:", error);
    }
    
    return dateString;
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      phone: initialData.phone,
      address: initialData.address,
      dateOfBirth: formatDateForInput(initialData.dateOfBirth),
      medicalId: initialData.medicalId,
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          emergency_phone: data.phone,
          date_of_birth: data.dateOfBirth,
          // We don't have address and medical_id in the profiles table yet
          // These would need to be added to the database schema
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been updated",
      });
      
      onCancel();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "There was an error updating your profile",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-300">First Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John" 
                    {...field} 
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-300">Last Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Smith" 
                    {...field} 
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-300">Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(555) 123-4567" 
                    {...field} 
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-300">Date of Birth</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="dark:text-gray-300">Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123 Maple St, Springfield" 
                    {...field} 
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="medicalId"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="dark:text-gray-300">Medical ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="MID-78542165" 
                    {...field} 
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="dark:border-gray-600 dark:text-gray-300"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
            className="dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileEditForm;
