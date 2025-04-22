import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Edit, 
  Trash2, 
  MessageSquare,
  ExternalLink,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactDialog } from "@/components/contacts/ContactDialog";
import { InteractionDialog } from "@/components/interactions/InteractionDialog";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { ContactBase, InteractionBase } from "@/types";
import type { ContactDetail } from "@/types";
import { contactService } from "@/services/ContactService";
import { interactionService } from "../services/InteractionService";
import { dummyInteractions } from "@/data/dummyInteractions";

const ContactDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [customFields, setCustomFields] = useState<{ key: string; value: string; }[]>([]);
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [interactions, setInteractions] = useState<InteractionBase[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Only fetch contact data from API
          const contactData = await contactService.getContact(id);
          // console.log('Contact data:', contactData);
          setContact(contactData);
          if (contactData.customFields) {
            setCustomFields(contactData.customFields);
          }
          // Use dummy data for interactions
          setInteractions(dummyInteractions);
        }
      } catch (error) {
        console.error('Failed to fetch contact data:', error);
        toast.error('Failed to load contact data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <h2 className="text-2xl font-bold mb-4">Contact Not Found</h2>
        <p className="text-muted-foreground mb-6">The contact you are looking for does not exist.</p>
        <Button onClick={() => navigate("/contacts")} className="bg-gradient-to-r from-network-purple to-network-blue hover:from-network-purple-dark hover:to-network-blue-dark text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Contacts
        </Button>
      </div>
    );
  }

  const contactInteractions = interactions.filter(interaction => 
    interaction.contacts.some(c => c._id === id)
  );
  
  const handleEditContact = async (data: Partial<ContactDetail>) => {
    try {
      if (id) {
        const updatedContact = await contactService.updateContact(id, {
          ...data,
          tags: data.tags || [],
          image: data.image || contact?.image || "",
          socialProfiles: data.socialProfiles || contact?.socialProfiles || [],
          customFields: data.customFields || contact?.customFields || []
        });
        setContact(updatedContact);
        if (updatedContact.customFields) {
          setCustomFields(updatedContact.customFields);
        }
        toast.success("Contact updated successfully!");
      }
    } catch (error) {
      console.error('Failed to update contact:', error);
      toast.error('Failed to update contact');
    }
  };
  
  const handleLogInteraction = (data: { 
    title?: string; 
    type?: string; 
    date?: Date; 
    notes?: string; 
    time?: string; 
    location?: string; 
    contacts: ContactBase[] 
  }) => {
    console.log("New interaction:", data);
    toast.success("Interaction logged successfully!");
  };
  
  const handleDeleteContact = () => {
    toast.success("Contact deleted successfully!");
    navigate("/contacts");
  };
  
  const handleAddCustomField = () => {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
      <form id="customFieldForm" class="space-y-4">
        <h3 class="text-lg font-semibold">Add Custom Field</h3>
        <div>
          <label>Field Name</label>
          <input type="text" name="key" placeholder="Field name" required class="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Field Value</label>
          <input type="text" name="value" placeholder="Field value" required class="w-full border p-2 rounded" />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border rounded" onclick="this.closest('dialog').close()">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-gradient-to-r from-network-purple to-network-blue text-white rounded">Save</button>
        </div>
      </form>
    `;
    
    document.body.appendChild(dialog);
    
    const form = dialog.querySelector('form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const newField = {
        key: formData.get('key') as string,
        value: formData.get('value') as string
      };
      
      try {
        if (id) {
          const updatedContact = await contactService.updateContact(id, {
            customFields: [...customFields, newField]
          });
          setCustomFields(updatedContact.customFields || []);
          setContact(updatedContact);
          dialog.close();
          toast.success("Custom field added successfully!");
        }
      } catch (error) {
        console.error('Failed to add custom field:', error);
        toast.error('Failed to add custom field');
      }
    });
    
    dialog.addEventListener('close', () => {
      document.body.removeChild(dialog);
    });
    
    dialog.showModal();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 sm:pb-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/contacts")} className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-network-purple to-network-blue bg-clip-text text-transparent">Contact Details</h1>
        </div>
        
        {isMobile && (
          <div className="flex gap-2">
            <ContactDialog
              trigger={
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              }
              contact={contact}
              onSave={handleEditContact}
            />
            <Button 
              size="sm" 
              variant="destructive" 
              className="h-8 w-8 p-0"
              onClick={handleDeleteContact}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 animate-scale-in glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 bg-gradient-to-br from-network-purple to-network-blue">
                {contact?.image ? (
                  <img src={contact.image} alt={`${contact.firstName} ${contact.lastName}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="font-semibold text-2xl text-white">
                    {contact?.firstName[0]}{contact?.lastName[0]}
                  </div>
                )}
              </Avatar>
              
              <h2 className="mt-4 text-2xl font-bold">
                {contact.firstName} {contact.lastName}
              </h2>
              
              {contact.jobTitle && (
                <p className="text-muted-foreground">
                  {contact.jobTitle}{contact.company ? ` at ${contact.company}` : ''}
                </p>
              )}
              
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="contact-category">
                  {contact.category}
                </Badge>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1 justify-center">
                {contact.tags.map(tag => (
                  <span key={tag} className="contact-tag">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-6 w-full space-y-3">
                {contact.email && (
                  <div className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-sm text-foreground hover:underline truncate"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                
                {contact.phone && (
                  <div className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-sm text-foreground hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                
                {contact.address && (
                  <div className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{contact.address}</span>
                  </div>
                )}
                
                {contact.company && (
                  <div className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{contact.company}</span>
                  </div>
                )}
              </div>
              
              <Separator className="my-6 sm:block hidden" />
              
              <div className="flex gap-2 w-full sm:block">
                <ContactDialog
                  trigger={
                    <Button variant="outline" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  }
                  contact={contact}
                  onSave={handleEditContact}
                />
                <Button variant="destructive" className="flex-1" onClick={handleDeleteContact}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
              
              <div className="sm:block hidden">
                <InteractionDialog
                  trigger={
                    <Button className="w-full mt-3 bg-gradient-to-r from-network-purple to-network-blue hover:from-network-purple-dark hover:to-network-blue-dark text-white">
                      <MessageSquare className="mr-2 h-4 w-4" /> Log Interaction
                    </Button>
                  }
                  defaultContacts={[contact]}
                  onSave={handleLogInteraction}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 animate-scale-in glass-card">
          <CardContent className="p-6">
            <Tabs defaultValue="details">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="interactions">Interactions</TabsTrigger>
                <TabsTrigger value="customFields">Custom Fields</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                    </div>
                    
                    {contact.email && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{contact.email}</p>
                      </div>
                    )}
                    
                    {contact.phone && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{contact.phone}</p>
                      </div>
                    )}
                    
                    {contact.address && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{contact.address}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Work Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contact.company && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">{contact.company}</p>
                      </div>
                    )}
                    
                    {contact.jobTitle && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Job Title</p>
                        <p className="font-medium">{contact.jobTitle}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                {contact.socialProfiles && contact.socialProfiles.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Social Profiles</h3>
                      <div className="space-y-2">
                        {contact.socialProfiles.map((profile, index) => (
                          <div key={index} className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
                            <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                            <a 
                              href={profile.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm hover:underline"
                            >
                              {profile.type}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {contact.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Notes</h3>
                      <p className="text-muted-foreground">{contact.notes}</p>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="interactions">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Recent Interactions</h3>
                    <InteractionDialog
                      trigger={
                        <Button size="sm" className="bg-gradient-to-r from-network-purple to-network-blue hover:from-network-purple-dark hover:to-network-blue-dark text-white sm:block hidden">
                          <MessageSquare className="mr-2 h-4 w-4" /> Log New
                        </Button>
                      }
                      defaultContacts={[contact]}
                      onSave={handleLogInteraction}
                    />
                  </div>
                  
                  {contactInteractions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold">No interactions yet</h3>
                      <p className="text-muted-foreground mt-1">
                        Log your first interaction with this contact.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contactInteractions.map(interaction => (
                        <Link to={`/interactions/${interaction._id}`} key={interaction._id}>
                          <div className="interaction-item">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{interaction.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(interaction.date).toLocaleDateString()} • {interaction.type}
                                </p>
                              </div>
                              <Badge variant="outline">{interaction.type}</Badge>
                            </div>
                            
                            {interaction.notes && (
                              <p className="text-sm mt-2 line-clamp-2">{interaction.notes}</p>
                            )}
                            
                            {interaction.contacts.length > 1 && (
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">With:</span>
                                <div className="flex flex-wrap gap-1">
                                  {interaction.contacts
                                    .filter(c => c._id !== id)
                                    .map(c => (
                                      <Badge key={c._id} variant="secondary" className="text-xs">
                                        {c.firstName} {c.lastName}
                                      </Badge>
                                    ))
                                  }
                                </div>
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="customFields" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Custom Fields</h3>
                  <Button 
                    variant="outline"
                    onClick={handleAddCustomField}
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Field
                  </Button>
                </div>
                
                {contact.customFields && contact.customFields.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contact.customFields.map((field, index) => (
                      <div key={index} className="space-y-2">
                        <p className="text-sm text-muted-foreground">{field.key}</p>
                        <p className="font-medium">{field.value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Plus className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No custom fields yet</h3>
                    <p className="text-muted-foreground mt-1">
                      Add custom fields to store additional information.
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
            defaultContacts={[contact]}
            onSave={handleLogInteraction}
          />
        </div>
      )}
    </div>
  );
};

export default ContactDetail;
