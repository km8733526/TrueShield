
import Header from "./Header";
import Footer from "./Footer";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-trueshield-background">
      <Header />
      <Navigation />
      <main className="flex-1 pb-20 md:pb-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
