
import { Home, User, Bell, Settings, Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Reminders", path: "/reminders" },
    { icon: Bell, label: "Alerts", path: "/alerts" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:relative md:shadow-none md:bg-transparent md:mb-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between md:justify-center md:gap-8 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  isActive 
                    ? 'text-trueshield-primary' 
                    : 'text-trueshield-muted hover:text-trueshield-primary'
                }`}
              >
                <item.icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="h-1 w-1/2 bg-trueshield-primary rounded-full mt-1" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
