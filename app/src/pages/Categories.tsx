
import { useState } from "react";
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Edit, 
  Trash, 
  PlusCircle, 
  FolderPlus,
  Save,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { mockCategories, mockContacts, mockTags } from "@/data/mockData";
import { Category, Tag } from "@/types";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TagBadge } from "@/components/shared/TagBadge";

const Categories = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState(mockCategories);
  const [tags, setTags] = useState(mockTags);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [isNewTagOpen, setIsNewTagOpen] = useState(false);
  const [isNewFieldOpen, setIsNewFieldOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#D3E4FD");
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#9b87f5");
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "date" | "number" | "url">("text");
  const [customFields, setCustomFields] = useState([
    "Birthday", "Company", "Job Title", "Anniversary", "Spouse Name", "Hobby", "LinkedIn URL", "Twitter Handle"
  ]);

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const getContactCountForCategory = (categoryId: string) => {
    return mockContacts.filter(contact => contact.category === categoryId).length;
  };

  const getContactCountForParentCategory = (category: Category) => {
    let count = mockContacts.filter(contact => contact.category === category.id).length;
    
    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        count += mockContacts.filter(contact => contact.category === subcategory.id).length;
      }
    }
    
    return count;
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    const newCategory: Category = {
      id: `cat${categories.length + 1}`,
      name: newCategoryName,
      color: newCategoryColor,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setIsNewCategoryOpen(false);
    toast.success(`Category "${newCategoryName}" added successfully`);
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast.error("Tag name cannot be empty");
      return;
    }

    const newTag: Tag = {
      id: `tag${tags.length + 1}`,
      name: newTagName,
      color: newTagColor,
    };

    setTags([...tags, newTag]);
    setNewTagName("");
    setIsNewTagOpen(false);
    toast.success(`Tag "${newTagName}" added successfully`);
  };

  const handleAddCustomField = () => {
    if (!newFieldName.trim()) {
      toast.error("Field name cannot be empty");
      return;
    }

    setCustomFields([...customFields, newFieldName]);
    setNewFieldName("");
    setIsNewFieldOpen(false);
    toast.success(`Custom field "${newFieldName}" added successfully`);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(category => category.id !== categoryId));
    toast.success("Category deleted successfully");
  };

  const handleDeleteTag = (tagIndex: number) => {
    const newTags = [...tags];
    newTags.splice(tagIndex, 1);
    setTags(newTags);
    toast.success("Tag deleted successfully");
  };

  const handleDeleteField = (fieldIndex: number) => {
    const newFields = [...customFields];
    newFields.splice(fieldIndex, 1);
    setCustomFields(newFields);
    toast.success("Custom field deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Categories & Tags</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsNewCategoryOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Category
          </Button>
          <Button onClick={() => setIsNewTagOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Organize your contacts into hierarchical categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="rounded-md border">
                  <div 
                    className="flex cursor-pointer items-center justify-between p-3"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center gap-2">
                      {category.subcategories && category.subcategories.length > 0 ? (
                        expandedCategories.includes(category.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )
                      ) : (
                        <div className="w-4" />
                      )}
                      <CategoryBadge name={category.name} color={category.color} />
                      <span className="text-xs text-muted-foreground">
                        ({getContactCountForParentCategory(category)} contacts)
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <PlusCircle className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {category.subcategories && expandedCategories.includes(category.id) && (
                    <div className="border-t pl-8">
                      {category.subcategories.map(subcategory => (
                        <div 
                          key={subcategory.id}
                          className="flex items-center justify-between p-2"
                        >
                          <div className="flex items-center gap-2">
                            <CategoryBadge name={subcategory.name} color={subcategory.color} />
                            <span className="text-xs text-muted-foreground">
                              ({getContactCountForCategory(subcategory.id)} contacts)
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(subcategory.id);
                              }}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Apply multiple tags to contacts for flexible grouping
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-primary-foreground"
                >
                  <TagBadge name={tag.name} color={tag.color} />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0"
                    onClick={() => {}}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0"
                    onClick={() => handleDeleteTag(index)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Custom Fields</CardTitle>
          <CardDescription>
            Create custom fields to store additional information about your contacts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="rounded-md border">
              <div className="grid grid-cols-3 gap-4 p-4">
                <div>
                  <h4 className="font-medium">Field Name</h4>
                </div>
                <div>
                  <h4 className="font-medium">Type</h4>
                </div>
                <div>
                  <h4 className="font-medium">Actions</h4>
                </div>
              </div>
              <div className="border-t">
                {customFields.map((field, index) => (
                  <div 
                    key={index}
                    className="grid grid-cols-3 gap-4 border-b p-4 last:border-0"
                  >
                    <div>{field}</div>
                    <div>
                      {index === 0 || index === 3 ? "Date" : 
                       index === 6 || index === 7 ? "URL" : "Text"}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteField(index)}
                      >
                        <Trash className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button className="mt-4" onClick={() => setIsNewFieldOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Field
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* New Category Dialog */}
      <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input 
                id="category-name" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                placeholder="Work, Personal, etc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-color">Color</Label>
              <div className="flex gap-2 items-center">
                <Input 
                  id="category-color" 
                  type="color" 
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-12 h-9 p-1"
                />
                <div 
                  className="w-10 h-10 rounded-full" 
                  style={{ backgroundColor: newCategoryColor }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCategoryOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Tag Dialog */}
      <Dialog open={isNewTagOpen} onOpenChange={setIsNewTagOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tag</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tag-name">Tag Name</Label>
              <Input 
                id="tag-name" 
                value={newTagName} 
                onChange={(e) => setNewTagName(e.target.value)} 
                placeholder="Tech, Creative, etc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tag-color">Color</Label>
              <div className="flex gap-2 items-center">
                <Input 
                  id="tag-color" 
                  type="color" 
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-12 h-9 p-1"
                />
                <div 
                  className="w-10 h-10 rounded-full" 
                  style={{ backgroundColor: newTagColor }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTagOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTag}>Add Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Custom Field Dialog */}
      <Dialog open={isNewFieldOpen} onOpenChange={setIsNewFieldOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Field</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="field-name">Field Name</Label>
              <Input 
                id="field-name" 
                value={newFieldName} 
                onChange={(e) => setNewFieldName(e.target.value)} 
                placeholder="Education, Languages, etc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="field-type">Field Type</Label>
              <select 
                id="field-type" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as any)}
              >
                <option value="text">Text</option>
                <option value="date">Date</option>
                <option value="number">Number</option>
                <option value="url">URL</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFieldOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomField}>Add Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
