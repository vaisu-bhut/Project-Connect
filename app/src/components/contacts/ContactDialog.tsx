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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Camera, Plus, X } from "lucide-react";
import { toast } from "sonner";
import type { ContactDetail } from "@/types";

// Define the Zod schema for the form
const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  jobTitle: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  notes: z.string().optional().or(z.literal("")),
  image: z.string().optional(),
  socialProfiles: z
    .array(
      z.object({
        type: z.string().min(1, "Social profile type is required"),
        url: z.string().min(1, "Social profile URL is required"),
      })
    )
    .optional(),
  customFields: z
    .array(
      z.object({
        key: z.string().min(1, "Custom field key is required"),
        value: z.string().min(1, "Custom field value is required"),
      })
    )
    .optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactDialogProps {
  trigger: React.ReactNode;
  onSave?: (data: ContactFormValues) => void;
  contact?: ContactDetail;
}

export function ContactDialog({ trigger, onSave, contact }: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(contact?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(
    contact?.image || null
  );
  // State for new social profile input
  const [newSocialProfile, setNewSocialProfile] = useState({ type: "", url: "" });
  // State for new custom field input
  const [newCustomField, setNewCustomField] = useState({ key: "", value: "" });

  // Initialize the form with default values
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: contact?.firstName || "",
      lastName: contact?.lastName || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
      company: contact?.company || "",
      jobTitle: contact?.jobTitle || "",
      address: contact?.address || "",
      category: contact?.category || "",
      notes: contact?.notes || "",
      image: contact?.image || "",
      socialProfiles: contact?.socialProfiles || [],
      customFields: contact?.customFields || [],
    },
  });

  // Sync form with contact prop changes
  useEffect(() => {
    if (contact) {
      const initialValues = {
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        jobTitle: contact.jobTitle || "",
        address: contact.address || "",
        category: contact.category || "",
        notes: contact.notes || "",
        image: contact.image || "",
        socialProfiles: contact.socialProfiles || [],
        customFields: contact.customFields || [],
      };

      form.reset(initialValues);
      setTags(contact.tags || []);
      setImagePreview(contact.image || null);
      setNewSocialProfile({ type: "", url: "" });
      setNewCustomField({ key: "", value: "" });
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        jobTitle: "",
        address: "",
        category: "",
        notes: "",
        image: "",
        socialProfiles: [],
        customFields: [],
      });
      setTags([]);
      setImagePreview(null);
      setNewSocialProfile({ type: "", url: "" });
      setNewCustomField({ key: "", value: "" });
    }
  }, [contact, form]);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        form.setValue("image", base64String, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tags
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Handle social profiles
  const handleAddSocialProfile = () => {
    if (newSocialProfile.type.trim() && newSocialProfile.url.trim()) {
      // Check for duplicates
      const isDuplicate = (form.getValues().socialProfiles || []).some(
        (profile) =>
          profile.type.toLowerCase() === newSocialProfile.type.trim().toLowerCase() &&
          profile.url.toLowerCase() === newSocialProfile.url.trim().toLowerCase()
      );
      if (isDuplicate) {
        toast.error("This social profile already exists.");
        return;
      }

      const updatedProfiles = [
        ...(form.getValues().socialProfiles || []),
        {
          type: newSocialProfile.type.trim(),
          url: newSocialProfile.url.trim(),
        },
      ];
      form.setValue("socialProfiles", updatedProfiles, { shouldValidate: true });
      // Reset newSocialProfile to clear input fields
      setNewSocialProfile({ type: "", url: "" });
      toast.success("Social profile added!");
    } else {
      toast.error("Please fill in both Type and URL.");
    }
  };

  const handleRemoveSocialProfile = (index: number) => {
    const updatedProfiles = (form.getValues().socialProfiles || []).filter(
      (_, i) => i !== index
    );
    form.setValue("socialProfiles", updatedProfiles, { shouldValidate: true });
  };

  // Handle custom fields
  const handleAddCustomField = () => {
    if (newCustomField.key.trim() && newCustomField.value.trim()) {
      // Check for duplicates
      const isDuplicate = (form.getValues().customFields || []).some(
        (field) =>
          field.key.toLowerCase() === newCustomField.key.trim().toLowerCase()
      );
      if (isDuplicate) {
        toast.error("This custom field key already exists.");
        return;
      }

      const updatedFields = [
        ...(form.getValues().customFields || []),
        {
          key: newCustomField.key.trim(),
          value: newCustomField.value.trim(),
        },
      ];
      form.setValue("customFields", updatedFields, { shouldValidate: true });
      // Reset newCustomField to clear input fields
      setNewCustomField({ key: "", value: "" });
      toast.success("Custom field added!");
    } else {
      toast.error("Please fill in both Field Name and Value.");
    }
  };

  const handleRemoveCustomField = (index: number) => {
    const updatedFields = (form.getValues().customFields || []).filter(
      (_, i) => i !== index
    );
    form.setValue("customFields", updatedFields, { shouldValidate: true });
  };

  // Handle form submission
  const onSubmit = async (data: ContactFormValues) => {
    try {
      const contactData = {
        ...data,
        tags: tags || [],
        socialProfiles: data.socialProfiles || [],
        customFields: data.customFields || [],
        image: data.image || undefined,
        ...(contact?._id && { _id: contact._id }),
        ...(contact?.createdAt && { createdAt: contact.createdAt }),
        updatedAt: new Date().toISOString(),
      };

      if (onSave) {
        await onSave(contactData);
        toast.success(
          contact ? "Contact updated successfully!" : "Contact added successfully!"
        );
        setOpen(false);
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          jobTitle: "",
          address: "",
          category: "",
          notes: "",
          image: "",
          socialProfiles: [],
          customFields: [],
        });
        setTags([]);
        setImagePreview(null);
        setNewSocialProfile({ type: "", url: "" });
        setNewCustomField({ key: "", value: "" });
      }
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Failed to save contact. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {contact ? "Edit Contact" : "Add New Contact"}
          </DialogTitle>
          <DialogDescription>
            {contact
              ? "Update contact details below."
              : "Add a new person to your network. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-2 bg-gradient-to-r from-network-purple to-network-blue">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="font-semibold text-2xl text-white">
                    {form.watch("firstName")?.[0] || ""}
                    {form.watch("lastName")?.[0] || ""}
                  </div>
                )}
              </Avatar>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" type="button" asChild>
                  <label className="cursor-pointer">
                    <Camera className="mr-2 h-4 w-4" /> Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </Button>
                {imagePreview && (
                  <Button
                    size="sm"
                    variant="destructive"
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      form.setValue("image", "");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Work Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Family">Family</SelectItem>
                      <SelectItem value="Colleague">Colleague</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Client">Client</SelectItem>
                      <SelectItem value="Mentor">Mentor</SelectItem>
                      <SelectItem value="Mentee">Mentee</SelectItem>
                      <SelectItem value="Acquaintance">Acquaintance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <div className="space-y-2">
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full"
                  >
                    <span className="text-sm">{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Social Profiles Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Social Profiles</h3>
              <div className="space-y-2">
                {form.getValues().socialProfiles?.map((profile, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={profile.type} disabled />
                    <Input value={profile.url} disabled />
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => handleRemoveSocialProfile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type (e.g., LinkedIn)"
                    value={newSocialProfile.type}
                    onChange={(e) =>
                      setNewSocialProfile({
                        ...newSocialProfile,
                        type: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="URL"
                    value={newSocialProfile.url}
                    onChange={(e) =>
                      setNewSocialProfile({
                        ...newSocialProfile,
                        url: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={handleAddSocialProfile}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Custom Fields Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Custom Fields</h3>
              <div className="space-y-2">
                {form.getValues().customFields?.map((field, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={field.key} disabled />
                    <Input value={field.value} disabled />
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => handleRemoveCustomField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Field Name"
                    value={newCustomField.key}
                    onChange={(e) =>
                      setNewCustomField({
                        ...newCustomField,
                        key: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Value"
                    value={newCustomField.value}
                    onChange={(e) =>
                      setNewCustomField({
                        ...newCustomField,
                        value: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={handleAddCustomField}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
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
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                className="bg-gradient-to-r from-network-purple to-network-blue hover:from-network-purple-dark hover:to-network-blue-dark text-white"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {contact ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  contact ? "Update Contact" : "Add Contact"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}