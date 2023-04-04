import { create, get } from 'services/users';
import { logReq } from 'helpers/loggers';
import { handleResponse, handleError } from 'helpers/response';

export default async function handler(req, res) {
  const { method, body, url, query } = req;

  logReq({method, path: url})

  switch (method) {
    case 'GET':
      try {
        const response = await get(query.name);
        handleResponse(res, response)
      } catch (error) {
        handleError(res, error)
      }
      break;
    case 'POST':
      try {
        const response = await create({ name: body.name, password: body.password });
        handleResponse(res, response)
      } catch (error) {
        handleError(res, error)
      }
      break;
  }
}