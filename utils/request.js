async function request(url, options) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}${url}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: options.method,
      body: JSON.stringify(options.body),
    });
    const json = await response.json();

    if (!response.ok) throw Error(json.message);
  } catch (error) {
    throw error;
  }
}

async function post(url, body) {
  try {
    const response = await request(url, { method: 'POST', body });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const Requests = {
  post,
};
