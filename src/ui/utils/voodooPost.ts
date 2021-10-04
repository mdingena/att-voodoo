import fetch from 'electron-fetch';

export const voodooPost = async (accessToken: string, endpoint: string, data: any): Promise<any> => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const body = await response.json();

    if (!response.ok) throw new Error(body.error ?? response.statusText);

    return body;
  } catch (error) {
    return { ok: false, error: error.message };
  }
};
