
import { API_URL } from '../constants';
import { PortfolioItem, ApiResponse } from '../types';

/**
 * Fetch items from Google Sheets via GAS
 */
export const fetchItems = async (): Promise<PortfolioItem[]> => {
  if (!API_URL || API_URL.includes('ระบุ_ID_ที่นี่')) {
    return [];
  }

  try {
    const response = await fetch(`${API_URL}?t=${Date.now()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    
    if (result.status === 'success') {
      return (result.data as PortfolioItem[]) || [];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch from GAS:', error);
    return [];
  }
};

/**
 * Save or Update item
 */
export const saveItem = async (item: Partial<PortfolioItem>, action: 'CREATE' | 'UPDATE'): Promise<boolean> => {
  if (!API_URL || API_URL.includes('ระบุ_ID_ที่นี่')) return false;

  try {
    // GAS POST requests need plain text content type often to bypass complex preflights in some environments
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action, payload: item }),
    });
    return true; 
  } catch (error) {
    console.error('Error saving item:', error);
    return false;
  }
};

/**
 * Delete item
 */
export const deleteItem = async (id: string): Promise<boolean> => {
  if (!API_URL || API_URL.includes('ระบุ_ID_ที่นี่')) return false;

  try {
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'DELETE', payload: { id } }),
    });
    return true;
  } catch (error) {
    console.error('Error deleting item:', error);
    return false;
  }
};
