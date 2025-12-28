
import { API_URL } from '../constants';
import { PortfolioItem, ApiResponse } from '../types';

/**
 * Fetch items from Google Sheets via GAS
 */
export const fetchItems = async (): Promise<PortfolioItem[]> => {
  if (API_URL.includes('YOUR_SCRIPT_ID')) {
    console.warn('API_URL is still using placeholder. Please update in constants.tsx');
    return [];
  }

  try {
    // Adding a timestamp to prevent caching issues
    const response = await fetch(`${API_URL}?t=${Date.now()}`);
    const result: ApiResponse = await response.json();
    return result.data as PortfolioItem[] || [];
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

/**
 * Save or Update item
 */
export const saveItem = async (item: Partial<PortfolioItem>, action: 'CREATE' | 'UPDATE'): Promise<boolean> => {
  try {
    // We use a simple fetch. GAS handles redirects automatically in modern browsers.
    // Note: GAS doesn't support CORS for POST perfectly with custom headers, 
    // so we send as a simple request (text/plain) which GAS can still parse.
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action, payload: item }),
    });
    
    // In many cases with GAS, we might not get a readable response due to CORS
    // but the data will still be processed on the server side.
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
