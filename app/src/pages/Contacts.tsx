import { ContactList } from "@/components/contacts/ContactList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import {
  Plus,
  Phone,
  Mail,
  Calendar,
  Edit,
  MapPin,
  Tag,
  MessageCircle,
  User,
  Save,
  X,
  Trash2,
  Globe,
  Bell,
  Users
} from "lucide-react";
import { TagBadge } from "@/components/shared/TagBadge";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { toast } from "sonner";
import { Contact } from "@/types";
import { contactsApi } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { TagIcon } from "lucide-react";
import { PREDEFINED_TAGS, TagType } from "@/constants/tags";
import { interactionsApi } from '@/services/api';
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { ContactCard } from "@/components/contacts/ContactCard";
import { useUser } from '@/contexts/UserContext';

const Contacts = () => {
  const { user: currentUser } = useUser();
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [logInteractionOpen, setLogInteractionOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState<Contact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newCustomField, setNewCustomField] = useState({ label: "", value: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeFilters, setActiveFilters] = useState<TagType[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    startTime: "00:00",
    endTime: "00:30",
    location: "",
    isAllDay: false,
    isOnline: false,
    meetingLink: "",
    attendees: [] as { id: string; name: string; email: string; recommendations?: string[] }[],
    type: "",
    notes: ""
  });
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [suggestedAttendees, setSuggestedAttendees] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [busySlots, setBusySlots] = useState<Array<{ start: string; end: string }>>([]);
  const [reminders, setReminders] = useState<Array<{ date: string; time: string; message: string }>>([]);
  const [attachments, setAttachments] = useState<Array<{ id: string; name: string; file: File }>>([]);
  const [newRecommendation, setNewRecommendation] = useState("");

  const handleLogInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContact?._id) {
      toast.error('Please select a contact first');
      return;
    }

    if (!newEvent.title || !newEvent.type) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const eventData = {
        title: newEvent.title,
        type: newEvent.type,
        date: format(newEvent.date, "yyyy-MM-dd"),
        time: newEvent.isAllDay ? "all-day" : `${newEvent.startTime}-${newEvent.endTime}`,
        notes: newEvent.notes || '',
        contactIds: [selectedContact._id],
        location: newEvent.isOnline ? newEvent.meetingLink : newEvent.location,
        userId: "64f5c1f37e7a4d001c3f9012", // Using a valid MongoDB ObjectId format
        attendees: newEvent.attendees.map(attendee => ({
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          recommendations: (attendee as { recommendations?: string[] }).recommendations || []
        })),
        reminders: reminders.map(reminder => ({
          date: reminder.date,
          time: reminder.time,
          message: reminder.message,
          minutes: 15 // Default reminder time
        }))
      };

      await interactionsApi.create(eventData);
      
      setLogInteractionOpen(false);
      setReminders([]);
      setAttachments([]);
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
        notes: ""
      });
      toast.success("Interaction logged successfully");
    } catch (error) {
      console.error('Error logging interaction:', error);
      toast.error("Failed to log interaction");
    }
  };

  const handleViewProfile = (contact: Contact) => {
    setSelectedContact(contact);
    setEditedContact({ ...contact });
    setViewProfileOpen(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    console.log('Editing contact:', selectedContact);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedContact || !editedContact._id) {
      console.error('Invalid contact data:', { editedContact });
      toast.error("Invalid contact data");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Ensure all required fields are present and properly typed
      const updateData: Partial<Contact> = {
        name: editedContact.name,
        email: editedContact.email || undefined,
        phone: editedContact.phone || undefined,
        category: editedContact.category,
        tags: editedContact.tags || [],
        connectionStrength: Number(editedContact.connectionStrength) || 0,
        notes: editedContact.notes || undefined,
        customFields: editedContact.customFields || undefined,
        photoUrl: editedContact.photoUrl || undefined
      };
      
      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      console.log('Sending update data:', {
        id: editedContact._id,
        data: updateData
      });
      
      const updatedContact = await contactsApi.update(editedContact._id, updateData);
      console.log('Update response:', updatedContact);
      
      setSelectedContact(updatedContact);
      setEditedContact(updatedContact);
      setIsEditing(false);
      toast.success("Contact updated successfully");
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error("Failed to update contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditedContact(selectedContact);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Contact, value: string | number) => {
    if (!editedContact) return;
    
    // Handle special cases for number fields
    if (field === 'connectionStrength') {
      setEditedContact({ ...editedContact, [field]: Number(value) });
    } else {
      setEditedContact({ ...editedContact, [field]: value });
    }
  };

  const handleAddTag = () => {
    if (!editedContact || !newTag.trim()) return;
    const updatedTags = [...(editedContact.tags || []), newTag.trim()];
    setEditedContact({ ...editedContact, tags: updatedTags as string[] });
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editedContact) return;
    const updatedTags = editedContact.tags.filter(tag => tag !== tagToRemove);
    setEditedContact({ ...editedContact, tags: updatedTags });
  };

  const handleAddCustomField = () => {
    if (!editedContact || !newCustomField.label.trim() || !newCustomField.value.trim()) return;
    const updatedFields = {
      ...editedContact.customFields,
      [newCustomField.label.trim()]: newCustomField.value.trim()
    };
    setEditedContact({ ...editedContact, customFields: updatedFields });
    setNewCustomField({ label: "", value: "" });
  };

  const handleRemoveCustomField = (label: string) => {
    if (!editedContact || !editedContact.customFields) return;
    const { [label]: removed, ...remaining } = editedContact.customFields;
    setEditedContact({ ...editedContact, customFields: remaining });
  };

  const handleDeleteContact = async () => {
    if (!selectedContact || !selectedContact._id) {
      toast.error("Invalid contact data");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this contact? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(true);
      await contactsApi.delete(selectedContact._id);
      setViewProfileOpen(false);
      setSelectedContact(null);
      setEditedContact(null);
      toast.success("Contact deleted successfully");
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error("Failed to delete contact. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cleanupContactTags = (contact: Contact): Contact => {
    return {
      ...contact,
      tags: contact.tags.filter((tag): tag is TagType => PREDEFINED_TAGS.includes(tag as TagType))
    };
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await contactsApi.getAll();
        // Filter out the current user's contact
        const filteredContacts = data.filter(contact => contact.email !== currentUser?.email);
        setContacts(filteredContacts);
        
        // Extract unique tags from contacts for filtering
        const allTags = new Set<string>();
        filteredContacts.forEach(contact => {
          contact.tags?.forEach(tag => allTags.add(tag));
        });
        setAvailableTags(Array.from(allTags));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching contacts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [currentUser?.email]);

  const toggleFilter = (tag: TagType) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter(t => t !== tag));
    } else {
      setActiveFilters([...activeFilters, tag]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editedContact) {
          setEditedContact({ ...editedContact, photoUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        file
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const handleAddReminder = () => {
    setReminders([...reminders, { date: '', time: '', message: '' }]);
  };

  const handleRemoveReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  const handleReminderChange = (index: number, field: 'date' | 'time' | 'message', value: string) => {
    const updatedReminders = [...reminders];
    updatedReminders[index] = { ...updatedReminders[index], [field]: value };
    setReminders(updatedReminders);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contacts</h2>
      </div>

      <ContactList
        onViewProfile={handleViewProfile}
        contacts={contacts}
        isLoading={isLoading}
        error={error}
        activeFilters={activeFilters}
        availableTags={PREDEFINED_TAGS as readonly TagType[]}
        onToggleFilter={toggleFilter}
      />

      {/* View Profile Dialog */}
      <Dialog open={viewProfileOpen} onOpenChange={setViewProfileOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogTitle>Contact Profile</DialogTitle>
          <DialogDescription>
            View and edit contact information
          </DialogDescription>
          {selectedContact && (
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-3 sticky top-0 bg-background z-10">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="interactions">Interactions</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-20 w-20">
                      {editedContact?.photoUrl ? (
                        <AvatarImage src={editedContact.photoUrl} alt="Contact avatar" />
                      ) : (
                        <AvatarFallback>
                          {editedContact?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                      >
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <Plus className="mr-2 h-4 w-4" />
                        Change Photo
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <Input
                          value={editedContact?.name || ""}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="text-xl font-bold"
                        />
                      ) : (
                        <h3 className="text-xl font-bold truncate">{selectedContact.name}</h3>
                      )}
                      <div className="flex-1" />
                      {!isEditing && (
                        <Button variant="ghost" size="icon" onClick={handleEdit}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {!isEditing && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={handleDeleteContact}
                          disabled={isDeleting}
                          className="text-destructive hover:text-destructive"
                        >
                          {isDeleting ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="grid gap-2 mt-2">
                        <Input
                          value={editedContact?.email || ""}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Email"
                          type="email"
                        />
                        <Input
                          value={editedContact?.phone || ""}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Phone"
                        />
                        <Select
                          value={editedContact?.category}
                          onValueChange={(value) => handleInputChange('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Work">Work</SelectItem>
                            <SelectItem value="Personal">Personal</SelectItem>
                            <SelectItem value="Community">Community</SelectItem>
                            <SelectItem value="Mentors">Mentors</SelectItem>
                            <SelectItem value="Network">Network</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <>
                        {selectedContact.email && (
                          <div className="flex items-center gap-1 text-muted-foreground truncate">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="text-sm truncate">{selectedContact.email}</span>
                          </div>
                        )}
                        {selectedContact.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground truncate">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span className="text-sm truncate">{selectedContact.phone}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">Category</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {isEditing ? (
                        <Select
                          value={editedContact?.category}
                          onValueChange={(value) => handleInputChange('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Work">Work</SelectItem>
                            <SelectItem value="Personal">Personal</SelectItem>
                            <SelectItem value="Community">Community</SelectItem>
                            <SelectItem value="Mentors">Mentors</SelectItem>
                            <SelectItem value="Network">Network</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <CategoryBadge name={selectedContact.category} color="#D3E4FD" />
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">
                        Connection Strength
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editedContact?.connectionStrength || 0}
                            onChange={(e) => handleInputChange('connectionStrength', e.target.value)}
                            className="w-full"
                          />
                          <p className="text-right text-xs font-medium">
                            {editedContact?.connectionStrength}%
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div 
                              className="h-2 rounded-full bg-green-500" 
                              style={{ width: `${selectedContact.connectionStrength}%` }}
                            ></div>
                          </div>
                          <p className="mt-1 text-right text-xs font-medium">
                            {selectedContact.connectionStrength}%
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Select
                          value={newTag}
                          onValueChange={(value: string) => {
                            if (value && !editedContact?.tags.includes(value)) {
                              setNewTag(value);
                              handleAddTag();
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tag" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTags.map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-1">
                          {editedContact?.tags.map((tag) => (
                            <div key={tag} className="flex items-center gap-1">
                              <TagBadge name={tag} />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {selectedContact.tags.map((tag) => (
                          <TagBadge key={tag} name={tag} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {isEditing ? (
                      <Textarea
                        value={editedContact?.notes || ""}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Add notes about this contact..."
                      />
                    ) : (
                      <p className="text-sm">{selectedContact.notes || "No notes"}</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Custom Fields</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={newCustomField.label}
                            onChange={(e) => setNewCustomField({ ...newCustomField, label: e.target.value })}
                            placeholder="Field name"
                          />
                          <Input
                            value={newCustomField.value}
                            onChange={(e) => setNewCustomField({ ...newCustomField, value: e.target.value })}
                            placeholder="Value"
                          />
                        </div>
                        <Button onClick={handleAddCustomField} size="sm">
                          Add Field
                        </Button>
                        <div className="space-y-2">
                          {Object.entries(editedContact?.customFields || {}).map(([label, value]) => (
                            <div key={label} className="flex items-center gap-2">
                              <div className="flex-1 grid grid-cols-2 gap-2">
                                <span className="text-sm font-medium">{label}</span>
                                <span className="text-sm">{value}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4"
                                onClick={() => handleRemoveCustomField(label)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(selectedContact.customFields || {}).map(([label, value]) => (
                          <div key={label} className="flex justify-between">
                            <span className="text-xs font-medium">{label}</span>
                            <span className="text-xs">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {isEditing && (
                  <div className="flex justify-end gap-2 sticky bottom-0 bg-background pt-4 border-t">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="interactions" className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold">Recent Interactions</h3>
                  <Button
                    size="sm"
                    onClick={() => {
                      setViewProfileOpen(false);
                      setLogInteractionOpen(true);
                    }}
                  >
                    Log Interaction
                  </Button>
                </div>

                <div className="space-y-3">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                            <Phone className="h-4 w-4" />
                          </span>
                          <CardTitle className="text-base">Call</CardTitle>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {selectedContact.lastInteraction || 'No interactions yet'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm">
                        No interaction details available.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="network" className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold">Connections</h3>
                <div className="text-sm text-muted-foreground">
                  No network data available.
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="sticky bottom-0 bg-background border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setLogInteractionOpen(true)}
            >
              Log Interaction
            </Button>
            <Button variant="default" onClick={() => setViewProfileOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Interaction Dialog */}
      <Dialog open={logInteractionOpen} onOpenChange={(open) => {
        if (!selectedContact && open) {
          toast.error("Please select a contact first");
          return;
        }
        setLogInteractionOpen(open);
      }}>
        <DialogContent className="max-w-5xl w-[1200px] p-0 overflow-hidden">
          <div className="flex h-[580px] bg-white">
            {/* Left Section */}
            <div className="w-[700px] border-r">
              <div className="p-6 border-b bg-white sticky top-0 z-10">
                <DialogHeader>
                  <DialogTitle className="text-xl">Log Interaction with {selectedContact?.name}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Record details of your interaction with this contact
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

                {/* Type and Attendees Section */}
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
                                  attendees: [...newEvent.attendees, { ...attendee, recommendations: [] }]
                                });
                                setAttendeeSearch("");
                              }}
                              onMouseDown={(e) => e.preventDefault()}
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
                        <div key={attendee.id} className="space-y-2">
                          <div className="flex items-center gap-1 bg-secondary rounded-full pl-2 pr-1 py-1">
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
                          {/* Recommendations for this attendee */}
                          <div className="pl-7 space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Add recommendation"
                                className="h-8 text-sm"
                                value={newRecommendation}
                                onChange={(e) => setNewRecommendation(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newRecommendation.trim()) {
                                    setNewEvent({
                                      ...newEvent,
                                      attendees: newEvent.attendees.map(a => 
                                        a.id === attendee.id 
                                          ? { ...a, recommendations: [...(a.recommendations || []), newRecommendation.trim()] }
                                          : a
                                      )
                                    });
                                    setNewRecommendation("");
                                  }
                                }}
                              />
                            </div>
                            {attendee.recommendations && attendee.recommendations.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {attendee.recommendations.map((recommendation, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1 bg-secondary rounded-full pl-2 pr-1 py-1"
                                  >
                                    <span className="text-sm">{recommendation}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 w-5 p-0 hover:bg-secondary/80"
                                      onClick={() => {
                                        setNewEvent({
                                          ...newEvent,
                                          attendees: newEvent.attendees.map(a =>
                                            a.id === attendee.id
                                              ? { ...a, recommendations: a.recommendations?.filter((_, i) => i !== index) }
                                              : a
                                          )
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

              <div className="flex-1 overflow-y-auto relative bg-white">
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
              <Button variant="outline" size="sm" onClick={() => setLogInteractionOpen(false)}>
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleLogInteraction}
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

export default Contacts;
