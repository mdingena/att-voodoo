import fetch from 'electron-fetch';

export const voodooGet = async (accessToken: string, endpoint: string): Promise<any> => {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status !== 200 || !response.ok) throw Error(response.statusText);

    return await response.json();
  } catch (error) {
    return { ok: false, error: error.message };
  }
};
