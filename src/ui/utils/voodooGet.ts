import fetch from 'electron-fetch';

export const voodooGet = async (accessToken: string, endpoint: string): Promise<any> => {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const body = await response.json();

    if (!response.ok) throw new Error(body.error ?? response.statusText);

    return body;
  } catch (error) {
    return { ok: false, error: error.message };
  }
};
