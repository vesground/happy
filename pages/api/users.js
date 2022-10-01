import { create } from 'services/users';

export default async function handler(req, res) {
  const { method, query, body: stringifiedBody } = req;
  let response;

  switch (method) {
    case 'POST':
      const body = JSON.parse(stringifiedBody);
      response = await create({ name: body.name, password: body.password });
      break;
  }

  res.status(200).json(response);
}
