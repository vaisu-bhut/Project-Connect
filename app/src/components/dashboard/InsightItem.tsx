
import { NetworkInsight } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  BellRing, 
  Calendar, 
  User, 
  Users, 
  PieChart,
  ArrowRightLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightItemProps {
  insight: NetworkInsight;
  onMarkAsRead?: (id: string) => void;
}

export const InsightItem = ({ 
  insight, 
  onMarkAsRead 
}: InsightItemProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "reach-out":
        return <BellRing className="h-5 w-5" />;
      case "introduce":
        return <ArrowRightLeft className="h-5 w-5" />;
      case "celebration":
        return <Calendar className="h-5 w-5" />;
      case "network-stat":
        return <PieChart className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case "reach-out":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "introduce":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "celebration":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "network-stat":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div 
      className={cn(
        "flex items-start space-x-4 rounded-lg border p-4",
        !insight.isRead && "bg-secondary"
      )}
    >
      <div className={cn("rounded-full p-2", getColorClass(insight.type))}>
        {getIcon(insight.type)}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{insight.title}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
        
        {insight.contacts && insight.contacts.length > 0 && (
          <div className="mt-2 flex items-center">
            <Users className="mr-1 h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {insight.contacts.length === 1 ? "1 contact" : `${insight.contacts.length} contacts`}
            </span>
          </div>
        )}
        
        {insight.date && (
          <div className="mt-2 flex items-center">
            <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(insight.date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
      
      {!insight.isRead && onMarkAsRead && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onMarkAsRead(insight.id)}
          className="shrink-0"
        >
          Mark as read
        </Button>
      )}
    </div>
  );
};
