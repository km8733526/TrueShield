import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 p-8 max-w-md">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-trueshield-light flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-trueshield-accent" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-trueshield-primary">404</h1>
          <p className="text-xl text-trueshield-text mb-4">This page could not be found</p>
          <p className="text-trueshield-muted mb-6">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="bg-trueshield-primary hover:bg-trueshield-primary/90">
            <a href="/">Return to Dashboard</a>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
