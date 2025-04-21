
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Plus, 
  Search, 
  Calendar,
  SlidersHorizontal,
  CheckCircle2
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
import { interactions } from "@/data/sampleData";
import { ReminderItem } from "@/components/reminders/ReminderItem";
import { toast } from "sonner";

// Sample reminders data
const initialReminders = [
  {
    id: "1",
    title: "Follow up with client about project proposal",
    date: new Date(2025, 3, 25, 10, 0),
    isCompleted: false,
    interactionId: "1",
    createdAt: new Date(2025, 3, 20),
    updatedAt: new Date(2025, 3, 20),
    notes: "Send them the updated version with the new pricing structure"
  },
  {
    id: "2",
    title: "Call Jane about marketing strategy",
    date: new Date(2025, 3, 22, 14, 30),
    isCompleted: false,
    interactionId: "2",
    createdAt: new Date(2025, 3, 19),
    updatedAt: new Date(2025, 3, 19),
    notes: "Discuss the Q2 marketing plan and budget allocation"
  },
  {
    id: "3",
    title: "Send birthday wishes to Michael",
    date: new Date(2025, 3, 18, 9, 0),
    isCompleted: true,
    createdAt: new Date(2025, 3, 15),
    updatedAt: new Date(2025, 3, 18),
  },
  {
    id: "4",
    title: "Schedule quarterly review meeting",
    date: new Date(2025, 3, 15, 11, 0),
    isCompleted: true,
    createdAt: new Date(2025, 3, 10),
    updatedAt: new Date(2025, 3, 15),
    notes: "Prepare slides and performance metrics for the team"
  },
  {
    id: "5",
    title: "Send thank you email to conference participants",
    date: new Date(2025, 3, 10, 16, 0),
    isCompleted: true,
    interactionId: "3",
    createdAt: new Date(2025, 3, 5),
    updatedAt: new Date(2025, 3, 10),
  }
];

const Reminders = () => {
  const [reminders, setReminders] = useState(initialReminders);
  const [activeTab, setActiveTab] = useState("current");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dateAsc");
  
  // Filter reminders based on completion status
  const currentReminders = reminders.filter(reminder => !reminder.isCompleted);
  const pastReminders = reminders.filter(reminder => reminder.isCompleted);
  
  // Filter based on search query
  const filteredCurrentReminders = currentReminders.filter(reminder => 
    reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reminder.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPastReminders = pastReminders.filter(reminder => 
    reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reminder.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort reminders based on sort option
  const sortReminders = (reminders: typeof initialReminders) => {
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
  
  // Find interaction details for a reminder
  const getInteractionForReminder = (interactionId?: string) => {
    if (!interactionId) return undefined;
    return interactions.find(interaction => interaction.id === interactionId);
  };
  
  // Handle marking a reminder as read/completed
  const handleMarkAsRead = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, isCompleted: true, updatedAt: new Date() } 
        : reminder
    ));
  };
  
  // Add new reminder
  const handleAddReminder = () => {
    toast.info("Add reminder feature will be implemented soon!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Reminders</h1>
          <p className="text-muted-foreground">Stay on top of your follow-ups and important dates.</p>
        </div>
        <Button 
          onClick={handleAddReminder}
          className="bg-gradient-to-r from-network-purple to-network-blue hover:from-network-purple-dark hover:to-network-blue-dark text-white transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Reminder
        </Button>
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
              <Button 
                onClick={handleAddReminder}
                className="bg-gradient-to-r from-network-purple to-network-blue hover:from-network-purple-dark hover:to-network-blue-dark text-white transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Reminder
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedCurrentReminders.map(reminder => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  interaction={getInteractionForReminder(reminder.interactionId)}
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
                  key={reminder.id}
                  reminder={reminder}
                  interaction={getInteractionForReminder(reminder.interactionId)}
                  onMarkAsRead={handleMarkAsRead}
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
