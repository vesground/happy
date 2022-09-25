import { list } from 'services/emotions';

export default async function handler(req, res) {
  const { method, query } = req;
  let response;

  switch (method) {
    case 'GET':
      response = await list(query);
      break;
  }

  res.status(200).json(response);
}
