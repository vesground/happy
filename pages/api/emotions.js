import { list } from 'services/emotions';
import { logReq } from 'helpers/loggers';

export default async function handler(req, res) {
  const { method, query, url } = req;
  let response;

  logReq({method, path: url})

  switch (method) {
    case 'GET':
      response = await list(query);
      break;
  }

  res.status(200).json(response);
}
