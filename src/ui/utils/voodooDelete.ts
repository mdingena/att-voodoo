import fetch from 'electron-fetch';

export const voodooDelete = async (accessToken: string, endpoint: string, data?: any): Promise<any> => {
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: typeof data === 'undefined' ? undefined : JSON.stringify(data)
    });

    if (!response.ok) throw new Error(response.statusText);

    const body = await response.json();

    if (!body.ok) throw new Error(body.error);

    return body;
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
