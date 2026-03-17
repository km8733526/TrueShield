import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Shield, 
  User, 
  MapPin, 
  Phone, 
  Clock, 
  HelpCircle, 
  LogOut 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emergencyAlerts: true,
    locationTracking: true,
    fallDetection: true,
    healthMonitoring: true,
    autoCallEmergency: false,
    darkMode: false,
    dataSaving: false
  });
  
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const handleToggle = (setting: keyof typeof settings) => {
    if (setting === 'darkMode') {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      return;
    }

    setSettings(prev => {
      const newSettings = { ...prev, [setting]: !prev[setting] };
      
      // Show toast for the change
      toast(`${setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${newSettings[setting] ? 'enabled' : 'disabled'}`);
      
      return newSettings;
    });
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  const settingsGroups = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { key: "notifications", label: "Push Notifications" },
        { key: "emergencyAlerts", label: "Emergency Alerts" }
      ]
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      items: [
        { key: "locationTracking", label: "Location Tracking" },
        { key: "fallDetection", label: "Fall Detection" },
        { key: "healthMonitoring", label: "Health Monitoring" }
      ]
    },
    {
      title: "Emergency Settings",
      icon: Phone,
      items: [
        { key: "autoCallEmergency", label: "Auto-call Emergency Services" }
      ]
    },
    {
      title: "App Settings",
      icon: Clock,
      items: [
        { key: "darkMode", label: "Dark Mode" },
        { key: "dataSaving", label: "Data Saving Mode" }
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-trueshield-primary mb-1">Settings</h2>
          <p className="text-trueshield-muted">Manage your preferences and account</p>
        </div>

        <div className="space-y-6">
          {settingsGroups.map((group) => (
            <Card key={group.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <group.icon className="h-5 w-5 mr-2 text-trueshield-primary" />
                  <CardTitle>{group.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <Label htmlFor={item.key} className="text-base font-normal">
                        {item.label}
                      </Label>
                      <Switch
                        id={item.key}
                        checked={settings[item.key as keyof typeof settings]}
                        onCheckedChange={() => handleToggle(item.key as keyof typeof settings)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-trueshield-primary" />
                <CardTitle>Account</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </Button>
              <Separator />
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
