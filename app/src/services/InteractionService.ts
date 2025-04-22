import { InteractionBase, InteractionDetail } from '@/types';

const API_URL = 'http://localhost:5000/api/interactions';

export const interactionService = {
  async getInteractionsByContact(contactId: string): Promise<InteractionBase[]> {
    const response = await fetch(`${API_URL}/contact/${contactId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch interactions');
    }
    return response.json();
  },

  async createInteraction(interaction: Omit<InteractionDetail, '_id' | 'createdAt' | 'updatedAt'>): Promise<InteractionDetail> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interaction),
    });
    if (!response.ok) {
      throw new Error('Failed to create interaction');
    }
    return response.json();
  },

  async updateInteraction(id: string, interaction: Partial<InteractionDetail>): Promise<InteractionDetail> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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
    });
    if (!response.ok) {
      throw new Error('Failed to delete interaction');
    }
  }
}; 