import fetch from 'electron-fetch';
import config from '../config';

type HeartbeatResponse = {
  ok: boolean;
  error?: string;
};

export const heartbeat = async (accessToken: string): Promise<HeartbeatResponse> => {
  try {
    const response = await fetch(config.API_ENDPOINTS.HEARTBEAT, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status !== 200 || !response.ok) return { ok: false, error: response.statusText };

    return await response.json();
  } catch (error) {
    return { ok: false, error: error.code };
  }
};
