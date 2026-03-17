
import { Bell, BellOff } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface StatusIndicatorProps {
  isActive: boolean;
}

export const StatusIndicator = ({ isActive }: StatusIndicatorProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={`p-4 rounded-lg border ${
      theme === 'dark' 
        ? isActive ? 'bg-green-950 border-green-800' : 'bg-gray-800 border-gray-700'
        : isActive ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-2">
        {isActive ? (
          <Bell className={`h-5 w-5 ${theme === 'dark' ? 'text-green-400' : 'text-trueshield-secondary'}`} />
        ) : (
          <BellOff className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-trueshield-muted'}`} />
        )}
        <span className="font-medium">
          {isActive ? "Monitoring Active" : "Monitoring Paused"}
        </span>
      </div>
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-trueshield-muted'}`}>
        {isActive 
          ? "Fall detection is currently active and monitoring your movements." 
          : "Fall detection is currently disabled. Enable it to stay protected."}
      </p>
    </div>
  );
};
