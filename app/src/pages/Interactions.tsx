import { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  User, 
  Clock, 
  MessageSquare, 
  Search,
  Loader2,
  Paperclip,
  LayoutList,
  CalendarDays,
  X,
  Users,
  Tag,
  Globe,
  Bell,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockInteractions, mockContacts } from "@/data/mockData";
import { Link } from "react-router-dom";
import { contactsApi, interactionsApi } from "@/services/api";
import { Contact, Interaction } from "@/types";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Separate component for interaction card to avoid code duplication
const InteractionCard = ({ interaction, contact }: { interaction: Interaction; contact: Contact }) => {
  const interactionDate = new Date(interaction.date);
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={contact.photoUrl} alt={contact.name} />
            <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-medium">{interaction.type}</span> with{" "}
                <Link 
                  to={`/contacts/${contact._id}`}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {contact.name}
                </Link>
                <div className="mt-1 font-medium">{interaction.title}</div>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {interactionDate.toLocaleDateString()}
                <Clock className="ml-2 mr-1 h-3 w-3" />
                {interaction.time}
              </div>
            </div>
            <p className="mt-1 text-sm">{interaction.notes}</p>
            
            {/* Attachments */}
            {interaction.attachments && interaction.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {interaction.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={`${import.meta.env.VITE_API_URL}${attachment.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs hover:bg-secondary/80 transition-colors"
                  >
                    <Paperclip className="h-3 w-3" />
                    <span className="truncate max-w-[150px]">{attachment.name}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Reminders */}
            {interaction.reminders && interaction.reminders.length > 0 && (
              <div className="mt-2 space-y-2">
                {interaction.reminders.map((reminder, index) => (
                  <div key={index} className="flex items-center justify-between rounded-md bg-secondary p-2 text-xs">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      <span>Reminder: {reminder.message}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(reminder.date).toLocaleDateString()} at {reminder.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Interactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [contacts, setContacts] = useState<{ [key: string]: Contact }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Interaction | null>(null);
  const [isEventPreviewOpen, setIsEventPreviewOpen] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Interaction | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    startTime: "00:00",
    endTime: "00:30",
    location: "",
    isAllDay: false,
    isOnline: false,
    meetingLink: "",
    attendees: [] as { id: string; name: string; email: string }[],
    type: "",
    notes: "",
    reminderBefore: "15" // in minutes
  });
  const [reminders, setReminders] = useState<Array<{ date: string; time: string; message: string }>>([]);
  const [attachments, setAttachments] = useState<Array<{ id: string; name: string; file: File }>>([]);
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [suggestedAttendees, setSuggestedAttendees] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [busySlots, setBusySlots] = useState<Array<{ start: string; end: string }>>([]);
  const timeViewRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch all contacts
        const contactsData = await contactsApi.getAll();
        const contactsMap = contactsData.reduce((acc, contact) => {
          acc[contact._id] = contact;
          return acc;
        }, {} as { [key: string]: Contact });
        setContacts(contactsMap);

        // Fetch all interactions
        const interactionsData = await interactionsApi.getAll();
        setInteractions(interactionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Failed to load interactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter contacts for attendee suggestions
  useEffect(() => {
    if (attendeeSearch.length > 0) {
      const suggestions = Object.values(contacts)
        .filter(contact => 
          contact.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
          contact.email.toLowerCase().includes(attendeeSearch.toLowerCase())
        )
        .map(contact => ({
          id: contact._id,
          name: contact.name,
          email: contact.email
        }));
      setSuggestedAttendees(suggestions);
    } else {
      setSuggestedAttendees([]);
    }
  }, [attendeeSearch, contacts]);

  // Improved filtering for interactions based on search query and type
  const filteredInteractions = interactions.filter(interaction => {
    const contact = contacts[interaction.contactId];
    if (!contact) return false;

    const matchesSearch = searchQuery === "" || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (interaction.notes?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      interaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (interaction.title?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesType = 
      activeTab === "all" || 
      (activeTab === "calls" && interaction.type.toLowerCase() === "call") ||
      (activeTab === "meetings" && interaction.type.toLowerCase() === "meeting") ||
      (activeTab === "emails" && interaction.type.toLowerCase() === "email") ||
      (activeTab === "other" && !["call", "meeting", "email"].includes(interaction.type.toLowerCase()));

    return matchesSearch && matchesType;
  });

  // Add this effect to fetch busy slots when date changes
  useEffect(() => {
    // This is a mock implementation - replace with actual API call
    const fetchBusySlots = () => {
      // Mock busy slots for demonstration
      setBusySlots([
        { start: "02:00", end: "03:30" },
        { start: "05:00", end: "06:00" },
      ]);
    };
    
    fetchBusySlots();
  }, [newEvent.date]);

  // Add effect to handle time view scrolling
  useEffect(() => {
    if (timeViewRef.current && !newEvent.isAllDay) {
      const selectedHour = parseInt(newEvent.startTime.split(':')[0]);
      const selectedMinutes = parseInt(newEvent.startTime.split(':')[1]);
      const hourHeight = timeViewRef.current.scrollHeight / 24;
      // Calculate scroll position including minutes
      const scrollPosition = (selectedHour + selectedMinutes / 60) * hourHeight;
      // Add small offset to show some time before the selected time
      const offset = hourHeight;
      timeViewRef.current.scrollTop = Math.max(0, scrollPosition - offset);
    }
  }, [newEvent.startTime, newEvent.isAllDay]);

  const handleSaveEvent = async () => {
    try {
      // Validate required fields
      if (!newEvent.title) {
        toast.error("Please enter a title");
        return;
      }
      if (!newEvent.type) {
        toast.error("Please select an event type");
        return;
      }

      // Create FormData for file uploads
      const formData = new FormData();
      attachments.forEach(attachment => {
        formData.append('files', attachment.file);
      });

      // Format the event data according to backend schema
      const eventData = {
        title: newEvent.title,
        type: newEvent.type.toLowerCase(),
        date: format(newEvent.date, "yyyy-MM-dd"),
        time: newEvent.isAllDay ? "all-day" : `${newEvent.startTime}-${newEvent.endTime}`,
        notes: newEvent.notes || "",
        contactIds: newEvent.attendees.map(a => a.id),
        location: newEvent.isOnline ? newEvent.meetingLink : newEvent.location,
        userId: "64f5c1f37e7a4d001c3f9012",
        reminders: reminders.map(reminder => ({
          date: format(new Date(reminder.date), "yyyy-MM-dd"),
          time: reminder.time,
          message: reminder.message,
          minutes: parseInt(newEvent.reminderBefore)
        }))
      };

      let createdEvent;
      if (isEditingEvent && editingEvent) {
        // Update existing event
        createdEvent = await interactionsApi.update(editingEvent._id, eventData);
        // Upload new attachments if any
        if (attachments.length > 0) {
          await interactionsApi.uploadAttachments(editingEvent._id, formData);
        }
        // Update the interactions list
        setInteractions(prev => prev.map(i => i._id === editingEvent._id ? createdEvent : i));
      } else {
        // Create new event
        createdEvent = await interactionsApi.create(eventData);
        // Upload attachments if any
        if (attachments.length > 0) {
          await interactionsApi.uploadAttachments(createdEvent._id, formData);
        }
        // Update the interactions list with the new event
        setInteractions(prev => [createdEvent, ...prev]);
      }
      
      // Show success message and close dialog
      toast.success(`Event ${isEditingEvent ? 'updated' : 'created'} successfully`);
      setIsNewEventOpen(false);
      
      // Reset the form
      setNewEvent({
        title: "",
        date: new Date(),
        startTime: "00:00",
        endTime: "00:30",
        location: "",
        isAllDay: false,
        isOnline: false,
        meetingLink: "",
        attendees: [],
        type: "",
        notes: "",
        reminderBefore: "15"
      });
      setReminders([]);
      setAttachments([]);
      setIsEditingEvent(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(error instanceof Error ? error.message : `Failed to ${isEditingEvent ? 'update' : 'create'} event`);
    }
  };

  // Add effect to populate form when editing
  useEffect(() => {
    if (isEditingEvent && editingEvent) {
      const [startTime, endTime] = editingEvent.time.split('-');
      setNewEvent({
        title: editingEvent.title,
        date: new Date(editingEvent.date),
        startTime: startTime || "00:00",
        endTime: endTime || "00:30",
        location: editingEvent.location || "",
        isAllDay: editingEvent.time === "all-day",
        isOnline: editingEvent.location?.startsWith('http'),
        meetingLink: editingEvent.location?.startsWith('http') ? editingEvent.location : "",
        attendees: editingEvent.contactIds.map(id => {
          const contact = contacts[id];
          return {
            id: contact._id,
            name: contact.name,
            email: contact.email
          };
        }),
        type: editingEvent.type,
        notes: editingEvent.notes || "",
        reminderBefore: "15"
      });
      setReminders(editingEvent.reminders || []);
      // Note: We can't pre-populate attachments as they need to be re-uploaded
    }
  }, [isEditingEvent, editingEvent, contacts]);

  if (isLoading) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
        <Loader2 className="mb-2 h-10 w-10 text-muted-foreground animate-spin" />
        <h3 className="text-lg font-medium">Loading interactions...</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Interactions</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <LayoutList className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="flex flex-col gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="calls">Calls</TabsTrigger>
                <TabsTrigger value="meetings">Meetings</TabsTrigger>
                <TabsTrigger value="emails">Emails</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-4">
                <div className="relative w-[300px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search interactions..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsNewEventOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
              </div>
            </div>
            <TabsContent value="all" className="mt-4 space-y-4">
              {filteredInteractions.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                  <MessageSquare className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No interactions found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or log a new interaction
                  </p>
                </div>
              ) : (
                filteredInteractions.map((interaction) => (
                  <InteractionCard 
                    key={interaction._id} 
                    interaction={interaction} 
                    contact={contacts[interaction.contactId]} 
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="calls" className="mt-4 space-y-4">
              {filteredInteractions.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                  <MessageSquare className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No calls found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or log a new interaction
                  </p>
                </div>
              ) : (
                filteredInteractions.map((interaction) => (
                  <InteractionCard 
                    key={interaction._id} 
                    interaction={interaction} 
                    contact={contacts[interaction.contactId]} 
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="meetings" className="mt-4 space-y-4">
              {filteredInteractions.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                  <MessageSquare className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No meetings found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or log a new interaction
                  </p>
                </div>
              ) : (
                filteredInteractions.map((interaction) => (
                  <InteractionCard 
                    key={interaction._id} 
                    interaction={interaction} 
                    contact={contacts[interaction.contactId]} 
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="emails" className="mt-4 space-y-4">
              {filteredInteractions.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                  <MessageSquare className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No emails found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or log a new interaction
                  </p>
                </div>
              ) : (
                filteredInteractions.map((interaction) => (
                  <InteractionCard 
                    key={interaction._id} 
                    interaction={interaction} 
                    contact={contacts[interaction.contactId]} 
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="other" className="mt-4 space-y-4">
              {filteredInteractions.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                  <MessageSquare className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No other interactions found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or log a new interaction
                  </p>
                </div>
              ) : (
                filteredInteractions.map((interaction) => (
                  <InteractionCard 
                    key={interaction._id} 
                    interaction={interaction} 
                    contact={contacts[interaction.contactId]} 
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="grid grid-cols-[3fr,1fr] gap-6 h-[calc(100vh-8rem)]">
          {/* Calendar Section */}
          <div className="bg-white rounded-xl shadow-md p-4 h-full">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="w-full"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center text-xl font-semibold mb-4",
                caption_label: "text-base font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-9 w-9 bg-primary/5 hover:bg-primary/10 rounded-md transition-colors flex items-center justify-center",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse border border-border",
                head_row: "flex w-full border-b border-border",
                head_cell: "text-muted-foreground w-[14.28%] font-medium text-sm py-4 border-r border-border last:border-r-0",
                row: "flex w-full mt-0 border-b border-border last:border-b-0",
                cell: "w-[14.28%] h-24 relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/10 border-r border-border last:border-r-0",
                day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-primary/5 rounded-md transition-colors relative",
                day_range_end: "day-range-end",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
                day_today: "bg-accent text-accent-foreground rounded-md",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              components={{
                DayContent: ({ date, ...props }) => {
                  const dayEvents = filteredInteractions.filter(
                    (interaction) =>
                      format(new Date(interaction.date), "yyyy-MM-dd") ===
                      format(date, "yyyy-MM-dd")
                  );

                  return (
                    <div className="w-full h-full p-2 relative flex flex-col">
                      <span className="text-base font-medium">
                        {format(date, "d")}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="mt-auto">
                          <div className="flex flex-col gap-1">
                            {dayEvents.slice(0, 3).map((event, i) => (
                              <div
                                key={event._id}
                                className={`text-xs truncate px-2 py-1 rounded ${
                                  format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-primary/10 text-primary"
                                }`}
                                title={event.title}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <span className="text-xs text-muted-foreground px-2">
                                +{dayEvents.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </div>

          {/* Events Panel */}
          <div className="bg-white rounded-xl shadow-md p-4 h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {format(selectedDate, "MMMM d, yyyy")}
                </h3>
                <Button
                  size="sm"
                  onClick={() => setIsNewEventOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
              </div>
              <div className="space-y-2">
                {filteredInteractions
                  .filter(
                    (interaction) =>
                      format(new Date(interaction.date), "yyyy-MM-dd") ===
                      format(selectedDate, "yyyy-MM-dd")
                  )
                  .map((interaction) => (
                    <div key={interaction._id} className="relative">
                      <Card 
                        className={`hover:shadow-md transition-shadow cursor-pointer ${
                          selectedEvent?._id === interaction._id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => {
                          setSelectedEvent(interaction);
                          setIsEventPreviewOpen(true);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-1 self-stretch rounded-full bg-primary`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-medium truncate">{interaction.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {interaction.time} · {interaction.type}
                                  </p>
                                </div>
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={contacts[interaction.contactId]?.photoUrl} />
                                  <AvatarFallback>
                                    {contacts[interaction.contactId]?.name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              {interaction.notes && (
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                  {interaction.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      {selectedEvent?._id === interaction._id && isEventPreviewOpen && (
                        <div className="absolute right-0 top-0 w-80 bg-white rounded-lg shadow-lg border border-border z-10">
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="font-medium">{selectedEvent.title}</h4>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingEvent(selectedEvent);
                                    setIsEditingEvent(true);
                                    setIsNewEventOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setIsEventPreviewOpen(false)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{selectedEvent.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span>{format(new Date(selectedEvent.date), "MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{contacts[selectedEvent.contactId]?.name}</span>
                              </div>
                              {selectedEvent.notes && (
                                <div className="pt-3 border-t">
                                  <p className="text-sm text-muted-foreground">
                                    {selectedEvent.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                {filteredInteractions.filter(
                  (interaction) =>
                    format(new Date(interaction.date), "yyyy-MM-dd") ===
                    format(selectedDate, "yyyy-MM-dd")
                ).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No events scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Event Dialog */}
      <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
        <DialogContent className="max-w-5xl w-[1200px] p-0 overflow-hidden">
          <div className="flex h-[580px] bg-white">
            {/* Left Section */}
            <div className="w-[700px] border-r">
              <div className="p-6 border-b bg-white sticky top-0 z-10">
                <DialogHeader>
                  <DialogTitle className="text-xl">New event</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Add a new event to your calendar. Fill in the details below.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-6 h-[calc(100%-80px)] overflow-y-auto">
                {/* Title Input */}
                <div>
                  <Input
                    placeholder="Add a title"
                    className="text-lg border-b border-input hover:border-primary px-0 rounded-none focus-visible:ring-0 focus-visible:border-primary"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>

                {/* Date and Time Section */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-2 items-center">
                    <Input
                      type="date"
                      value={format(newEvent.date, "yyyy-MM-dd")}
                      onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                      className="w-[150px]"
                    />
                  </div>
                  {!newEvent.isAllDay && (
                    <div className="flex gap-2 items-center">
                      <Select value={newEvent.startTime} onValueChange={(value) => setNewEvent({ ...newEvent, startTime: value })}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 48 }).map((_, i) => {
                            const hour = Math.floor(i / 2);
                            const minute = i % 2 === 0 ? "00" : "30";
                            const time = `${hour.toString().padStart(2, "0")}:${minute}`;
                            return (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <span>to</span>
                      <Select value={newEvent.endTime} onValueChange={(value) => setNewEvent({ ...newEvent, endTime: value })}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 48 }).map((_, i) => {
                            const hour = Math.floor(i / 2);
                            const minute = i % 2 === 0 ? "00" : "30";
                            const time = `${hour.toString().padStart(2, "0")}:${minute}`;
                            return (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Label htmlFor="allDay" className="text-sm">All day</Label>
                    <Switch
                      id="allDay"
                      checked={newEvent.isAllDay}
                      onCheckedChange={(checked) => setNewEvent({ ...newEvent, isAllDay: checked })}
                    />
                  </div>
                </div>

                {/* Location and Online Toggle Section */}
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2 items-center">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder={newEvent.isOnline ? "Meeting link (optional)" : "Add location"}
                        className="border-0 focus-visible:ring-0"
                        value={newEvent.isOnline ? newEvent.meetingLink : newEvent.location}
                        onChange={(e) => setNewEvent(newEvent.isOnline 
                          ? { ...newEvent, meetingLink: e.target.value }
                          : { ...newEvent, location: e.target.value }
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <Label htmlFor="online" className="text-sm">Online meeting</Label>
                    <Switch
                      id="online"
                      checked={newEvent.isOnline}
                      onCheckedChange={(checked) => setNewEvent({ ...newEvent, isOnline: checked })}
                    />
                  </div>
                </div>

                {/* Type and Reminder Section */}
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2 items-center">
                      <Tag className="h-5 w-5 text-muted-foreground" />
                      <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                        <SelectTrigger className="w-full border-0 focus:ring-0">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="call">Call</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center min-w-[200px]">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <Select 
                      value={newEvent.reminderBefore} 
                      onValueChange={(value) => setNewEvent({ ...newEvent, reminderBefore: value })}
                    >
                      <SelectTrigger className="w-full border-0 focus:ring-0">
                        <SelectValue placeholder="Remind before" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes before</SelectItem>
                        <SelectItem value="15">15 minutes before</SelectItem>
                        <SelectItem value="30">30 minutes before</SelectItem>
                        <SelectItem value="60">1 hour before</SelectItem>
                        <SelectItem value="120">2 hours before</SelectItem>
                        <SelectItem value="180">3 hours before</SelectItem>
                        <SelectItem value="1440">1 day before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Attendees */}
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div className="relative flex-1">
                      <Input
                        placeholder="Add attendees"
                        className="border-0 focus-visible:ring-0"
                        value={attendeeSearch}
                        onChange={(e) => setAttendeeSearch(e.target.value)}
                        onBlur={() => {
                          // Use setTimeout to allow click events on suggestions to fire first
                          setTimeout(() => {
                            setAttendeeSearch("");
                          }, 200);
                        }}
                      />
                      {suggestedAttendees.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-md border shadow-lg z-10">
                          {suggestedAttendees.map((attendee) => (
                            <button
                              key={attendee.id}
                              className="w-full px-3 py-2 text-left hover:bg-secondary/50 flex items-center gap-2"
                              onClick={() => {
                                setNewEvent({
                                  ...newEvent,
                                  attendees: [...newEvent.attendees, attendee]
                                });
                                setAttendeeSearch("");
                              }}
                              onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from firing
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={contacts[attendee.id]?.photoUrl} />
                                <AvatarFallback>{attendee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{attendee.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{attendee.email}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {newEvent.attendees.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {newEvent.attendees.map((attendee) => (
                        <div
                          key={attendee.id}
                          className="flex items-center gap-1 bg-secondary rounded-full pl-2 pr-1 py-1"
                        >
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={contacts[attendee.id]?.photoUrl} />
                            <AvatarFallback>{attendee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{attendee.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 hover:bg-secondary/80"
                            onClick={() => {
                              setNewEvent({
                                ...newEvent,
                                attendees: newEvent.attendees.filter(a => a.id !== attendee.id)
                              });
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <Textarea
                  placeholder="Add notes"
                  className="min-h-[130px] resize-none"
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                />

                {/* Reminders Section */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Reminders</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => setReminders([...reminders, { date: '', time: '', message: '' }])}>
                      <Plus className="mr-1 h-3 w-3" />
                      Add Reminder
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {reminders.map((reminder, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="grid grid-cols-3 gap-2 flex-1">
                          <Input
                            type="date"
                            value={reminder.date}
                            onChange={(e) => {
                              const updatedReminders = [...reminders];
                              updatedReminders[index].date = e.target.value;
                              setReminders(updatedReminders);
                            }}
                          />
                          <Input
                            type="time"
                            value={reminder.time}
                            onChange={(e) => {
                              const updatedReminders = [...reminders];
                              updatedReminders[index].time = e.target.value;
                              setReminders(updatedReminders);
                            }}
                          />
                          <Input
                            placeholder="Reminder message"
                            value={reminder.message}
                            onChange={(e) => {
                              const updatedReminders = [...reminders];
                              updatedReminders[index].message = e.target.value;
                              setReminders(updatedReminders);
                            }}
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setReminders(reminders.filter((_, i) => i !== index))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="grid gap-2">
                  <Label>Attachments</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Files
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            const newAttachments = Array.from(files).map(file => ({
                              id: Math.random().toString(36).substr(2, 9),
                              name: file.name,
                              file
                            }));
                            setAttachments([...attachments, ...newAttachments]);
                          }
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload files related to this interaction
                      </p>
                    </div>
                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        {attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm truncate">{attachment.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setAttachments(attachments.filter(a => a.id !== attachment.id))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Time View */}
            <div className="w-[500px] flex flex-col h-full bg-white rounded-r-lg overflow-hidden">
              <div className="p-6 border-b bg-white sticky top-0 z-10">
                <h3 className="font-medium">
                  {format(newEvent.date, "EEEE, MMMM d")}
                </h3>
              </div>

              <div 
                ref={timeViewRef}
                className="flex-1 overflow-y-auto relative bg-white"
              >
                <div className="absolute inset-0 min-w-full bg-white">
                  <div className="relative py-2">
                    {/* Busy slots overlay */}
                    {!newEvent.isAllDay && busySlots.map((slot, index) => {
                      const startMinutes = parseInt(slot.start.split(':')[0]) * 60 + parseInt(slot.start.split(':')[1]);
                      const endMinutes = parseInt(slot.end.split(':')[0]) * 60 + parseInt(slot.end.split(':')[1]);
                      return (
                        <div
                          key={index}
                          className="absolute left-12 right-4 bg-secondary/30"
                          style={{
                            top: `${(startMinutes / 1440) * 100}%`,
                            height: `${((endMinutes - startMinutes) / 1440) * 100}%`,
                            backdropFilter: 'blur(1px)',
                            borderLeft: '2px solid var(--secondary)',
                          }}
                        />
                      );
                    })}

                    {/* Time slots */}
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <div key={hour} className="flex items-center">
                        <div className="w-12 px-2 py-3 text-xs text-muted-foreground sticky left-0 bg-white z-10">
                          {hour.toString().padStart(2, "0")}:00
                        </div>
                        <div className="flex-1 border-t relative mr-4" />
                      </div>
                    ))}

                    {/* Selected time slot */}
                    {!newEvent.isAllDay && (
                      <div
                        className="absolute left-12 right-4 bg-primary/20 border-l-2 border-primary"
                        style={{
                          top: `${(parseInt(newEvent.startTime.split(':')[0]) * 60 + parseInt(newEvent.startTime.split(':')[1])) / 1440 * 100}%`,
                          height: `${((parseInt(newEvent.endTime.split(':')[0]) * 60 + parseInt(newEvent.endTime.split(':')[1])) - 
                                    (parseInt(newEvent.startTime.split(':')[0]) * 60 + parseInt(newEvent.startTime.split(':')[1]))) / 1440 * 100}%`,
                          minHeight: '40px',
                          zIndex: 10
                        }}
                      >
                        <div className="p-2 text-xs">
                          {newEvent.title || "New Event"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between p-6 border-t bg-white">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setIsNewEventOpen(false)}>
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSaveEvent}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Interactions;