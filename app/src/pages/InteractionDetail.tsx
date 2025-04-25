import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Clock,
  Edit, 
  Trash2, 
  MessageSquare,
  MapPin,
  Paperclip,
  Bell,
  Link as LinkIcon,
  Plus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { InteractionDialog } from "@/components/interactions/InteractionDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { InteractionBase, ReminderBase } from "@/types";
import { interactionService } from "@/services/InteractionService";
import { reminderService } from "@/services/ReminderService";

const InteractionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [interaction, setInteraction] = useState<InteractionBase | null>(null);
  const [remindersList, setRemindersList] = useState<ReminderBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const fetchInteraction = async () => {
      try {
        if (id) {
          const data = await interactionService.getInteractionById(id);
          // Ensure all dates are properly formatted
          const formattedData = {
            ...data,
            date: data.date ? new Date(data.date) : new Date(),
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
          };
          setInteraction(formattedData);
          // Fetch separate reminders
          const fetchedRems = await reminderService.getReminders(id);
          setRemindersList(fetchedRems);
        }
      } catch (error) {
        console.error('Failed to fetch interaction:', error);
        toast.error('Failed to load interaction');
      } finally {
        setLoading(false);
      }
    };

    fetchInteraction();
  }, [id]);
  
  // Handler for edit interaction
  const handleEditInteraction = async (data: Omit<InteractionBase, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (id) {
        const formattedData = {
          ...data,
          date: new Date(data.date)
        };
        const updatedInteraction = await interactionService.updateInteraction(id, formattedData);
        setInteraction(updatedInteraction);
        toast.success("Interaction updated successfully!");
        setIsEditing(false);
        return updatedInteraction;
      }
    } catch (error) {
      console.error('Failed to update interaction:', error);
      toast.error('Failed to update interaction');
    }
  };
  
  // Handler for delete interaction
  const handleDeleteInteraction = async () => {
    try {
      if (id) {
        await interactionService.deleteInteraction(id);
        toast.success("Interaction deleted successfully!");
        navigate("/interactions");
      }
    } catch (error) {
      console.error('Failed to delete interaction:', error);
      toast.error('Failed to delete interaction');
    }
  };
  
  // Handler for logging new interaction
  const handleLogInteraction = async (data: Omit<InteractionBase, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newInteraction = await interactionService.createInteraction({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      toast.success("Interaction logged successfully!");
      return newInteraction;
    } catch (error) {
      console.error('Failed to log interaction:', error);
      toast.error('Failed to log interaction');
    }
  };

  // Handler for adding reminder via API
  const handleAddReminder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dateStr = formData.get('date') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    if (!dateStr) {
      toast.error('Please select a valid date');
      return;
    }
    try {
      if (id) {
        const date = new Date(dateStr);
        const newRem = await reminderService.createReminder({
          title,
          description,
          date,
          time: format(date, 'HH:mm'),
          interactionId: id,
          status: 'incomplete'
        });
        setRemindersList(prev => [...prev, newRem]);
        toast.success('Reminder added successfully!');
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error('Failed to add reminder:', error);
      toast.error('Failed to add reminder');
    }
  };

  // Handler for deleting a reminder
  const handleDeleteReminder = async (reminderId: string) => {
    try {
      await reminderService.deleteReminder(reminderId);
      setRemindersList(prev => prev.filter(r => r._id !== reminderId));
      toast.success('Reminder deleted successfully!');
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      toast.error('Failed to delete reminder');
    }
  };

  // Handler for updating interaction
  const handleUpdateInteraction = async (data: Omit<InteractionBase, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (id) {
        const updatedInteraction = await interactionService.updateInteraction(id, {
          ...data,
          title: data.title || '',
          type: data.type || '',
          date: data.date || new Date(),
          contacts: data.contacts || [],
          notes: data.notes || '',
          location: data.location || '',
          reminders: data.reminders || [],
          attachments: data.attachments || []
        });
        setInteraction(updatedInteraction);
        toast.success("Interaction updated successfully!");
      }
    } catch (error) {
      console.error('Failed to update interaction:', error);
      toast.error('Failed to update interaction');
    }
  };

  // Handler for adding attachment
  const handleAddAttachment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const attachmentData = {
      name: formData.get('name') as string,
      url: formData.get('url') as string,
      type: formData.get('type') as string
    };
    
    try {
      if (id) {
        const updatedInteraction = await interactionService.updateInteraction(id, {
          ...interaction,
          attachments: [...(interaction?.attachments || []), attachmentData]
        });
        setInteraction(updatedInteraction);
        toast.success("Attachment added successfully!");
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error('Failed to add attachment:', error);
      toast.error('Failed to add attachment');
    }
  };

  const handleUpdateReminderStatus = async (reminderId: string) => {
    try {
      const reminder = remindersList.find(r => r._id === reminderId);
      if (!reminder) return;

      const updatedStatus = reminder.status === 'completed' ? 'incomplete' : 'completed';
      await reminderService.updateReminder(reminderId, { status: updatedStatus });
      
      setRemindersList(prev => prev.map(r => 
        r._id === reminderId 
          ? { ...r, status: updatedStatus }
          : r
      ));
      
      toast.success(`Reminder marked as ${updatedStatus}`);
    } catch (error) {
      console.error('Failed to update reminder status:', error);
      toast.error('Failed to update reminder status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // If interaction not found, show error message
  if (!interaction) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <h2 className="text-2xl font-bold mb-4">Interaction Not Found</h2>
        <p className="text-muted-foreground mb-6">The interaction you are looking for does not exist.</p>
        <Button onClick={() => navigate("/interactions")} className="bg-gradient-to-r from-network-purple to-network-blue hover:from-network-purple-dark hover:to-network-blue-dark text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Interactions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20 sm:pb-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/interactions")} className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight gradient-text">Interaction Details</h1>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <InteractionDialog
            trigger={
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            }
            interaction={interaction}
            onSave={handleEditInteraction}
          />
          <Button 
            size="sm" 
            variant="destructive" 
            className="h-8 w-8 p-0"
            onClick={handleDeleteInteraction}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Main Details */}
        <Card className="glass-card animate-scale-in lg:col-span-1">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{interaction.title}</h2>
                <Badge className="bg-gradient-to-r from-network-teal to-network-blue text-white">
                  {interaction.type}
                </Badge>
              </div>
              
              <div className="space-y-3 bg-muted/20 p-3 rounded-lg">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-medium">{format(new Date(interaction.date), 'PPP')}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="font-medium">{format(new Date(interaction.date), 'p')}</span>
                </div>
                
                {interaction.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="font-medium">{interaction.location}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Contacts</h3>
                <div className="space-y-2">
                  {interaction?.contacts?.map((contact, index) => (
                    <Link
                      key={contact._id ?? `contact-${index}`}
                      to={contact._id ? `/contacts/${contact._id}` : '#'}
                      className="flex items-center p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <Avatar className="h-7 w-7 mr-2 bg-gradient-to-br from-network-purple to-network-blue">
                        {contact.image ? (
                          <img src={contact.image} alt={`${contact.firstName} ${contact.lastName}`} />
                        ) : (
                          <div className="font-semibold text-xs text-white">
                            {contact.firstName?.[0] ?? ''}{contact.lastName?.[0] ?? ''}
                          </div>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{contact.firstName} {contact.lastName}</p>
                        {contact.email && (
                          <p className="text-xs text-muted-foreground">{contact.email}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right Side - Notes, Reminders, and Attachments */}
        <Card className="glass-card animate-scale-in lg:col-span-2">
          <CardContent className="p-6">
            <Tabs defaultValue="notes">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="reminders">Reminders</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="notes" className="space-y-4 min-h-[300px]">
                {interaction.notes ? (
                  <div className="p-4 rounded-lg bg-muted/40">
                    <p className="whitespace-pre-line">{interaction.notes}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                    <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No notes available</h3>
                    <p className="text-muted-foreground mt-1">
                      No notes were added for this interaction.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="reminders" className="space-y-4 min-h-[300px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Reminders</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-to-r from-network-purple to-network-blue text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Reminder
                      </Button>
                    </DialogTrigger>
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
                </div>
                
                <div className="space-y-2">
                  {remindersList.map((reminder) => (
                    <div key={reminder._id} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{reminder.title}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(reminder.date), 'PPP p')}</p>
                        {reminder.description && (
                          <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleUpdateReminderStatus(reminder._id)}
                        className={reminder.status === 'completed' ? 'text-green-600' : ''}
                      >
                        {reminder.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="attachments" className="space-y-4 min-h-[300px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Attachments</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-to-r from-network-purple to-network-blue text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Attachment
                      </Button>
                    </DialogTrigger>
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
                
                {interaction.attachments && interaction.attachments.length > 0 ? (
                  <div className="space-y-3">
                    {interaction.attachments.map((attachment, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/40">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{attachment.name}</p>
                              <p className="text-sm text-muted-foreground">{attachment.type}</p>
                            </div>
                          </div>
                          <a 
                            href={attachment.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-network-purple hover:text-network-purple-dark"
                          >
                            <LinkIcon className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                    <Paperclip className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No attachments</h3>
                    <p className="text-muted-foreground mt-1">
                      No attachments were added to this interaction.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {isMobile && (
        <div className="fixed bottom-20 right-4 z-20">
          <InteractionDialog
            trigger={
              <Button size="sm" className="rounded-full w-12 h-12 p-0 shadow-lg bg-gradient-to-r from-network-purple to-network-blue">
                <MessageSquare className="h-5 w-5" />
              </Button>
            }
            defaultContacts={interaction.contacts}
            onSave={handleLogInteraction}
          />
        </div>
      )}
    </div>
  );
};

export default InteractionDetail;
