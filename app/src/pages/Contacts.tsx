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
} from "lucide-react";
import { TagBadge } from "@/components/shared/TagBadge";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { toast } from "sonner";
import { Contact } from "@/types";
import { contactsApi } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { TagIcon } from "lucide-react";
import { PREDEFINED_TAGS, TagType } from "@/constants/tags";

const Contacts = () => {
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

  const handleLogInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    setLogInteractionOpen(false);
    toast.success("Interaction logged successfully");
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
        setContacts(data);
        
        // Extract unique tags from contacts for filtering
        const allTags = new Set<string>();
        data.forEach(contact => {
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
  }, []);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contacts</h2>
      </div>

      <ContactList
        onViewProfile={handleViewProfile}
        onLogInteraction={() => setLogInteractionOpen(true)}
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
      <Dialog open={logInteractionOpen} onOpenChange={setLogInteractionOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogTitle>Log Interaction</DialogTitle>
          <DialogDescription>
            Record details of your interaction with this contact
          </DialogDescription>
          <form onSubmit={handleLogInteraction}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="interaction-type">Interaction Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type of interaction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="interaction-date">Date</Label>
                <Input
                  id="interaction-date"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="interaction-notes">Notes</Label>
                <Textarea
                  id="interaction-notes"
                  placeholder="What did you discuss? Any action items?"
                />
              </div>

              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span>Set a reminder to follow up</span>
                </Label>
                <div className="ml-6 grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    defaultValue={new Date(
                      Date.now() + 14 * 24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .slice(0, 10)}
                  />
                  <Input placeholder="Follow up about project status" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Attachments</Label>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm">
                    <Plus className="mr-1 h-3 w-3" />
                    Add File
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Upload files related to this interaction
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLogInteractionOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Interaction</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
