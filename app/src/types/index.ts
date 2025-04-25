// Contact types
export interface ContactBase {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  company?: string;
  category: string;
  tags: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
  socialProfiles?: {
    type: string;
    url: string;
  }[];
  customFields?: {
    key: string;
    value: string;
  }[];
}

export interface ContactDetail extends ContactBase {
  phone?: string;
  address?: string;
  notes?: string;
  socialProfiles?: {
    type: string;
    url: string;
  }[];
  customFields?: {
    key: string;
    value: string;
  }[];
}

// Interaction types
export interface InteractionBase {
  _id: string;
  title: string;
  type: string;
  date: Date;
  contacts: ContactBase[];
  notes?: string;
  location?: string;
  reminders?: ReminderBase[];
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InteractionDetail extends InteractionBase {
  location?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  reminders?: ReminderBase[];
}

// Reminder types
export interface ReminderBase {
  _id: string;
  title: string;
  date: Date;
  time: string;
  status: 'completed' | 'incomplete';
  interactionId?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderDetail extends ReminderBase {
  notes?: string;
  interaction?: InteractionBase;
}
