
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EmergencyContacts = () => {
  const { contacts, deleteContact, isLoading } = useEmergencyContacts();

  const handleDelete = (contactId: string) => {
    deleteContact(contactId);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-trueshield-primary border-t-transparent"></div>
        <p className="mt-2 text-sm text-trueshield-muted">Loading contacts...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="p-4 text-center border border-dashed rounded-lg">
        <p className="text-trueshield-muted dark:text-gray-400">No emergency contacts added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <div 
          key={contact.id || Math.random().toString()} 
          className="p-3 rounded-lg border border-trueshield-light bg-white dark:bg-gray-700 dark:border-gray-600 flex justify-between items-center"
        >
          <div>
            <p className="font-medium dark:text-white">{contact.name}</p>
            <p className="text-sm text-trueshield-muted dark:text-gray-400">{contact.relationship}</p>
            <p className="text-trueshield-primary dark:text-blue-400">{contact.phone}</p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Emergency Contact</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove {contact.name} from your emergency contacts? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleDelete(contact.id!)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete Contact
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
};

export default EmergencyContacts;
