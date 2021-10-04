import fetch from 'electron-fetch';

export const voodooDelete = async (accessToken: string, endpoint: string): Promise<any> => {
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const body = await response.json();

    if (!response.ok) throw new Error(body.error ?? response.statusText);

    return body;
  } catch (error) {
    return { ok: false, error: error.message };
  }
};
