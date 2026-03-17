
import { Shield, HelpCircle, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  const handleSettingsClick = () => {
    navigate('/settings');
  };
  
  return (
    <header className="bg-white shadow-sm py-4 dark:bg-gray-800 dark:text-white">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Shield className="h-8 w-8 text-trueshield-primary dark:text-blue-400" />
          <div>
            <h1 className="text-xl font-bold text-trueshield-primary dark:text-blue-400">TrueShield</h1>
            <p className="text-xs text-trueshield-muted dark:text-gray-400">Senior Safety & Health</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-trueshield-primary hover:text-trueshield-primary/80 dark:text-blue-400 dark:hover:text-blue-300">
                <HelpCircle className="h-5 w-5 mr-1" />
                Help
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:text-white">
              <DialogHeader>
                <DialogTitle>Need Help?</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="mb-4">If you need assistance with the TrueShield app, here are some options:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Call our support line at 1-800-SHIELD-HELP</li>
                  <li>Email us at support@trueshield.example.com</li>
                  <li>Use the chat feature to connect with a care representative</li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            className="text-trueshield-primary border-trueshield-primary hover:bg-trueshield-light dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20"
            onClick={handleSettingsClick}
          >
            <Settings className="h-5 w-5 mr-1" />
            Settings
          </Button>
          
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleProfileClick}
          >
            <div className="h-10 w-10 rounded-full bg-trueshield-light dark:bg-blue-900 flex items-center justify-center text-trueshield-primary dark:text-blue-400 font-bold">
              {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
