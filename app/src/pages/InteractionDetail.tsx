import { useState } from "react";
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
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { interactions } from "@/data/sampleData";
import { InteractionDialog } from "@/components/interactions/InteractionDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const InteractionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Find the interaction by ID
  const interaction = interactions.find(i => i.id === id);
  
  // Handler for edit interaction
  const handleEditInteraction = (data: any) => {
    console.log("Edited interaction:", data);
    toast.success("Interaction updated successfully!");
    setIsEditing(false);
  };
  
  // Handler for delete interaction
  const handleDeleteInteraction = () => {
    toast.success("Interaction deleted successfully!");
    navigate("/interactions");
  };
  
  // Handler for logging new interaction
  const handleLogInteraction = (data: any) => {
    console.log("New interaction:", data);
    toast.success("Interaction logged successfully!");
  };

  // Handler for adding reminder
  const handleAddReminder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reminderData = {
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      description: formData.get('description') as string
    };
    console.log("New reminder:", reminderData);
    toast.success("Reminder added successfully!");
    (e.target as HTMLFormElement).reset();
  };

  // Handler for adding attachment
  const handleAddAttachment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const attachmentData = {
      name: formData.get('name') as string,
      url: formData.get('url') as string,
      type: formData.get('type') as string
    };
    console.log("New attachment:", attachmentData);
    toast.success("Attachment added successfully!");
    (e.target as HTMLFormElement).reset();
  };
  
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
        <div className="flex items-center gap-2 sm:hidden">
          <InteractionDialog
            trigger={
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            }
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
        <Card className="lg:col-span-1 glass-card animate-scale-in">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{interaction.title}</h2>
                <Badge className="bg-gradient-to-r from-network-teal to-network-blue text-white">
                  {interaction.type}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{format(new Date(interaction.date), 'PPPP')}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{format(new Date(interaction.date), 'p')}</span>
                </div>
                
                {interaction.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{interaction.location}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Contacts</h3>
                <div className="space-y-3">
                  {interaction.contacts.map(contact => (
                    <Link
                      key={contact.id}
                      to={`/contacts/${contact.id}`}
                      className="flex items-center p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <Avatar className="h-8 w-8 mr-3 bg-gradient-to-br from-network-purple to-network-blue">
                        {contact.image ? (
                          <img src={contact.image} alt={`${contact.firstName} ${contact.lastName}`} />
                        ) : (
                          <div className="font-semibold text-xs text-white">
                            {contact.firstName[0]}{contact.lastName[0]}
                          </div>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                        {contact.email && (
                          <p className="text-xs text-muted-foreground">{contact.email}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              <Separator className="sm:block hidden" />
              
              <div className="flex flex-col space-y-3 sm:block hidden">
                <InteractionDialog
                  trigger={
                    <Button variant="outline" className="w-full">
                      <Edit className="mr-2 h-4 w-4" /> Edit Interaction
                    </Button>
                  }
                  onSave={handleEditInteraction}
                />
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleDeleteInteraction}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Interaction
                </Button>
                <InteractionDialog
                  trigger={
                    <Button className="w-full bg-gradient-to-r from-network-purple to-network-blue hover:from-network-purple-dark hover:to-network-blue-dark text-white">
                      <MessageSquare className="mr-2 h-4 w-4" /> Log New Interaction
                    </Button>
                  }
                  defaultContacts={interaction.contacts}
                  onSave={handleLogInteraction}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 glass-card animate-scale-in">
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
                
                {interaction.reminders && interaction.reminders.length > 0 ? (
                  <div className="space-y-3">
                    {interaction.reminders.map(reminder => (
                      <div 
                        key={reminder.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          reminder.isCompleted 
                            ? "border-l-gray-300 bg-gray-50/50" 
                            : "border-l-network-purple bg-network-purple/5"
                        }`}
                      >
                        <div className="flex justify-between">
                          <h4 className={`font-medium ${reminder.isCompleted ? "text-gray-500 line-through" : ""}`}>
                            {reminder.title}
                          </h4>
                          <Badge variant={reminder.isCompleted ? "outline" : "default"}>
                            {reminder.isCompleted ? "Completed" : "Active"}
                          </Badge>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{format(new Date(reminder.date), 'PPP')}</span>
                          <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                          <span>{format(new Date(reminder.date), 'p')}</span>
                        </div>
                        {!reminder.isCompleted && (
                          <div className="mt-3 flex justify-end">
                            <Button size="sm" variant="outline" onClick={() => {
                              console.log("Marking reminder as complete:", reminder.id);
                              toast.success("Reminder marked as complete");
                            }}>
                              Mark as Complete
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                    <Bell className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No reminders</h3>
                    <p className="text-muted-foreground mt-1">
                      No reminders were set for this interaction.
                    </p>
                  </div>
                )}
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
                      <div 
                        key={index}
                        className="flex items-center p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="mr-3 p-2 rounded-full bg-muted">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">{attachment.type}</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                            <LinkIcon className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                    <Paperclip className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No attachments</h3>
                    <p className="text-muted-foreground mt-1">
                      No files were attached to this interaction.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
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
    </div>
  );
};

export default InteractionDetail;
