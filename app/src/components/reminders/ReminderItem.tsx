
import { useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Eye, Calendar } from "lucide-react";
import { ReminderBase, InteractionBase } from "@/types";
import { toast } from "sonner";

interface ReminderItemProps {
  reminder: ReminderBase;
  interaction?: InteractionBase;
  onMarkAsRead: (id: string) => void;
}

export function ReminderItem({ reminder, interaction, onMarkAsRead }: ReminderItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMarkAsRead = () => {
    onMarkAsRead(reminder.id);
    toast.success("Reminder marked as read");
  };
  
  const isPast = new Date(reminder.date) < new Date();
  
  return (
    <Card 
      className={`p-4 mb-3 ${
        isHovered ? "shadow-md" : "shadow-sm"
      } transition-all duration-200 border-l-4 ${
        reminder.isCompleted
          ? "border-l-gray-300 bg-gray-50"
          : isPast
            ? "border-l-red-500 bg-red-50/30"
            : "border-l-amber-500 bg-amber-50/30"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={reminder.isCompleted}
          onCheckedChange={() => handleMarkAsRead()}
          className={`mt-1 ${
            reminder.isCompleted ? "text-gray-400" : isPast ? "text-red-500" : "text-amber-500"
          }`}
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-medium ${reminder.isCompleted ? "text-gray-500 line-through" : ""}`}>
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
              {isPast && !reminder.isCompleted && (
                <Badge variant="destructive" className="text-xs">Overdue</Badge>
              )}
              {reminder.isCompleted && (
                <Badge variant="outline" className="text-xs bg-gray-100">Completed</Badge>
              )}
            </div>
          </div>
          
          {reminder.description && (
            <p className={`mt-2 text-sm ${reminder.isCompleted ? "text-gray-500" : ""}`}>
              {reminder.description}
            </p>
          )}
          
          {interaction && (
            <div className="mt-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 text-xs h-7 px-2 text-muted-foreground"
                asChild
              >
                <a href={`/interactions/${interaction.id}`}>
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  View related interaction: {interaction.title}
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {!reminder.isCompleted && (
        <div className="flex justify-end mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7"
            onClick={handleMarkAsRead}
          >
            Mark as Read
          </Button>
        </div>
      )}
    </Card>
  );
}
