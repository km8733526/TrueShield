
import { Shield, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white shadow-sm py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-trueshield-primary" />
            <span className="text-trueshield-primary font-semibold">TrueShield</span>
          </div>
          
          <div className="text-sm text-trueshield-muted">
            &copy; 2025 TrueShield Health & Safety Solutions
          </div>
          
          <div className="flex items-center gap-2 text-sm text-trueshield-muted">
            <Heart className="h-4 w-4 text-trueshield-accent" />
            <span>Advancing Senior Health & Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
