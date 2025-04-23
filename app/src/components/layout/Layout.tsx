import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Add a smooth scroll effect when component mounts or route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen bg-background bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-x-hidden">
      <Sidebar />
      <MobileNav />
      
      <main className={`flex-1 transition-all duration-300 ${isMobile ? "!mt-0 pb-24" : "ml-20"}`}>
        <div className="container px-4 py-2 sm:py-6 mx-auto max-w-7xl animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
