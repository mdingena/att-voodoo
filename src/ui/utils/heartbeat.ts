import { voodooGet } from './voodooGet';
import config from '../config';

type HeartbeatResponse = {
  ok: boolean;
  error?: string;
};

export const heartbeat = async (accessToken: string): Promise<HeartbeatResponse> => {
  try {
    return await voodooGet(accessToken, config.API_ENDPOINTS.HEARTBEAT);
  } catch (error) {
    return { ok: false, error: error.message };
  }
};
