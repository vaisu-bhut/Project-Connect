import { PREDEFINED_TAGS } from "../constants/tags";

export type TagType = typeof PREDEFINED_TAGS[number];

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories?: Category[];
  color?: string;
}

export interface Interaction {
  _id: string;
  userId: string;
  contactId: string;
  contactIds: string[];
  type: string;
  title: string;
  date: string;
  time: string;
  notes?: string;
  location?: string;
  reminders?: Array<{
    date: string;
    time: string;
    message: string;
    minutes: number;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    path: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  category: string;
  tags: string[];
  connectionStrength: number; // 0-100
  notes?: string;
  lastInteraction?: string;
  customFields?: Record<string, string>;
  meetThroughContactId?: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: "text" | "date" | "number" | "url";
}

export interface NetworkInsight {
  id: string;
  type: 
    | "reach-out" 
    | "introduce" 
    | "celebration" 
    | "network-stat";
  title: string;
  description: string;
  contacts?: string[];
  date?: string;
  isRead: boolean;
  priority?: "high" | "medium" | "low";
}

export interface CategoryDistribution {
  category: string;
  count: number;
  color: string;
}

export interface InteractionMetric {
  month: string;
  count: number;
}

export interface NetworkOverview {
  totalContacts: number;
  activeContacts: number;
  averageConnectionStrength: number;
  needAttention: number;
  insights: NetworkInsight[];
  categoryDistribution: CategoryDistribution[];
  interactionMetrics: InteractionMetric[];
}
