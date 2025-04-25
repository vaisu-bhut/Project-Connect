import { InteractionBase, ContactBase } from '@/types';

const API_URL = 'https://project-connect-ie7t.onrender.com/api/interactions';

interface ApiInteraction {
  _id: string;
  title: string;
  type: string;
  date: string;
  contacts: ContactBase[];
  notes?: string;
  location?: string;
  reminders?: ApiReminder[];
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ApiReminder {
  id: string;
  title: string;
  date: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const interactionService = {
  async getAllInteractions(): Promise<InteractionBase[]> {
    const response = await fetch(API_URL, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch interactions');
    }
    const data = await response.json();
    return data.map((interaction: ApiInteraction) => ({
      ...interaction,
      date: new Date(interaction.date),
      createdAt: new Date(interaction.createdAt),
      updatedAt: new Date(interaction.updatedAt),
      reminders: interaction.reminders?.map((reminder: ApiReminder) => ({
        ...reminder,
        date: new Date(reminder.date),
        createdAt: new Date(reminder.createdAt),
        updatedAt: new Date(reminder.updatedAt)
      })) || []
    }));
  },

  async getInteractionById(id: string): Promise<InteractionBase> {
    const response = await fetch(`${API_URL}/single/${id}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch interaction');
    }
    const data = await response.json();
    return {
      ...data,
      date: new Date(data.date),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      reminders: data.reminders?.map((reminder: ApiReminder) => ({
        ...reminder,
        date: new Date(reminder.date),
        createdAt: new Date(reminder.createdAt),
        updatedAt: new Date(reminder.updatedAt)
      })) || []
    };
  },

  async getInteractionsByContactId(contactId: string): Promise<InteractionBase[]> {
    const response = await fetch(`${API_URL}/${contactId}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch interactions');
    }
    const data = await response.json();
    return data.map((interaction: ApiInteraction) => ({
      ...interaction,
      date: new Date(interaction.date),
      createdAt: new Date(interaction.createdAt),
      updatedAt: new Date(interaction.updatedAt),
      reminders: interaction.reminders?.map((reminder: ApiReminder) => ({
        ...reminder,
        date: new Date(reminder.date),
        createdAt: new Date(reminder.createdAt),
        updatedAt: new Date(reminder.updatedAt)
      })) || []
    }));
  },

  async createInteraction(interaction: Omit<InteractionBase, '_id'>): Promise<InteractionBase> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(interaction),
    });
    if (!response.ok) {
      throw new Error('Failed to create interaction');
    }
    return response.json();
  },

  async updateInteraction(id: string, interaction: Partial<InteractionBase>): Promise<InteractionBase> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(interaction),
    });
    if (!response.ok) {
      throw new Error('Failed to update interaction');
    }
    return response.json();
  },

  async deleteInteraction(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to delete interaction');
    }
  }
}; 