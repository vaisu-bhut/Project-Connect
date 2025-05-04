import { ReminderBase } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

export const reminderService = {
  async getReminders(interactionId?: string): Promise<ReminderBase[]> {
    const url = interactionId ? `${API_URL}/reminders?interactionId=${interactionId}` : `${API_URL}/reminders`;
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Failed to fetch reminders');
    }
    return response.json();
  },

  async createReminder(reminder: Omit<ReminderBase, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ReminderBase> {
    const response = await fetch(`${API_URL}/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(reminder),
    });
    if (!response.ok) {
      throw new Error('Failed to create reminder');
    }
    return response.json();
  },

  async updateReminder(id: string, reminder: Partial<ReminderBase>): Promise<ReminderBase> {
    const response = await fetch(`${API_URL}/reminders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(reminder),
    });
    if (!response.ok) {
      throw new Error('Failed to update reminder');
    }
    return response.json();
  },

  async deleteReminder(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/reminders/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete reminder');
    }
  },
}; 