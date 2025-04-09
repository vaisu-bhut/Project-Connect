import { useState } from "react";
import { 
  Plus, 
  Calendar, 
  User, 
  Clock, 
  MessageSquare, 
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockInteractions, mockContacts } from "@/data/mockData";
import { Link } from "react-router-dom";

const Interactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Simple filter for interactions based on search query
  const filteredInteractions = mockInteractions.filter(interaction => {
    const contact = mockContacts.find(c => c.id === interaction.contactId);
    if (!contact) return false;
    
    return contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           interaction.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
           interaction.type.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Interactions</h2>
        <Button asChild>
          <Link to="/interactions/new">
            <Plus className="mr-2 h-4 w-4" />
            Log Interaction
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search interactions..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
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
            filteredInteractions.map((interaction) => {
              const contact = mockContacts.find(c => c.id === interaction.contactId);
              if (!contact) return null;
              
              const interactionDate = new Date(interaction.date);
              
              return (
                <Card key={interaction.id}>
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
                              to={`/contacts/${contact.id}`}
                              className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                              {contact.name}
                            </Link>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {interactionDate.toLocaleDateString()}
                            <Clock className="ml-2 mr-1 h-3 w-3" />
                            {interactionDate.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                        <p className="mt-1 text-sm">{interaction.notes}</p>
                        {interaction.reminder && (
                          <div className="mt-2 flex items-center rounded-md bg-secondary p-2 text-xs">
                            <Calendar className="mr-1 h-3 w-3" />
                            Reminder: {interaction.reminder.message} ({new Date(interaction.reminder.date).toLocaleDateString()})
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
        <TabsContent value="calls" className="mt-4">
          {/* Call interactions */}
        </TabsContent>
        <TabsContent value="meetings" className="mt-4">
          {/* Meeting interactions */}
        </TabsContent>
        <TabsContent value="emails" className="mt-4">
          {/* Email interactions */}
        </TabsContent>
        <TabsContent value="other" className="mt-4">
          {/* Other interactions */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Interactions;
