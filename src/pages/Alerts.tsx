import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  AlertTriangle, 
  Phone, 
  Pill, 
  UserRound, 
  ArrowRight,
  Calendar,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CaregiverChat from "@/components/chat/CaregiverChat";

interface Alert {
  id: string;
  type: "emergency" | "fall" | "medication" | "health";
  title: string;
  description: string;
  timestamp: Date;
  notified: boolean;
  priority: "high" | "medium" | "low";
}

const Alerts = () => {
  const { toast } = useToast();
  const [alertSettings, setAlertSettings] = useState({
    emergencyAlerts: true,
    fallDetection: true,
    medicationReminders: true,
    healthAlerts: true
  });
  
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "fall",
      title: "Fall detected",
      description: "A fall was detected at 2:30 PM. Caretaker has been notified.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      notified: true,
      priority: "high"
    },
    {
      id: "2",
      type: "medication",
      title: "Missed medication",
      description: "Lisinopril (8:00 AM) has not been marked as taken.",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      notified: true,
      priority: "medium"
    },
    {
      id: "3",
      type: "health",
      title: "Abnormal blood pressure",
      description: "Blood pressure reading was 150/95, which is above your normal range.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      notified: true,
      priority: "medium"
    }
  ]);

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "emergency":
        return <Phone className="h-5 w-5 text-red-500" />;
      case "fall":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "medication":
        return <Pill className="h-5 w-5 text-blue-500" />;
      case "health":
        return <UserRound className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityClass = (priority: Alert["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-100";
      case "medium":
        return "bg-orange-50 border-orange-100";
      case "low":
        return "bg-blue-50 border-blue-100";
      default:
        return "bg-gray-50 border-gray-100";
    }
  };

  const handleToggleAlertSetting = (key: keyof typeof alertSettings) => {
    setAlertSettings({
      ...alertSettings,
      [key]: !alertSettings[key]
    });
    
    toast({
      title: `${alertSettings[key] ? "Disabled" : "Enabled"} ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
      description: `You have ${alertSettings[key] ? "disabled" : "enabled"} ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`
    });
  };

  const triggerEmergencyAlert = () => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      type: "emergency",
      title: "Emergency alert triggered",
      description: "Emergency alert was manually triggered. Caretaker has been notified.",
      timestamp: new Date(),
      notified: true,
      priority: "high"
    };
    
    setAlerts([newAlert, ...alerts]);
    
    // Simulate notifying caretaker
    toast({
      title: "Emergency alert sent",
      description: "Your caretaker has been notified of your emergency alert.",
      variant: "destructive"
    });
  };

  const formatAlertTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-trueshield-primary mb-1">Alerts & Notifications</h2>
          <p className="text-trueshield-muted">Manage alerts and get notified of important events</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-trueshield-primary mb-2">Emergency Alert</h3>
                    <p className="text-trueshield-muted mb-4">Press the button to immediately notify your emergency contacts</p>
                    <Button 
                      variant="destructive" 
                      className="px-8"
                      onClick={triggerEmergencyAlert}
                    >
                      Send Emergency Alert
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-trueshield-primary">Recent Alerts</h3>
              
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <Card key={alert.id} className={`border ${getPriorityClass(alert.priority)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-trueshield-primary">{alert.title}</h4>
                            <span className="text-xs text-trueshield-muted">
                              {formatAlertTime(alert.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-trueshield-muted mt-1">{alert.description}</p>
                          {alert.notified && (
                            <div className="mt-2 text-xs flex items-center text-trueshield-secondary">
                              <UserRound className="h-3 w-3 mr-1" /> 
                              Caretaker notified
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-trueshield-muted opacity-30" />
                    <h4 className="text-trueshield-primary font-medium mb-1">No recent alerts</h4>
                    <p className="text-sm text-trueshield-muted">When you receive alerts, they will appear here</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Alert Settings</CardTitle>
                <CardDescription>Configure what alerts you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    <span>Emergency Alerts</span>
                  </div>
                  <Switch 
                    checked={alertSettings.emergencyAlerts} 
                    onCheckedChange={() => handleToggleAlertSetting('emergencyAlerts')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span>Fall Detection</span>
                  </div>
                  <Switch 
                    checked={alertSettings.fallDetection} 
                    onCheckedChange={() => handleToggleAlertSetting('fallDetection')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Pill className="h-4 w-4 text-blue-500" />
                    <span>Medication Reminders</span>
                  </div>
                  <Switch 
                    checked={alertSettings.medicationReminders} 
                    onCheckedChange={() => handleToggleAlertSetting('medicationReminders')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserRound className="h-4 w-4 text-purple-500" />
                    <span>Health Alerts</span>
                  </div>
                  <Switch 
                    checked={alertSettings.healthAlerts} 
                    onCheckedChange={() => handleToggleAlertSetting('healthAlerts')}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/settings" className="flex items-center justify-center">
                    Manage Alert Preferences <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-6">
              <CaregiverChat />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Alerts;
