import { ContactBase } from '@/types';

const API_URL = 'https://bd4vdphin1.execute-api.us-east-1.amazonaws.com/api';

export const contactService = {
  async getAllContacts(): Promise<ContactBase[]> {
    const response = await fetch(`${API_URL}/contacts`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    return response.json();
  },

  async getContact(id: string): Promise<ContactBase> {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (response.status === 404) {
      throw new Error('Contact not found');
    }
    if (!response.ok) {
      throw new Error('Failed to fetch contact');
    }
    return response.json();
  },

  async createContact(contact: Omit<ContactBase, '_id'>): Promise<ContactBase> {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        ...contact,
        socialProfiles: contact.socialProfiles || [],
        customFields: contact.customFields || []
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create contact');
    }
    return response.json();
  },

  async updateContact(id: string, contact: Partial<ContactBase>): Promise<ContactBase> {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      body: JSON.stringify({
        ...contact,
        socialProfiles: contact.socialProfiles || [],
        customFields: contact.customFields || []
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update contact');
    }
    return response.json();
  },

  async deleteContact(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) {
      throw new Error('Failed to delete contact');
    }
  },
}; 