
import { useState, useEffect } from "react";
import { User, Phone, Home, Calendar, ClipboardList, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ProfileEditForm from "./ProfileEditForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import EmergencyContacts from "./EmergencyContacts";

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  medicalId: string;
}

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    medicalId: ""
  });
  const { addContact } = useEmergencyContacts();
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfileData({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            phone: data.emergency_phone || "",
            address: "123 Maple St, Springfield", // This would typically come from the database
            dateOfBirth: data.date_of_birth || "",
            medicalId: "MID-78542165" // This would typically come from the database
          });
          setDataLoaded(true);
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Failed to load profile",
          description: error.message || "There was an error loading your profile",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, [user, toast, isEditing]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleAddContact = () => {
    // Input validation
    if (!newContact.name.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Contact name is required",
      });
      return;
    }

    if (!newContact.phone.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Phone number is required",
      });
      return;
    }

    // Phone number validation (basic)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(newContact.phone.replace(/\s/g, ''))) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter a valid phone number",
      });
      return;
    }

    addContact(newContact);
    setNewContact({ name: '', phone: '', relationship: '' });
  };

  // Format date of birth for display
  const formatDateOfBirth = (dateString: string) => {
    if (!dateString) return "Not specified";
    
    try {
      // Handle different date formats
      if (dateString.includes('-')) {
        // ISO format like "1955-05-12"
        return format(parseISO(dateString), 'MMMM d, yyyy');
      } else if (!isNaN(Date.parse(dateString))) {
        // Already formatted date strings
        return dateString;
      }
      return dateString;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card className="border-trueshield-light shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-trueshield-primary dark:text-blue-400">
            Loading profile...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-trueshield-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show a message if no user is authenticated
  if (!user) {
    return (
      <Card className="border-trueshield-light shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-trueshield-primary dark:text-blue-400">
            Not Authenticated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Please log in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-trueshield-light shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-trueshield-primary dark:text-blue-400 flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <ProfileEditForm 
            initialData={profileData} 
            onCancel={handleEditToggle} 
          />
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:w-1/3">
              <div className="h-28 w-28 rounded-full bg-trueshield-light dark:bg-gray-700 flex items-center justify-center text-trueshield-primary dark:text-blue-400 mb-3">
                <span className="text-3xl font-bold">
                  {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                </span>
              </div>
              <h3 className="text-lg font-semibold dark:text-white">{profileData.firstName} {profileData.lastName}</h3>
              <p className="text-trueshield-muted dark:text-gray-400 text-sm">Member since 2024</p>
              
              <Button 
                className="mt-4 bg-trueshield-primary hover:bg-trueshield-primary/90 w-full dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={handleEditToggle}
              >
                Edit Profile
              </Button>
            </div>
            
            <div className="md:w-2/3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm text-trueshield-muted dark:text-gray-400 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Phone
                  </span>
                  <p className="font-medium dark:text-white">{profileData.phone || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm text-trueshield-muted dark:text-gray-400 flex items-center gap-1">
                    <Home className="h-3 w-3" /> Address
                  </span>
                  <p className="font-medium dark:text-white">{profileData.address || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm text-trueshield-muted dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Date of Birth
                  </span>
                  <p className="font-medium dark:text-white">{formatDateOfBirth(profileData.dateOfBirth)}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm text-trueshield-muted dark:text-gray-400 flex items-center gap-1">
                    <ClipboardList className="h-3 w-3" /> Medical ID
                  </span>
                  <p className="font-medium dark:text-white">{profileData.medicalId || "Not provided"}</p>
                </div>
              </div>
              
              <Separator className="dark:bg-gray-700" />
              
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Users className="h-4 w-4 text-trueshield-primary dark:text-blue-400" />
                  <h4 className="font-semibold dark:text-white">Emergency Contacts</h4>
                </div>
                
                {/* Use the EmergencyContacts component instead of inline implementation */}
                <EmergencyContacts />
                
                <div className="space-y-2 mt-4">
                  <Input 
                    placeholder="Contact Name" 
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Input 
                    placeholder="Phone Number" 
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Input 
                    placeholder="Relationship" 
                    value={newContact.relationship}
                    onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Button 
                    className="w-full dark:bg-blue-600 dark:hover:bg-blue-700" 
                    onClick={handleAddContact}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Emergency Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
