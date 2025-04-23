import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Filter, Plus, Search, SlidersHorizontal, Users } from "lucide-react";
import { ContactBase } from "@/types";
import { ContactDialog } from "@/components/contacts/ContactDialog";
import { contactService } from "@/services/ContactService.ts";

const Contacts = () => {
  const [contacts, setContacts] = useState<ContactBase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("nameAsc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await contactService.getAllContacts();
        setContacts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load contacts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);
  
  const categories = Array.from(new Set(contacts.map(contact => contact.category)));
  const allTags = Array.from(new Set(contacts.flatMap(contact => contact.tags)));
  
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchQuery === "" || 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || contact.category === selectedCategory;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => contact.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesTags;
  });
  
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    switch (sortOption) {
      case "nameAsc":
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case "nameDesc":
        return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
      case "recentlyAdded":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "lastUpdated":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      default:
        return 0;
    }
  });
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const getInitials = (contact: ContactBase) => {
    const first = contact.firstName?.[0] ?? '';
    const last = contact.lastName?.[0] ?? '';
    return `${first}${last}`;
  };

  const handleAddContact = async (data: Omit<ContactBase, 'id'>) => {
    try {
      const newContact = await contactService.createContact(data);
      setContacts(prev => [...prev, newContact]);
    } catch (err) {
      console.error('Failed to create contact:', err);
      setError('Failed to create contact');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-red-500 mb-2">{error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-network-purple to-network-blue bg-clip-text text-transparent">Contacts</h1>
          <p className="text-muted-foreground">Manage your personal and professional network.</p>
        </div>
        <ContactDialog 
          trigger={
            <Button className="bg-gradient-to-r from-network-purple to-network-blue hover:from-network-purple-dark hover:to-network-blue-dark text-white transition-all duration-300 shadow-md hover:shadow-lg">
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          }
          onSave={handleAddContact}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select 
            onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-shrink-0">
                <Filter className="mr-2 h-4 w-4" /> Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by tags</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allTags.map(tag => (
                <DropdownMenuItem 
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="flex items-center justify-between"
                >
                  {tag}
                  {selectedTags.includes(tag) && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
              {selectedTags.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedTags([])}>
                    Clear filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-shrink-0">
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Sort
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setSortOption("nameAsc")}
                className="flex items-center justify-between"
              >
                Name (A-Z)
                {sortOption === "nameAsc" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption("nameDesc")}
                className="flex items-center justify-between"
              >
                Name (Z-A)
                {sortOption === "nameDesc" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption("recentlyAdded")}
                className="flex items-center justify-between"
              >
                Recently Added
                {sortOption === "recentlyAdded" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption("lastUpdated")}
                className="flex items-center justify-between"
              >
                Last Updated
                {sortOption === "lastUpdated" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {selectedTags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {selectedTags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="flex items-center gap-1 animate-fade-in"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              <span className="ml-1 cursor-pointer">×</span>
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6" 
            onClick={() => setSelectedTags([])}
          >
            Clear all
          </Button>
        </div>
      )}
      
      {sortedContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="rounded-full bg-muted p-3">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No contacts found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            We couldn't find any contacts matching your search criteria. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedContacts.map(contact => (
            <Link to={`/contacts/${contact._id}`} key={contact._id}>
              <Card className="contact-card">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4 p-4">
                    <Avatar className="h-12 w-12 bg-gradient-to-br from-network-purple to-network-blue">
                      {contact.image ? (
                        <img src={contact.image} alt={`${contact.firstName} ${contact.lastName}`} />
                      ) : (
                        <div className="font-semibold text-white">
                          {getInitials(contact)}
                        </div>
                      )}
                    </Avatar>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <h3 className="font-medium leading-none truncate">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      {contact.jobTitle && (
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.jobTitle}{contact.company ? ` at ${contact.company}` : ''}
                        </p>
                      )}
                      {contact.email && (
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="contact-category">
                        {contact.category}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="contact-tag">
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length > 3 && (
                        <span className="contact-tag">
                          +{contact.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;
