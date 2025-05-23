import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut,
  GitCompareArrows,
  Menu
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, loading, logout } = useAuth();
  // console.log(user); 
  
  // Handle hover effects
  const handleMouseEnter = () => {
    setExpanded(true);
  };
  
  const handleMouseLeave = () => {
    setExpanded(false);
  };
  
  // Collapse sidebar by default
  useEffect(() => {
    setExpanded(false);
  }, []);

  // Don't render the sidebar on mobile devices
  if (isMobile) {
    return null;
  }

  // Get user initials safely
  const getUserInitials = () => {
    if (!user?.name) return "JD";
    return user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  // Navigation items
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Contacts", path: "/contacts", icon: Users },
    { name: "Interactions", path: "/interactions", icon: MessageSquare },
    { name: "Reminders", path: "/reminders", icon: Bell },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div 
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flex flex-col h-screen bg-sidebar fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out shadow-md ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {expanded ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-network-purple to-network-blue flex items-center justify-center text-white font-bold animate-pulse-slow">
              CL
            </div>
            <span className="font-bold text-lg text-network-purple">ConLieve</span>
            <Button variant="outline">
              <span className="transition-opacity duration-300">Beta v1.0</span>
            </Button>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-network-purple to-network-blue mx-auto flex items-center justify-center text-white font-bold animate-pulse-slow">
            CL
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className={`flex items-center p-4 border-b border-sidebar-border ${!expanded ? "flex-col" : ""}`}>
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.profilePic} alt={user?.name || "User"} />
          <AvatarFallback className="bg-gradient-to-br from-network-purple to-network-teal">
            <div className="font-semibold text-white">
              {getUserInitials()}
            </div>
          </AvatarFallback>
        </Avatar>
        {expanded && (
          <div className="ml-3 overflow-hidden">
            <p className="font-medium truncate">{user?.name || "Loading..."}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 mx-2 rounded-md transition-all duration-300 group ${
                isActive 
                  ? "bg-gradient-to-r from-network-purple to-network-purple-dark text-white" 
                  : "hover:bg-muted"
              }`}
            >
              <item.icon size={20} className={`${!expanded ? "mx-auto" : ""} transition-all duration-300`} />
              {expanded && <span className="ml-3 transition-opacity duration-300">{item.name}</span>}
              {!expanded && (
                <div className="sidebar-tooltip group-hover:scale-100">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className={`w-full justify-${expanded ? "start" : "center"} text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300`}
          onClick={logout}
        >
          <LogOut size={20} />
          {expanded && <span className="ml-2 transition-opacity duration-300">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
