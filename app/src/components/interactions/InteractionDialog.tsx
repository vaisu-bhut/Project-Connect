import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar } from "@/components/ui/avatar";
import { CalendarIcon, Clock, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ContactBase, InteractionBase } from "@/types";
import { toast } from "sonner";
import { contactService } from "@/services/ContactService";
import { reminderService } from "@/services/ReminderService";

const interactionFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.string().min(1, "Time is required"),
  location: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

type InteractionFormValues = z.infer<typeof interactionFormSchema>;

// After imports, define types for reminders and attachments
type ReminderForm = { _id: string; title: string; date: string; description?: string; status: 'completed' | 'incomplete' };
type AttachmentForm = { name: string; url: string; type: string };

interface InteractionDialogProps {
  trigger: React.ReactNode;
  defaultContacts?: ContactBase[];
  interaction?: InteractionBase;
  onSave?: (data: Omit<InteractionBase, '_id' | 'createdAt' | 'updatedAt'>) => void;
}

export function InteractionDialog({ trigger, defaultContacts = [], interaction, onSave }: InteractionDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<ContactBase[]>(defaultContacts);
  const [contactSearch, setContactSearch] = useState("");
  const [allContacts, setAllContacts] = useState<ContactBase[]>([]);
  const [reminders, setReminders] = useState<ReminderForm[]>([]);
  const [attachments, setAttachments] = useState<AttachmentForm[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contacts = await contactService.getAllContacts();
        setAllContacts(contacts);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        toast.error('Failed to load contacts');
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (interaction) {
      setSelectedContacts(interaction.contacts || []);
      setAttachments(interaction.attachments || []);
      
      // Fetch reminders for this interaction
      const fetchReminders = async () => {
        try {
          const fetchedReminders = await reminderService.getReminders(interaction._id);
          setReminders(fetchedReminders.map(r => ({
            _id: r._id,
          title: r.title,
            date: format(new Date(r.date), "yyyy-MM-dd'T'HH:mm"),
            description: r.description,
            status: r.status
          })));
        } catch (error) {
          console.error('Failed to fetch reminders:', error);
          toast.error('Failed to load reminders');
        }
      };
      
      fetchReminders();
    }
  }, [interaction]);

  const form = useForm<InteractionFormValues>({
    resolver: zodResolver(interactionFormSchema),
    defaultValues: {
      title: interaction?.title || "",
      type: interaction?.type || "",
      date: interaction?.date ? new Date(interaction.date) : new Date(),
      time: format(interaction?.date || new Date(), 'HH:mm'),
      location: interaction?.location || "",
      notes: interaction?.notes || "",
    },
  });

  const filteredContacts = allContacts.filter(
    contact => 
      !selectedContacts.some(sc => sc._id === contact._id) && 
      (`${contact.firstName} ${contact.lastName}`.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.email?.toLowerCase().includes(contactSearch.toLowerCase()))
  );

  const handleAddContact = (contact: ContactBase) => {
    setSelectedContacts([...selectedContacts, contact]);
    setContactSearch("");
  };

  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter(c => c._id !== contactId));
  };

  const onSubmit = async (data: InteractionFormValues) => {
    if (selectedContacts.length === 0) {
      toast.error("Please add at least one contact");
      return;
    }

    // Combine date and time
    const date = new Date(data.date);
    const [hours, minutes] = data.time.split(':').map(Number);
    date.setHours(hours, minutes);

    const interactionData: Omit<InteractionBase, '_id' | 'createdAt' | 'updatedAt'> = {
      title: data.title,
      type: data.type,
      date: date,
      contacts: selectedContacts,
      notes: data.notes || '',
      location: data.location || '',
      attachments: attachments.map(a => ({
        name: a.name,
        url: a.url,
        type: a.type
      }))
    };

    try {
    if (onSave) {
        await onSave(interactionData);
        
        // Handle reminders
        if (interaction?._id) {
          // Get existing reminders from the database
          const existingReminders = await reminderService.getReminders(interaction._id);
          const existingReminderIds = existingReminders.map(r => r._id);
          
          // Delete reminders that were removed
          for (const existingReminder of existingReminders) {
            if (!reminders.some(r => r._id === existingReminder._id)) {
              await reminderService.deleteReminder(existingReminder._id);
            }
          }
          
          // Create or update reminders
          for (const reminder of reminders) {
            if (existingReminderIds.includes(reminder._id)) {
              // Update existing reminder
              await reminderService.updateReminder(reminder._id, {
                title: reminder.title,
                description: reminder.description,
                date: new Date(reminder.date),
                time: format(new Date(reminder.date), 'HH:mm'),
                status: reminder.status
              });
            } else {
              // Create new reminder
              await reminderService.createReminder({
                title: reminder.title,
                description: reminder.description,
                date: new Date(reminder.date),
                time: format(new Date(reminder.date), 'HH:mm'),
                interactionId: interaction._id,
                status: reminder.status
              });
            }
          }
        }
      }

      toast.success("Interaction updated successfully!");
    setOpen(false);
    form.reset();
    if (defaultContacts.length === 0) {
      setSelectedContacts([]);
      }
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Failed to save interaction:', error);
      toast.error('Failed to save interaction');
    }
  };

  const handleAddReminder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.currentTarget);
    const reminder: ReminderForm = {
      _id: crypto.randomUUID(),
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      status: 'incomplete' as 'completed' | 'incomplete'
    };
    setReminders([...reminders, reminder]);
    toast.success("Reminder added successfully!");
    (e.target as HTMLFormElement).reset();
  };

  const handleAddAttachment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.currentTarget);
    const attachment: AttachmentForm = {
      name: formData.get('name') as string,
      url: formData.get('url') as string,
      type: formData.get('type') as string
    };
    setAttachments([...attachments, attachment]);
    toast.success("Attachment added successfully!");
    (e.target as HTMLFormElement).reset();
  };

  const handleRemoveReminder = (e: React.MouseEvent<HTMLButtonElement>, reminderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setReminders(reminders.filter(r => r._id !== reminderId));
  };

  const handleRemoveAttachment = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {interaction ? "Edit Interaction" : "Log Interaction"}
          </DialogTitle>
          <DialogDescription>
            {interaction 
              ? "Update the details of your interaction below."
              : "Record a new interaction with your contacts. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Coffee Meeting, Phone Call" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Call">Call</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                        />
                      </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Cafe, Office, Online" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Contacts */}
            <div className="space-y-2">
              <FormLabel>Contacts</FormLabel>
              
              {/* Selected Contacts */}
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedContacts.map(contact => (
                  <div 
                    key={contact._id} 
                    className="flex items-center gap-2 bg-muted px-2 py-1 rounded-full animate-fade-in"
                  >
                    <Avatar className="h-6 w-6 bg-network-purple">
                      <div className="font-semibold text-xs text-white">
                        {contact.firstName?.[0] ?? ''} {contact.lastName?.[0] ?? ''}
                      </div>
                    </Avatar> 
                    <span className="text-sm">{contact.firstName} {contact.lastName}</span>
                    <button 
                      type="button"
                      onClick={() => handleRemoveContact(contact._id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Contact Search */}
              <div className="relative">
                <Input 
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search contacts..."
                />
                
                {contactSearch && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto animate-fade-in">
                    {filteredContacts.length > 0 ? (
                      filteredContacts.map(contact => (
                        <div 
                          key={contact._id}
                          className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                          onClick={() => handleAddContact(contact)}
                        >
                          <Avatar className="h-8 w-8 bg-network-purple">
                            <div className="font-semibold text-xs text-white">
                              {contact.firstName?.[0] ?? ''} {contact.lastName?.[0] ?? ''}
                            </div>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{contact.firstName} {contact.lastName}</p>
                            {contact.email && (
                              <p className="text-xs text-muted-foreground">{contact.email}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-center text-muted-foreground">
                        No contacts found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Details about the interaction..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Reminders Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Reminders</h3>
              <div className="space-y-2">
                {reminders.map((reminder) => (
                  <div key={reminder._id} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{reminder.title}</p>
                      <p className="text-sm text-muted-foreground">{reminder.date}</p>
                      {reminder.description && (
                        <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => handleRemoveReminder(e, reminder._id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Reminder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Reminder</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddReminder}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div>
                        <Label htmlFor="date">Date & Time</Label>
                        <Input id="date" name="date" type="datetime-local" required />
                      </div>
                      <div>
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea id="description" name="description" />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button type="submit">Add Reminder</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Attachments Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Attachments</h3>
              <div className="space-y-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{attachment.name}</p>
                      <p className="text-sm text-muted-foreground">{attachment.type}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => handleRemoveAttachment(e, index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Attachment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Attachment</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddAttachment}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="url">URL</Label>
                        <Input id="url" name="url" type="url" required />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Input id="type" name="type" placeholder="PDF, Image, etc." required />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button type="submit">Add Attachment</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setOpen(false);
                  form.reset();
                  if (defaultContacts.length === 0) {
                    setSelectedContacts([]);
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-network-purple to-network-blue hover:from-network-purple-dark hover:to-network-blue-dark text-white"
              >
                {interaction ? "Update Interaction" : "Log Interaction"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
