import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart4, 
  Users, 
  CalendarDays, 
  Network, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  LogOut,
  Lightbulb,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { title: "Dashboard", icon: BarChart4, path: "/" },
  { title: "Contacts", icon: Users, path: "/contacts" },
  { title: "Interactions", icon: CalendarDays, path: "/interactions" },
  { title: "Network Map", icon: Network, path: "/network" },
  { title: "Insights", icon: Lightbulb, path: "/insights" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
  };

  // Get user's initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="flex h-14 items-center justify-between border-b px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-nexus-purple">
            Nexus
          </span>
        </div>
        <Link
          to="/insights"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1 transition-colors",
            location.pathname === "/insights"
              ? "text-nexus-purple"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Bell className="h-5 w-5" />
        </Link>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background lg:hidden">
        {sidebarItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 rounded-md transition-colors",
              location.pathname === item.path
                ? "text-nexus-purple"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px]">{item.title}</span>
          </Link>
        ))}
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-nexus-purple">
                Nexus
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 border-2 border-primary/10">
                <AvatarImage src={user?.photoUrl} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-nexus-purple to-nexus-purple-dark text-white">
                  {user?.name ? getInitials(user.name) : 'UN'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{user?.name || 'User Name'}</h3>
                <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <nav className="grid gap-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    location.pathname === item.path
                      ? "bg-nexus-purple text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex h-screen flex-col border-r bg-sidebar transition-all duration-300 ease-in-out fixed left-0 top-0 z-50 overflow-hidden",
          collapsed ? "w-16" : "w-64"
        )}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <div className="flex h-14 items-center border-b px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-nexus-purple">
                Nexus
              </span>
            </div>
          )}
        </div>
        
        {/* User Profile Section */}
        <div className={cn(
          "flex items-center gap-3 p-4 border-b",
          collapsed ? "justify-center" : ""
        )}>
          <Avatar className={cn(
            "transition-all duration-300 border-2 border-primary/10",
            collapsed ? "h-9 w-9" : "h-12 w-12"
          )}>
            <AvatarImage src={user?.photoUrl} alt={user?.name} />
            <AvatarFallback className="bg-gradient-to-br from-nexus-purple to-nexus-purple-dark text-white">
              {user?.name ? getInitials(user.name) : 'UN'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{user?.name || 'User Name'}</h3>
              <p className="text-sm text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-3 px-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  location.pathname === item.path
                    ? "bg-nexus-purple text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Logout Button */}
        <div className="border-t p-4">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
              collapsed && "justify-center px-0"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </div>

      {/* Main Content Spacer */}
      <div className={cn(
        "hidden lg:block transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )} />
    </>
  );
};
