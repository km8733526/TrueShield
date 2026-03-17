
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface EmergencyContact {
  id?: string;
  name: string;
  phone: string;
  relationship?: string;
  is_primary?: boolean;
}

export const useEmergencyContacts = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('emergency_contacts')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching emergency contacts:', error);
          toast({
            title: "Error",
            description: "Failed to load emergency contacts",
            variant: "destructive"
          });
          return;
        }

        setContacts(data || []);
      } catch (err) {
        console.error('Unexpected error fetching contacts:', err);
        toast({
          title: "Error",
          description: "An unexpected error occurred loading your contacts",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [user, toast]);

  const addContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add contacts",
        variant: "destructive"
      });
      return;
    }
    
    // Validate inputs
    if (!contact.name?.trim()) {
      toast({
        title: "Error",
        description: "Contact name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!contact.phone?.trim()) {
      toast({
        title: "Error",
        description: "Phone number is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({
          ...contact,
          user_id: user.id
        })
        .select();

      if (error) {
        console.error('Error adding emergency contact:', error);
        toast({
          title: "Error",
          description: "Failed to add emergency contact",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setContacts(prev => [...prev, data[0]]);
        toast({
          title: "Contact Added",
          description: "Emergency contact successfully added"
        });
      }
    } catch (err) {
      console.error('Unexpected error adding contact:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred adding your contact",
        variant: "destructive"
      });
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to remove contacts",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // First verify the contact belongs to this user
      const { data: contactData, error: checkError } = await supabase
        .from('emergency_contacts')
        .select('id')
        .eq('id', contactId)
        .eq('user_id', user.id)
        .single();

      if (checkError || !contactData) {
        console.error('Error verifying contact ownership:', checkError);
        toast({
          title: "Error",
          description: "You don't have permission to delete this contact",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', contactId)
        .eq('user_id', user.id);

      if (error) throw error;

      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      toast({
        title: "Contact Removed",
        description: "Emergency contact successfully removed"
      });
    } catch (error) {
      console.error('Error deleting emergency contact:', error);
      toast({
        title: "Error",
        description: "Failed to remove emergency contact",
        variant: "destructive"
      });
    }
  };

  const sendEmergencyAlert = async (location?: { latitude: number; longitude: number }) => {
    if (!user || contacts.length === 0) return;

    const primaryContacts = contacts.filter(c => c.is_primary);
    const message = location 
      ? `Emergency alert! User location: https://www.google.com/maps?q=${location.latitude},${location.longitude}` 
      : 'Emergency alert! User needs assistance.';

    for (const contact of primaryContacts) {
      try {
        const { error } = await supabase.functions.invoke('send-sms', {
          body: {
            to: contact.phone,
            message: `${message} - TrueShield Alert`,
            type: 'emergency_alert'
          }
        });

        if (error) throw error;

        toast({
          title: "Emergency Alert",
          description: `Alert sent to ${contact.name}`,
          variant: "destructive"
        });
      } catch (error) {
        console.error(`Error sending SMS to ${contact.name}:`, error);
      }
    }
  };

  return { contacts, isLoading, addContact, deleteContact, sendEmergencyAlert };
};
