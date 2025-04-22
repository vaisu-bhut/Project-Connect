import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Clock, Filter, MessageSquare, Plus, Search, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import { InteractionDialog } from "@/components/interactions/InteractionDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { InteractionBase } from "@/types";
import { interactionService } from "@/services/InteractionService";

const Interactions = () => {
  const [interactions, setInteractions] = useState<InteractionBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("dateDesc");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const data = await interactionService.getAllInteractions();
        setInteractions(data);
      } catch (error) {
        console.error('Failed to fetch interactions:', error);
        toast.error('Failed to load interactions');
      } finally {
        setLoading(false);
      }
    };

    fetchInteractions();
  }, []);
  
  // Extract unique interaction types
  const interactionTypes = Array.from(new Set(interactions.map(interaction => interaction.type)));
  
  // Filter interactions based on search query and selected type
  const filteredInteractions = interactions.filter(interaction => {
    const matchesSearch = searchQuery === "" || 
      interaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.contacts.some(c => 
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesType = selectedType === null || interaction.type === selectedType;
    
    return matchesSearch && matchesType;
  });
  
  // Sort interactions based on the selected sort option
  const sortedInteractions = [...filteredInteractions].sort((a, b) => {
    switch (sortOption) {
      case "dateDesc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "dateAsc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "titleAsc":
        return a.title.localeCompare(b.title);
      case "titleDesc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
  
  const handleLogInteraction = async (data: Omit<InteractionBase, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newInteraction = await interactionService.createInteraction({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setInteractions(prev => [newInteraction, ...prev]);
      toast.success("Interaction logged successfully!");
    } catch (error) {
      console.error('Failed to log interaction:', error);
      toast.error('Failed to log interaction');
    }
  };

  // Add attachment function
  const handleAddAttachment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    toast.success("Attachment added successfully!");
    (e.target as HTMLFormElement).reset();
  };

  // Add reminder function
  const handleAddReminder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    toast.success("Reminder added successfully!");
    (e.target as HTMLFormElement).reset();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Interactions</h1>
          <p className="text-muted-foreground">Track your conversations and meetings with your network.</p>
        </div>
        <InteractionDialog 
          trigger={
            <Button className="bg-gradient-to-r from-network-purple to-network-blue hover:from-network-purple-dark hover:to-network-blue-dark text-white transition-all duration-300 shadow-md hover:shadow-lg">
              <Plus className="mr-2 h-4 w-4" /> Log Interaction
            </Button>
          }
          onSave={handleLogInteraction}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search interactions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={`flex gap-2 ${isMobile ? 'flex-col sm:flex-row' : ''}`}>
          <Select onValueChange={(value) => setSelectedType(value === "all" ? null : value)}>
            <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[180px]'}`}>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {interactionTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`${isMobile ? 'w-full' : 'ml-auto'}`}>
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Sort
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setSortOption("dateDesc")}
                className="flex items-center justify-between"
              >
                Date (Newest first)
                {sortOption === "dateDesc" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption("dateAsc")}
                className="flex items-center justify-between"
              >
                Date (Oldest first)
                {sortOption === "dateAsc" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption("titleAsc")}
                className="flex items-center justify-between"
              >
                Title (A-Z)
                {sortOption === "titleAsc" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption("titleDesc")}
                className="flex items-center justify-between"
              >
                Title (Z-A)
                {sortOption === "titleDesc" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {sortedInteractions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="rounded-full bg-muted p-3">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No interactions found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            We couldn't find any interactions matching your search criteria. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedInteractions.map(interaction => (
            <Link to={`/interactions/${interaction._id}`} key={interaction._id}>
              <Card className="interaction-item hover:scale-[1.01]">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{interaction.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{format(new Date(interaction.date), 'PPP')}</span>
                      </div>
                    </div>
                    <Badge>{interaction.type}</Badge>
                  </div>
                  
                  {interaction.notes && (
                    <p className="mt-3 text-sm line-clamp-2">{interaction.notes}</p>
                  )}
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">With:</span>
                    <div className="flex -space-x-2 overflow-hidden">
                      {interaction.contacts.map((contact, index) => (
                        <Avatar key={`${interaction._id}-${contact._id}-${index}-${Math.random().toString(36).substr(2, 9)}`} className="h-7 w-7 border-2 border-background bg-gradient-to-br from-network-purple to-network-blue">
                          {contact.image ? (
                            <img src={contact.image} alt={`${contact.firstName} ${contact.lastName}`} />
                          ) : (
                            <div className="font-semibold text-xs text-white">
                              {contact.firstName?.[0] ?? ''}{contact.lastName?.[0] ?? ''}
                            </div>
                          )}
                        </Avatar>
                      ))}
                    </div>
                    <div className="ml-2 hidden sm:block">
                      <span className="text-sm">
                        {interaction.contacts.map(c => `${c.firstName} ${c.lastName}`).join(", ")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      
      {/* Add reminder dialog */}
      <Dialog>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
            <DialogDescription>
              Create a reminder for this interaction
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddReminder}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Reminder title" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input id="date" name="date" type="datetime-local" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea id="description" name="description" placeholder="Add details about this reminder" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-network-purple to-network-blue text-white">Save Reminder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add attachment dialog */}
      <Dialog>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Attachment</DialogTitle>
            <DialogDescription>
              Add a link or reference to an external file
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAttachment}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="File name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" name="url" placeholder="https://example.com/file.pdf" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Input id="type" name="type" placeholder="PDF, Image, Document, etc." required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-network-purple to-network-blue text-white">Save Attachment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Interactions;
