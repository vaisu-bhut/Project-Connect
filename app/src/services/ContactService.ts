import { ContactBase } from '@/types';

const API_URL = 'http://localhost:5000/api/contacts';

export const contactService = {
  async getAllContacts(): Promise<ContactBase[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    return response.json();
  },

  async getContact(id: string): Promise<ContactBase> {
    const response = await fetch(`${API_URL}/${id}`);
    if (response.status === 404) {
      throw new Error('Contact not found');
    }
    if (!response.ok) {
      throw new Error('Failed to fetch contact');
    }
    return response.json();
  },

  async createContact(contact: Omit<ContactBase, '_id'>): Promise<ContactBase> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    });
    if (!response.ok) {
      throw new Error('Failed to create contact');
    }
    return response.json();
  },

  async updateContact(id: string, contact: Partial<ContactBase>): Promise<ContactBase> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    });
    if (!response.ok) {
      throw new Error('Failed to update contact');
    }
    return response.json();
  },

  async deleteContact(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete contact');
    }
  },
}; 