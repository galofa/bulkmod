import { ModList, CreateModListData, AddModToModListData } from '../components/modLists/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ModListService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Create a new modlist
  async createModList(data: CreateModListData): Promise<ModList> {
    const response = await fetch(`${API_BASE_URL}/modlists`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create mod list');
    }
    return response.json();
  }

  // Get all modlists for the current user
  async getUserModLists(): Promise<ModList[]> {
    const response = await fetch(`${API_BASE_URL}/modlists`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch mod lists');
    }
    return response.json();
  }

  // Get a specific modlist
  async getModList(modListId: number): Promise<ModList> {
    const response = await fetch(`${API_BASE_URL}/modlists/${modListId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch mod list');
    }
    return response.json();
  }

  // Update modlist details
  async updateModList(modListId: number, data: Partial<CreateModListData>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/modlists/${modListId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update mod list');
    }
  }

  // Delete a modlist
  async deleteModList(modListId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/modlists/${modListId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete mod list');
    }
  }

  // Add a mod to a modlist
  async addModToModList(modListId: number, modData: AddModToModListData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/modlists/${modListId}/mods`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(modData),
    });
    if (!response.ok) {
      throw new Error('Failed to add mod to mod list');
    }
  }

  // Remove a mod from a modlist
  async removeModFromModList(modListId: number, modSlug: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/modlists/${modListId}/mods`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ modSlug }),
    });
    if (!response.ok) {
      throw new Error('Failed to remove mod from mod list');
    }
  }

  // Check if a mod is in a specific modlist
  async isModInModList(modListId: number, modSlug: string): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/modlists/${modListId}/mods/check?modSlug=${encodeURIComponent(modSlug)}`,
      {
        method: 'GET',
        headers: this.getAuthHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to check mod in mod list');
    }
    const data = await response.json();
    return data.isInModList;
  }

  // Get all modlists containing a specific mod
  async getModListsContainingMod(modSlug: string): Promise<ModList[]> {
    const response = await fetch(
      `${API_BASE_URL}/modlists/mods/containing?modSlug=${encodeURIComponent(modSlug)}`,
      {
        method: 'GET',
        headers: this.getAuthHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch mod lists containing mod');
    }
    return response.json();
  }
}
export default new ModListService();
