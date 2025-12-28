
import { API_URL } from '../constants';
import { PortfolioItem, ApiResponse } from '../types';

/**
 * Fetch items from Google Sheets via GAS
 */
export const fetchItems = async (): Promise<PortfolioItem[]> => {
  // ตรวจสอบว่า URL ถูกต้องหรือไม่
  if (!API_URL || API_URL.includes('ระบุ_ID_ที่นี่') || API_URL.includes('YOUR_SCRIPT_ID')) {
    console.error('API_URL is not configured. Please update constants.tsx');
    return [];
  }

  try {
    const response = await fetch(`${API_URL}?t=${Date.now()}`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    
    if (result.status === 'success') {
      return result.data as PortfolioItem[] || [];
    } else {
      console.error('API returned error:', result.message);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch from GAS:', error);
    // แจ้งเตือนใน console ให้ผู้ใช้เช็คการตั้งค่า Anyone ใน GAS
    console.warn('โปรดตรวจสอบว่าใน Google Apps Script ได้ตั้งค่า Who has access เป็น "Anyone" แล้วหรือยัง');
    return [];
  }
};

/**
 * Save or Update item
 */
export const saveItem = async (item: Partial<PortfolioItem>, action: 'CREATE' | 'UPDATE'): Promise<boolean> => {
  if (!API_URL || API_URL.includes('ระบุ_ID_ที่นี่')) return false;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action, payload: item }),
    });
    
    // GAS often returns 302 redirect which fetch handles, 
    // but sometimes CORS blocks the JSON response. 
    // If we reach here, usually the data is already sent.
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
