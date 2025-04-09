import { useState, useEffect, useMemo } from "react";
import { contactsApi } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TagBadge } from "@/components/shared/TagBadge";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Tag as TagIcon,
  Users,
  Grid2x2,
  List as ListIcon,
  MessageCircle,
  User,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContactCard } from "./ContactCard";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Contact, TagType } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PREDEFINED_TAGS } from "@/constants/tags";

interface ContactListProps {
  onViewProfile?: (contact: Contact) => void;
  onLogInteraction?: () => void;
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  activeFilters: TagType[];
  availableTags: readonly TagType[];
  onToggleFilter: (tag: TagType) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  onViewProfile,
  onLogInteraction,
  contacts,
  isLoading,
  error,
  activeFilters,
  availableTags,
  onToggleFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [connectionFilter, setConnectionFilter] = useState([0]);
  const [sortBy, setSortBy] = useState("name");

  // Add new state for contacts and loading
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newContactTags, setNewContactTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<Array<{ label: string; value: string }>>([]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = activeFilters.length === 0 || 
        contact.tags?.some(tag => activeFilters.includes(tag as TagType));
      
      const matchesCategory = categoryFilters.length === 0 || 
        categoryFilters.includes(contact.category);
      
      const matchesConnection = connectionFilter[0] === 0 || 
        (contact.connectionStrength >= connectionFilter[0]);
      
      return matchesSearch && matchesTags && matchesCategory && matchesConnection;
    }).sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "recent":
          return (b.lastInteraction || "").localeCompare(a.lastInteraction || "");
        case "strength":
          return b.connectionStrength - a.connectionStrength;
        default:
          return 0;
      }
    });
  }, [contacts, searchQuery, activeFilters, categoryFilters, connectionFilter, sortBy]);

  const toggleFilter = (filter: TagType) => {
    if (activeFilters.includes(filter)) {
      onToggleFilter(filter);
    } else {
      onToggleFilter(filter);
    }
  };

  const toggleCategoryFilter = (category: string) => {
    setCategoryFilters(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    // Clear all active filters by toggling each one off
    activeFilters.forEach(filter => onToggleFilter(filter));
    setCategoryFilters([]);
    setConnectionFilter([0]);
    setSortBy("name");
  };

  const getTotalActiveFilters = () => {
    return (
      activeFilters.length +
      categoryFilters.length +
      (connectionFilter[0] > 0 ? 1 : 0) +
      (sortBy !== "name" ? 1 : 0)
    );
  };

  // Add new function to handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!newContactTags.includes(tagInput.trim())) {
        setNewContactTags([...newContactTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewContactTags(newContactTags.filter(tag => tag !== tagToRemove));
  };

  // Add new function to handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new function to handle custom field addition
  const handleAddCustomField = () => {
    if (newFieldLabel.trim() && newFieldValue.trim()) {
      setCustomFields([...customFields, { label: newFieldLabel, value: newFieldValue }]);
      setNewFieldLabel("");
      setNewFieldValue("");
    }
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get form data
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;
      const category = formData.get('category') as string;
      const notes = formData.get('notes') as string;

      // Format custom fields
      const formattedCustomFields = customFields.reduce((acc, field) => {
        acc[field.label] = field.value;
        return acc;
      }, {} as Record<string, string>);

      // Create contact object
      const newContact: Omit<Contact, "_id"> = {
        name,
        email,
        phone,
        photoUrl: avatarImage || undefined,
        category: selectedCategory,
        tags: newContactTags as TagType[],
        connectionStrength: 50,
        notes,
        customFields: formattedCustomFields,
        lastInteraction: "No interaction logs"
      };

      // Send to server
      console.log(newContact);  
      await contactsApi.create(newContact);
      
      // Reset form
      setAddContactOpen(false);
      setNewContactTags([]);
      setTagInput("");
      setAvatarImage(null);
      setCustomFields([]);
      setSelectedCategory("");
      
      toast.success("Contact added successfully");
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error("Failed to add contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading contacts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFilterOpen(true)}
          >
            <div className="relative">
              <SlidersHorizontal className="h-4 w-4" />
              {getTotalActiveFilters() > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {getTotalActiveFilters()}
                </span>
              )}
            </div>
          </Button>
          <div className="flex gap-1 rounded-md border">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-none rounded-l-md"
            >
              <Grid2x2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-none rounded-r-md"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={() => setAddContactOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
        <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Enter contact details below. Required fields are marked with an asterisk.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddContact} onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
              e.preventDefault();
            }
          }}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24">
                    {avatarImage ? (
                      <AvatarImage src={avatarImage} alt="Contact avatar" />
                    ) : (
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="relative"
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
                    Upload Photo
                  </Button>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="johndoe@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" placeholder="(123) 456-7890" />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
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
              
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input 
                  id="tags" 
                  name="tags"
                  placeholder="Type a tag and press Enter..." 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                />
                <div className="mt-1 flex flex-wrap gap-1">
                  {newContactTags.map((tag) => (
                    <TagBadge 
                      key={tag} 
                      name={tag} 
                      onRemove={() => removeTag(tag)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Add any notes about this contact..." />
              </div>

              {/* Custom Fields Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Custom Fields</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCustomField}
                    disabled={!newFieldLabel.trim() || !newFieldValue.trim()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </div>
                
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Field Label (e.g., Birthday)"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                    />
                    <Input
                      placeholder="Value"
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {customFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-2 rounded-lg border p-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{field.label}</p>
                        <p className="text-sm text-muted-foreground">{field.value}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCustomField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddContactOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Contact"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={activeFilters.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onToggleFilter(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed">
            <Users className="mb-2 h-10 w-10 text-muted-foreground animate-pulse" />
            <h3 className="text-lg font-medium">Loading contacts...</h3>
          </div>
        ) : error ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed">
            <Users className="mb-2 h-10 w-10 text-destructive" />
            <h3 className="text-lg font-medium text-destructive">
              Error loading contacts
            </h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed">
            <Users className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium">No contacts found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact._id}
                contact={contact}
                className={viewMode === "list" ? "flex" : ""}
                onViewProfile={() => onViewProfile?.(contact)}
                onLogInteraction={onLogInteraction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Contacts</SheetTitle>
            <SheetDescription>
              Narrow down your contact list using multiple criteria.
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-medium">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Work", "Personal", "Community", "Mentors", "Network", "Other"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={categoryFilters.includes(category)}
                      onCheckedChange={() => toggleCategoryFilter(category)}
                    />
                    <Label htmlFor={`cat-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium">Connection Strength</h3>
              <div className="px-2">
                <Slider
                  value={connectionFilter}
                  onValueChange={setConnectionFilter}
                  max={100}
                  step={10}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Any</span>
                  <span className="text-xs font-medium">
                    Min: {connectionFilter[0]}%
                  </span>
                  <span className="text-xs text-muted-foreground">Strong</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium">Sort By</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="recent">Recent Interaction</SelectItem>
                  <SelectItem value="strength">Connection Strength</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
