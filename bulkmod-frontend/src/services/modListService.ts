import { ModList, CreateModListData, AddModToModListData } from '../components/modLists/types';
import { getAuthHeaders, handleAuthError } from '../utils/authUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ModListService {

  // Create a new modlist
  async createModList(data: CreateModListData): Promise<ModList> {
    const response = await fetch(`${API_BASE_URL}/modlists`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      handleAuthError(response, 'Failed to create mod list');
    }
    return response.json();
  }

  // Get all modlists for the current user
  async getUserModLists(): Promise<ModList[]> {
    console.log('modListService.getUserModLists - API_BASE_URL:', API_BASE_URL);
    console.log('modListService.getUserModLists - token:', localStorage.getItem('token') ? 'present' : 'missing');
    
    const headers = getAuthHeaders();
    console.log('modListService.getUserModLists - headers being sent:', headers);
    
    const response = await fetch(`${API_BASE_URL}/modlists`, {
      method: 'GET',
      headers: headers,
    });
    
    console.log('modListService.getUserModLists - response status:', response.status);
    console.log('modListService.getUserModLists - response ok:', response.ok);
    
    if (!response.ok) {
      handleAuthError(response, 'Failed to fetch mod lists');
    }
    return response.json();
  }

  // Get a specific modlist
  async getModList(modListId: number): Promise<ModList> {
    const response = await fetch(`${API_BASE_URL}/modlists/${modListId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      handleAuthError(response, 'Failed to fetch mod list');
    }
    return response.json();
  }

  // Update modlist details
  async updateModList(modListId: number, data: Partial<CreateModListData>): Promise<ModList> {
    const response = await fetch(`${API_BASE_URL}/modlists/${modListId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError(response, 'Failed to update mod list');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update mod list');
    }
    const result = await response.json();
    return result.modList;
  }

  // Delete a modlist
  async deleteModList(modListId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/modlists/${modListId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      handleAuthError(response, 'Failed to delete mod list');
    }
  }

  // Add a mod to a modlist
  async addModToModList(modListId: number, modData: AddModToModListData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/modlists/${modListId}/mods`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(modData),
    });
    if (!response.ok) {
      handleAuthError(response, 'Failed to add mod to mod list');
    }
  }

  // Remove a mod from a modlist
  async removeModFromModList(modListId: number, modSlug: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/modlists/${modListId}/mods`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ modSlug }),
    });
    if (!response.ok) {
      handleAuthError(response, 'Failed to remove mod from mod list');
    }
  }

  // Check if a mod is in a specific modlist
  async isModInModList(modListId: number, modSlug: string): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/modlists/${modListId}/mods/check?modSlug=${encodeURIComponent(modSlug)}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      handleAuthError(response, 'Failed to check mod in mod list');
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
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      handleAuthError(response, 'Failed to fetch mod lists containing mod');
    }
    return response.json();
  }

  // Get all public modlists
  async getPublicModLists(): Promise<ModList[]> {
    const response = await fetch(`${API_BASE_URL}/modlists/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch public mod lists');
    }
    return response.json();
  }

  // Copy a public modlist to user's account
  async copyPublicModList(publicModListId: number): Promise<ModList> {
    const response = await fetch(`${API_BASE_URL}/modlists/public/${publicModListId}/copy`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      handleAuthError(response, 'Failed to copy public mod list');
      throw new Error('Failed to copy public mod list');
    }
    return response.json();
  }
}
export default new ModListService();
