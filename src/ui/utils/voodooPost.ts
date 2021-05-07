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

    if (response.status !== 200 || !response.ok) throw Error(response.statusText);

    return await response.json();
  } catch (error) {
    return { ok: false, error: error.message };
  }
};
