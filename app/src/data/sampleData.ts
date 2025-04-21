
import { ContactDetail, InteractionDetail, ReminderDetail } from "@/types";

// Sample contacts data
export const contacts: ContactDetail[] = [
  {
    id: "1",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    category: "Friend",
    tags: ["Tech", "Hiking", "Photography"],
    jobTitle: "Software Engineer",
    company: "TechCorp",
    address: "123 Main St, San Francisco, CA",
    notes: "Met at a tech conference in 2019.",
    socialProfiles: [
      { type: "LinkedIn", url: "https://linkedin.com/in/alexjohnson" },
      { type: "Twitter", url: "https://twitter.com/alexj" }
    ],
    customFields: [
      { key: "Birthday", value: "May 15" },
      { key: "Favorite Food", value: "Italian" }
    ],
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-05-22")
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.w@example.com",
    phone: "+1 (555) 987-6543",
    category: "Mentor",
    tags: ["Finance", "Books", "Travel"],
    jobTitle: "Investment Advisor",
    company: "Global Investments",
    notes: "Excellent mentor in financial planning.",
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2023-04-18")
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 234-5678",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    category: "Colleague",
    tags: ["Tech", "Design", "Gaming"],
    jobTitle: "UX Designer",
    company: "DesignHub",
    address: "456 Market St, San Francisco, CA",
    socialProfiles: [
      { type: "Dribbble", url: "https://dribbble.com/michaelc" },
      { type: "Instagram", url: "https://instagram.com/mike_designs" }
    ],
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-06-10")
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 345-6789",
    category: "Friend",
    tags: ["Art", "Yoga", "Cooking"],
    jobTitle: "Art Therapist",
    company: "Healing Arts Center",
    createdAt: new Date("2023-01-25"),
    updatedAt: new Date("2023-05-02")
  },
  {
    id: "5",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@example.com",
    phone: "+1 (555) 456-7890",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    category: "Client",
    tags: ["Business", "Golf", "Wine"],
    jobTitle: "CEO",
    company: "Wilson Enterprises",
    address: "789 Oak Dr, Los Angeles, CA",
    notes: "Important client, prefers communication via phone.",
    socialProfiles: [
      { type: "LinkedIn", url: "https://linkedin.com/in/jameswilson" }
    ],
    createdAt: new Date("2023-04-12"),
    updatedAt: new Date("2023-06-30")
  }
];

// Sample interactions data
export const interactions: InteractionDetail[] = [
  {
    id: "1",
    title: "Coffee Meeting",
    type: "In-person",
    date: new Date("2023-06-15T10:00:00"),
    contacts: [contacts[0], contacts[2]],
    notes: "Discussed potential collaboration on new project.",
    location: "Starbucks on Market St",
    attachments: [
      { name: "Project Notes", url: "#", type: "document" },
      { name: "Meeting Photo", url: "#", type: "image" }
    ],
    reminders: [
      {
        id: "1",
        title: "Follow up with Alex",
        date: new Date("2023-06-18T09:00:00"),
        isCompleted: true,
        interactionId: "1",
        createdAt: new Date("2023-06-15"),
        updatedAt: new Date("2023-06-18")
      }
    ],
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2023-06-15")
  },
  {
    id: "2",
    title: "Phone Call",
    type: "Call",
    date: new Date("2023-07-02T14:30:00"),
    contacts: [contacts[1]],
    notes: "Discussed investment strategies for Q3.",
    reminders: [
      {
        id: "2",
        title: "Send investment documents",
        date: new Date("2023-07-05T10:00:00"),
        isCompleted: false,
        interactionId: "2",
        createdAt: new Date("2023-07-02"),
        updatedAt: new Date("2023-07-02")
      }
    ],
    createdAt: new Date("2023-07-02"),
    updatedAt: new Date("2023-07-02")
  },
  {
    id: "3",
    title: "Business Dinner",
    type: "In-person",
    date: new Date("2023-07-10T18:00:00"),
    contacts: [contacts[4]],
    notes: "Discussed contract renewal terms.",
    location: "The Capital Grille",
    attachments: [
      { name: "Contract Draft", url: "#", type: "document" }
    ],
    reminders: [
      {
        id: "3",
        title: "Send updated contract",
        date: new Date("2023-07-15T12:00:00"),
        isCompleted: false,
        interactionId: "3",
        createdAt: new Date("2023-07-10"),
        updatedAt: new Date("2023-07-10")
      }
    ],
    createdAt: new Date("2023-07-10"),
    updatedAt: new Date("2023-07-12")
  }
];

// Sample reminders data
export const reminders: ReminderDetail[] = [
  {
    id: "1",
    title: "Follow up with Alex",
    date: new Date("2023-06-18T09:00:00"),
    isCompleted: true,
    interactionId: "1",
    interaction: interactions[0],
    notes: "Ask about the project timeline",
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2023-06-18")
  },
  {
    id: "2",
    title: "Send investment documents",
    date: new Date("2023-07-05T10:00:00"),
    isCompleted: false,
    interactionId: "2",
    interaction: interactions[1],
    notes: "Include Q3 projections",
    createdAt: new Date("2023-07-02"),
    updatedAt: new Date("2023-07-02")
  },
  {
    id: "3",
    title: "Send updated contract",
    date: new Date("2023-07-15T12:00:00"),
    isCompleted: false,
    interactionId: "3",
    interaction: interactions[2],
    notes: "Make sure to include new terms",
    createdAt: new Date("2023-07-10"),
    updatedAt: new Date("2023-07-10")
  },
  {
    id: "4",
    title: "Birthday - Emily Davis",
    date: new Date("2023-08-12T00:00:00"),
    isCompleted: false,
    notes: "Send a card and gift",
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2023-06-01")
  }
];
