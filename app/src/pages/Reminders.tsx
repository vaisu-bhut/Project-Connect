import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Search, 
  Calendar,
  SlidersHorizontal,
  CheckCircle2,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { ReminderItem } from "@/components/reminders/ReminderItem";
import { AddReminderDialog } from "@/components/reminders/AddReminderDialog";
import { toast } from "sonner";
import { reminderService } from "@/services/ReminderService";
import { ReminderBase } from "@/types";

const Reminders = () => {
  const [reminders, setReminders] = useState<ReminderBase[]>([]);
  const [activeTab, setActiveTab] = useState("current");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dateAsc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await reminderService.getReminders();
      setReminders(data);
    } catch (err) {
      setError("Failed to fetch reminders. Please try again later.");
      toast.error("Failed to fetch reminders");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter reminders based on completion status
  const currentReminders = reminders.filter(reminder => reminder.status === 'incomplete');
  const pastReminders = reminders.filter(reminder => reminder.status === 'completed');
  
  // Filter based on search query
  const filteredCurrentReminders = currentReminders.filter(reminder => 
    reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reminder.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPastReminders = pastReminders.filter(reminder => 
    reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reminder.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort reminders based on sort option
  const sortReminders = (reminders: ReminderBase[]) => {
    return [...reminders].sort((a, b) => {
      switch (sortBy) {
        case "dateAsc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "dateDesc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "titleAsc":
          return a.title.localeCompare(b.title);
        case "titleDesc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  };
  
  const sortedCurrentReminders = sortReminders(filteredCurrentReminders);
  const sortedPastReminders = sortReminders(filteredPastReminders);
  
  // Handle marking a reminder as read/completed
  const handleMarkAsRead = async (id: string) => {
    try {
      const reminder = reminders.find(r => r._id === id);
      if (!reminder) return;

      const newStatus = reminder.status === 'completed' ? 'incomplete' : 'completed';

      await reminderService.updateReminder(id, {
        ...reminder,
        status: newStatus,
        updatedAt: new Date()
      });

      setReminders(reminders.map(reminder => 
        reminder._id === id 
          ? { ...reminder, status: newStatus, updatedAt: new Date() } 
          : reminder
      ));
      
      toast.success(`Reminder marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update reminder");
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await reminderService.deleteReminder(id);
      setReminders(reminders.filter(reminder => reminder._id !== id));
      toast.success("Reminder deleted successfully");
    } catch (err) {
      toast.error("Failed to delete reminder");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-network-purple" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold text-red-500">Error</h3>
          <p className="text-muted-foreground mt-1">{error}</p>
          <Button 
            onClick={fetchReminders}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Reminders</h1>
          <p className="text-muted-foreground">Stay on top of your follow-ups and important dates.</p>
        </div>
        <AddReminderDialog onReminderAdded={fetchReminders} />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reminders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy("dateAsc")}>
              Date (Earliest first)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("dateDesc")}>
              Date (Latest first)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("titleAsc")}>
              Title (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("titleDesc")}>
              Title (Z-A)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Current <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-network-purple text-white">{currentReminders.length}</span>
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Completed <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">{pastReminders.length}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="animate-fade-in">
          {sortedCurrentReminders.length === 0 ? (
            <Card className="p-6 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No current reminders</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                You're all caught up! Add a new reminder to stay on track.
              </p>
              <AddReminderDialog onReminderAdded={fetchReminders} />
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedCurrentReminders.map(reminder => (
                <ReminderItem
                  key={reminder._id}
                  reminder={reminder}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="animate-fade-in">
          {sortedPastReminders.length === 0 ? (
            <Card className="p-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No completed reminders</h3>
              <p className="text-muted-foreground mt-1">
                Your completed reminders will appear here.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedPastReminders.map(reminder => (
                <ReminderItem
                  key={reminder._id}
                  reminder={reminder}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteReminder}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reminders;
