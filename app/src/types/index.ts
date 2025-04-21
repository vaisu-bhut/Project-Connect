
// Contact types
export interface ContactBase {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  image?: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactDetail extends ContactBase {
  address?: string;
  company?: string;
  jobTitle?: string;
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
  id: string;
  title: string;
  type: string;
  date: Date;
  contacts: ContactBase[];
  notes?: string;
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
  id: string;
  title: string;
  date: Date;
  isCompleted: boolean;
  interactionId?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderDetail extends ReminderBase {
  notes?: string;
  interaction?: InteractionBase;
}
