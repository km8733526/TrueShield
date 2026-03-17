
import { Loader2 } from "lucide-react";

interface LoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function Loading({ 
  text = "Loading...", 
  size = "md", 
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10"
  };
  
  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50" 
    : "flex flex-col items-center justify-center p-8";
  
  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} text-trueshield-primary animate-spin`} />
        {text && (
          <p className="text-trueshield-muted text-sm">{text}</p>
        )}
      </div>
    </div>
  );
}
