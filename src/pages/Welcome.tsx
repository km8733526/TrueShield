
import { Shield, Heart, Bell, MapPin, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Bell,
    title: "Fall Detection",
    description: "Advanced sensors detect falls automatically and alert caregivers immediately."
  },
  {
    icon: Heart,
    title: "Health Monitoring",
    description: "Track vital signs and medication schedules with timely reminders."
  },
  {
    icon: MapPin,
    title: "Location Tracking",
    description: "Real-time GPS monitoring ensures help arrives exactly where needed."
  },
  {
    icon: MessageSquare,
    title: "Caregiver Chat",
    description: "Stay connected with family and caregivers through simple messaging."
  }
];

const Welcome = () => {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-trueshield-background">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center flex-1">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-trueshield-primary flex items-center justify-center shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-trueshield-primary mb-4">TrueShield</h1>
            <p className="text-xl text-trueshield-muted mb-6">Advanced Safety & Health Solution for Seniors</p>
            
            <p className="text-trueshield-text max-w-2xl mx-auto">
              Empowering seniors with enhanced safety, better health management, and greater independence through innovative technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-trueshield-light">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-trueshield-light flex items-center justify-center text-trueshield-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-trueshield-muted text-sm">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="w-full max-w-md bg-trueshield-primary hover:bg-trueshield-primary/90 text-lg py-6"
            >
              Sign In
            </Button>
            
            <Button 
              onClick={handleLogin}
              variant="outline" 
              size="lg" 
              className="w-full max-w-md border-trueshield-primary text-trueshield-primary hover:bg-trueshield-light text-lg py-6"
            >
              Create Account
            </Button>
            
            <p className="text-sm text-trueshield-muted mt-4">
              By continuing, you agree to TrueShield's Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4 text-center text-trueshield-muted">
          <p>&copy; 2025 TrueShield Health & Safety Solutions</p>
          <p className="text-sm mt-1">Advancing Senior Health & Safety</p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
