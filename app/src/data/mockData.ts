import { 
  Category, 
  Contact, 
  CustomField, 
  Interaction, 
  NetworkInsight, 
  NetworkOverview,
  Tag
} from "../types";

export const mockTags: Tag[] = [
  { id: "tag1", name: "Tech", color: "#9b87f5" },
  { id: "tag2", name: "Creative", color: "#F97316" },
  { id: "tag3", name: "Leadership", color: "#0EA5E9" },
  { id: "tag4", name: "Finance", color: "#22C55E" },
  { id: "tag5", name: "Healthcare", color: "#EF4444" },
  { id: "tag6", name: "Education", color: "#F59E0B" },
  { id: "tag7", name: "Marketing", color: "#EC4899" },
  { id: "tag8", name: "Sales", color: "#8B5CF6" },
  { id: "tag9", name: "Engineering", color: "#64748B" },
];

export const mockCategories: Category[] = [
  { 
    id: "cat1", 
    name: "Work", 
    color: "#D3E4FD",
    subcategories: [
      { id: "subcat1", name: "Colleagues", color: "#D3E4FD" },
      { id: "subcat2", name: "Clients", color: "#D3E4FD" },
      { id: "subcat3", name: "Partners", color: "#D3E4FD" },
    ] 
  },
  { 
    id: "cat2", 
    name: "Personal", 
    color: "#FFDEE2",
    subcategories: [
      { id: "subcat4", name: "Family", color: "#FFDEE2" },
      { id: "subcat5", name: "Friends", color: "#FFDEE2" },
    ] 
  },
  { 
    id: "cat3", 
    name: "Community", 
    color: "#F2FCE2",
    subcategories: [
      { id: "subcat6", name: "Volunteering", color: "#F2FCE2" },
      { id: "subcat7", name: "Neighbors", color: "#F2FCE2" },
    ] 
  },
  { 
    id: "cat4", 
    name: "Mentors", 
    color: "#E5DEFF" 
  },
  { 
    id: "cat5", 
    name: "Network", 
    color: "#FEF7CD" 
  },
  { 
    id: "cat6", 
    name: "Other", 
    color: "#FEC6A1" 
  },
];

export const mockCustomFields: CustomField[] = [
  { id: "cf1", name: "Birthday", type: "date" },
  { id: "cf2", name: "Company", type: "text" },
  { id: "cf3", name: "Job Title", type: "text" },
  { id: "cf4", name: "Anniversary", type: "date" },
  { id: "cf5", name: "Spouse Name", type: "text" },
  { id: "cf6", name: "Children", type: "text" },
  { id: "cf7", name: "Favorite Restaurant", type: "text" },
  { id: "cf8", name: "Hobby", type: "text" },
];

export const mockContacts: Contact[] = [
  {
    id: "contact2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "555-987-6543",
    photoUrl: "/placeholder.svg",
    category: "cat2",
    tags: ["tag2", "tag7"],
    connectionStrength: 92,
    notes: "College roommate. Loves hiking and photography.",
    lastInteraction: "2023-04-02",
    customFields: {
      "cf1": "1984-09-23",
      "cf7": "The Italian Place",
      "cf8": "Photography"
    }
  },
  {
    id: "contact3",
    name: "Carol Williams",
    email: "carol@example.com",
    phone: "555-456-7890",
    photoUrl: "/placeholder.svg",
    category: "cat1",
    tags: ["tag3", "tag4"],
    connectionStrength: 78,
    notes: "Project manager at FinTech. Great resource for financial advice.",
    lastInteraction: "2023-02-28",
    customFields: {
      "cf2": "FinTech Solutions",
      "cf3": "Project Manager"
    },
    meetThroughContactId: "contact1"
  },
  {
    id: "contact4",
    name: "David Lee",
    email: "david@example.com",
    phone: "555-234-5678",
    photoUrl: "/placeholder.svg",
    category: "cat4",
    tags: ["tag1", "tag8"],
    connectionStrength: 95,
    notes: "Industry veteran with 20+ years experience. Invaluable mentor.",
    lastInteraction: "2023-03-30",
    customFields: {
      "cf2": "Tech Innovators",
      "cf3": "CTO"
    }
  },
  {
    id: "contact5",
    name: "Emma Garcia",
    email: "emma@example.com",
    phone: "555-345-6789",
    photoUrl: "/placeholder.svg",
    category: "cat3",
    tags: ["tag6", "tag7"],
    connectionStrength: 70,
    notes: "Community organizer. Great contact for local events and volunteer opportunities.",
    lastInteraction: "2023-01-15",
    customFields: {
      "cf2": "Community First",
      "cf3": "Outreach Coordinator"
    }
  },
  {
    id: "contact6",
    name: "Frank Chen",
    email: "frank@example.com",
    phone: "555-456-7890",
    photoUrl: "/placeholder.svg",
    category: "cat5",
    tags: ["tag5", "tag6"],
    connectionStrength: 65,
    notes: "Medical researcher. Connected through Emma.",
    lastInteraction: "2022-12-10",
    customFields: {
      "cf2": "Medical Research Institute",
      "cf3": "Lead Researcher"
    },
    meetThroughContactId: "contact5"
  },
  {
    id: "contact7",
    name: "Grace Kim",
    email: "grace@example.com",
    phone: "555-567-8901",
    photoUrl: "/placeholder.svg",
    category: "cat1",
    tags: ["tag2", "tag7"],
    connectionStrength: 40,
    notes: "Marketing consultant. Worked together on brand campaign.",
    lastInteraction: "2022-11-05",
    customFields: {
      "cf2": "Creative Solutions",
      "cf3": "Marketing Consultant"
    }
  },
  {
    id: "contact8",
    name: "Henry Wilson",
    email: "henry@example.com",
    phone: "555-678-9012",
    photoUrl: "/placeholder.svg",
    category: "cat6",
    tags: ["tag9"],
    connectionStrength: 50,
    notes: "Civil engineer. Met at city planning meeting.",
    lastInteraction: "2022-10-20",
    customFields: {
      "cf2": "Urban Development",
      "cf3": "Senior Engineer"
    }
  },
  {
    id: "contact9",
    name: "Isabella Martinez",
    email: "isabella@example.com",
    phone: "555-789-0123",
    photoUrl: "/placeholder.svg",
    category: "cat3",
    tags: ["tag6"],
    connectionStrength: 88,
    notes: "Elementary school teacher. Volunteered together at literacy program.",
    lastInteraction: "2023-04-10",
    customFields: {
      "cf2": "Sunny Valley Elementary",
      "cf3": "3rd Grade Teacher"
    }
  },
  {
    id: "contact10",
    name: "Jack Thompson",
    email: "jack@example.com",
    phone: "555-890-1234",
    photoUrl: "/placeholder.svg",
    category: "cat2",
    tags: ["tag2", "tag8"],
    connectionStrength: 75,
    notes: "Childhood friend. Works in sales.",
    lastInteraction: "2023-02-15",
    customFields: {
      "cf1": "1985-04-30",
      "cf2": "Global Solutions",
      "cf3": "Sales Director"
    }
  },
];

export const mockInteractions: Interaction[] = [
  {
    id: "int1",
    contactId: "contact1",
    type: "Call",
    date: "2023-03-15T14:30:00",
    notes: "Discussed potential collaboration on AI project. Alice was very interested in our approach to machine learning and offered to share some research papers.",
  },
  {
    id: "int2",
    contactId: "contact1",
    type: "Email",
    date: "2023-03-10T09:15:00",
    notes: "Sent follow-up from conference. Shared slides from my presentation.",
  },
  {
    id: "int3",
    contactId: "contact2",
    type: "Coffee",
    date: "2023-04-02T11:00:00",
    notes: "Caught up over coffee. Bob mentioned he's looking for a new job in creative direction.",
    reminder: {
      date: "2023-05-02",
      message: "Follow up with Bob about job search"
    }
  },
  {
    id: "int4",
    contactId: "contact3",
    type: "Meeting",
    date: "2023-02-28T15:00:00",
    notes: "Project status meeting. Carol provided valuable insights on financial implications.",
  },
  {
    id: "int5",
    contactId: "contact4",
    type: "Lunch",
    date: "2023-03-30T12:30:00",
    notes: "Mentorship lunch. David gave advice on career development and suggested books on leadership.",
    reminder: {
      date: "2023-04-30",
      message: "Thank David for book recommendations"
    }
  },
  {
    id: "int6",
    contactId: "contact5",
    type: "Event",
    date: "2023-01-15T18:00:00",
    notes: "Community fundraiser. Emma introduced me to several local business owners.",
  },
  {
    id: "int7",
    contactId: "contact9",
    type: "Volunteer",
    date: "2023-04-10T09:00:00",
    notes: "Literacy program at local school. Isabella showed great teaching techniques with struggling readers.",
    attachments: [
      {
        id: "att1",
        type: "image",
        url: "/placeholder.svg"
      }
    ]
  },
  {
    id: "int8",
    contactId: "contact10",
    type: "Call",
    date: "2023-02-15T19:00:00",
    notes: "Catch-up call. Jack mentioned his daughter's graduation coming up in June.",
    reminder: {
      date: "2023-06-01",
      message: "Send graduation card to Jack's daughter"
    }
  },
];

export const mockInsights: NetworkInsight[] = [
  {
    id: "insight1",
    type: "reach-out",
    title: "Time to reconnect",
    description: "You haven't spoken with Grace Kim in over 5 months. Consider reaching out.",
    contacts: ["contact7"],
    isRead: false,
    priority: "high"
  },
  {
    id: "insight2",
    type: "introduce",
    title: "Potential introduction",
    description: "Alice Johnson and Frank Chen both work in research. They might benefit from meeting each other.",
    contacts: ["contact1", "contact6"],
    isRead: false,
    priority: "high"
  },
  {
    id: "insight3",
    type: "celebration",
    title: "Birthday coming up",
    description: "Bob Smith's birthday is next week on September 23.",
    contacts: ["contact2"],
    date: "2023-09-23",
    isRead: true,
    priority: "medium"
  },
  {
    id: "insight4",
    type: "network-stat",
    title: "Network insight",
    description: "40% of your professional contacts are in the Tech industry.",
    isRead: true,
    priority: "low"
  },
  {
    id: "insight5",
    type: "reach-out",
    title: "Nurture this connection",
    description: "Your connection with Henry Wilson could use some attention.",
    contacts: ["contact8"],
    isRead: false,
    priority: "medium"
  },
];

export const mockNetworkOverview: NetworkOverview = {
  totalContacts: 10,
  activeContacts: 7,
  averageConnectionStrength: 73.8,
  needAttention: 3,
  insights: mockInsights,
  categoryDistribution: [
    { category: "Work", count: 3, color: "#D3E4FD" },
    { category: "Personal", count: 2, color: "#FFDEE2" },
    { category: "Community", count: 2, color: "#F2FCE2" },
    { category: "Mentors", count: 1, color: "#E5DEFF" },
    { category: "Network", count: 1, color: "#FEF7CD" },
    { category: "Other", count: 1, color: "#FEC6A1" }
  ],
  interactionMetrics: [
    { month: "Jan", count: 3 },
    { month: "Feb", count: 5 },
    { month: "Mar", count: 8 },
    { month: "Apr", count: 4 },
    { month: "May", count: 2 },
    { month: "Jun", count: 0 },
    { month: "Jul", count: 0 },
    { month: "Aug", count: 0 },
    { month: "Sep", count: 0 },
    { month: "Oct", count: 0 },
    { month: "Nov", count: 0 },
    { month: "Dec", count: 0 }
  ]
};
