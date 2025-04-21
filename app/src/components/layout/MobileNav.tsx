
import { Link, useLocation } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Bell,
  LogOut,
  User
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileNavProps {
  user?: {
    name: string;
    image?: string;
    userId: string;
  };
}

export function MobileNav({ user = { name: "John Doe", userId: "john.doe", image: "" } }: MobileNavProps) {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-background border-b z-30 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-network-purple to-network-blue flex items-center justify-center text-white font-bold animate-pulse-slow">
            NM
          </div>
          <span className="font-bold text-base text-network-purple">NetworX</span>
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-7 w-7 rounded-full p-0">
                <Avatar className="h-7 w-7 bg-gradient-to-br from-network-purple to-network-teal">
                  {user.image ? (
                    <img src={user.image} alt={user.name} />
                  ) : (
                    <div className="font-semibold text-white text-xs">{user.name.split(" ").map(n => n[0]).join("")}</div>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">@{user.userId}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer">
                <LogOut size={16} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-30 flex items-center justify-around">
        <Link to="/" className="mobile-nav-button">
          <LayoutDashboard size={20} className={location.pathname === "/" ? "text-network-purple" : ""} />
          <span className={`text-xs ${location.pathname === "/" ? "text-network-purple" : ""}`}>Dashboard</span>
        </Link>
        
        <Link to="/contacts" className="mobile-nav-button">
          <Users size={20} className={location.pathname.startsWith("/contacts") ? "text-network-purple" : ""} />
          <span className={`text-xs ${location.pathname.startsWith("/contacts") ? "text-network-purple" : ""}`}>Contacts</span>
        </Link>
        
        <Link to="/interactions" className="mobile-nav-button">
          <MessageSquare size={20} className={location.pathname.startsWith("/interactions") ? "text-network-purple" : ""} />
          <span className={`text-xs ${location.pathname.startsWith("/interactions") ? "text-network-purple" : ""}`}>Interactions</span>
        </Link>
        
        <Link to="/reminders" className="mobile-nav-button">
          <Bell size={20} className={location.pathname.startsWith("/reminders") ? "text-network-purple" : ""} />
          <span className={`text-xs ${location.pathname.startsWith("/reminders") ? "text-network-purple" : ""}`}>Reminders</span>
        </Link>
        
        <Link to="/settings" className="mobile-nav-button">
          <User size={20} className={location.pathname.startsWith("/settings") ? "text-network-purple" : ""} />
          <span className={`text-xs ${location.pathname.startsWith("/settings") ? "text-network-purple" : ""}`}>Profile</span>
        </Link>
      </div>
      
      {/* Content Padding */}
      <div className="pb-16 pt-12"></div>
    </>
  );
}
