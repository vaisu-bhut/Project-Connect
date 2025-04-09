import { useState, useEffect } from "react";
import { 
  Plus, 
  Calendar, 
  User, 
  Clock, 
  MessageSquare, 
  Search,
  Loader2,
  Paperclip
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

const Interactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [contacts, setContacts] = useState<{ [key: string]: Contact }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch all contacts first
        const contactsData = await contactsApi.getAll();
        const contactsMap = contactsData.reduce((acc, contact) => {
          acc[contact._id] = contact;
          return acc;
        }, {} as { [key: string]: Contact });
        setContacts(contactsMap);

        // Fetch interactions for each contact
        const allInteractions: Interaction[] = [];
        for (const contact of contactsData) {
          const contactInteractions = await interactionsApi.getByContact(contact._id);
          allInteractions.push(...contactInteractions);
        }
        
        // Sort interactions by date
        allInteractions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setInteractions(allInteractions);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Failed to load interactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="calls">Calls</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
              <TabsTrigger value="emails">Emails</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            <div className="relative flex-1 md:max-w-sm ml-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search interactions..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
    </div>
  );
};

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
                <Calendar className="mr-1 h-3 w-3" />
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
                      <Calendar className="mr-1 h-3 w-3" />
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

export default Interactions;
