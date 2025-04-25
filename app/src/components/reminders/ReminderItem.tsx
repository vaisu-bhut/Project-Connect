import { useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Calendar, Trash2 } from "lucide-react";
import { ReminderBase, InteractionBase } from "@/types";
import { toast } from "sonner";

interface ReminderItemProps {
  reminder: ReminderBase;
  interaction?: InteractionBase;
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ReminderItem({ reminder, interaction, onMarkAsRead, onDelete }: ReminderItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMarkAsRead = () => {
    onMarkAsRead(reminder._id);
    toast.success(`Reminder marked as ${isCompleted ? 'incomplete' : 'completed'}`);
  };
  
  const isPast = new Date(reminder.date) < new Date();
  const isCompleted = reminder.status === 'completed';
  
  return (
    <Card 
      className={`p-4 mb-3 ${
        isHovered ? "shadow-md" : "shadow-sm"
      } transition-all duration-200 border-l-4 ${
        isCompleted
          ? "border-l-gray-300 bg-gray-50"
          : isPast
            ? "border-l-red-500 bg-red-50/30"
            : "border-l-amber-500 bg-amber-50/30"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-medium ${isCompleted ? "text-gray-500 line-through" : ""}`}>
              {reminder.title}
            </h3>
            
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(reminder.date), 'PPP')}</span>
              
              <Clock className="h-3.5 w-3.5 ml-2" />
              <span>{format(new Date(reminder.date), 'p')}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {isPast && !isCompleted && (
              <Badge variant="destructive" className="text-xs">Overdue</Badge>
            )}
            {isCompleted && (
              <Badge variant="outline" className="text-xs bg-gray-100">Completed</Badge>
            )}
          </div>
        </div>
        
        {reminder.description && (
          <p className={`mt-2 text-sm ${isCompleted ? "text-gray-500" : ""}`}>
            {reminder.description}
          </p>
        )}
        
        {reminder.interactionId && (
          <div className="mt-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-xs h-7 px-2 text-muted-foreground"
              asChild
            >
              <a href={`/interactions/${reminder.interactionId}`}>
                <Eye className="h-3.5 w-3.5 mr-1" />
                View related interaction
              </a>
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex justify-end mt-2 gap-2">
        {isCompleted && onDelete && (
          <Button 
            variant="destructive" 
            size="sm" 
            className="h-7"
            onClick={() => onDelete(reminder._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7"
          onClick={handleMarkAsRead}
        >
          {isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
        </Button>
      </div>
    </Card>
  );
}
