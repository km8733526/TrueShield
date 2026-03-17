
import { useState } from "react";
import { PersonStanding, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useFallDetection } from "@/hooks/useFallDetection";
import { StatusIndicator } from "./fall-detection/StatusIndicator";
import { SensitivityControl } from "./fall-detection/SensitivityControl";

const FallDetection = () => {
  const [isActive, setIsActive] = useState(true);
  const [sensitivity, setSensitivity] = useState(3);
  const { theme } = useTheme();
  const { lastTested, isTesting, runTest } = useFallDetection();
  
  const handleTest = () => {
    runTest(sensitivity, isActive);
  };
  
  return (
    <Card className={`border-trueshield-light shadow-sm ${theme === 'dark' ? 'bg-background text-foreground' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className={`text-xl ${theme === 'dark' ? 'text-foreground' : 'text-trueshield-primary'} flex items-center gap-2`}>
            <PersonStanding className="h-5 w-5" />
            Fall Detection
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${theme === 'dark' ? 'text-foreground' : 'text-trueshield-muted'}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
            <Switch 
              checked={isActive} 
              onCheckedChange={setIsActive} 
              className="data-[state=checked]:bg-trueshield-primary" 
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatusIndicator isActive={isActive} />
          <SensitivityControl 
            sensitivity={sensitivity}
            isActive={isActive}
            onChange={setSensitivity}
          />
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleTest}
            disabled={isTesting || !isActive}
          >
            {isTesting ? (
              <span className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 animate-pulse" />
                Testing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Run Test Now
              </span>
            )}
          </Button>
          
          <div className="text-xs text-trueshield-muted pt-2">
            Last test: {lastTested ? lastTested.toLocaleString() : 'No tests run'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FallDetection;
