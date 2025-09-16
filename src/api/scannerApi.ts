import { GetScannerResultParams, ScannerApiResponse } from '@/entities';

const API_BASE_URL = '/api-rs';

export const fetchScannerData = async (params: GetScannerResultParams): Promise<ScannerApiResponse> => {
  const queryParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    const typedKey = key as keyof GetScannerResultParams;

    if (params[typedKey] !== undefined) queryParams.append(key, params[typedKey]!.toString());
  })

  const url = `${API_BASE_URL}/scanner?${queryParams.toString()}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching scanner data:', error);
    throw error;
  }
};

export const API_PATHS = {
  scanner: `${API_BASE_URL}/scanner`,
  websocket: 'wss://api-rs.dexcelerate.com/ws',
};
