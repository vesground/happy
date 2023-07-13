import { get, edit } from 'services/records';
import { logReq } from 'helpers/loggers';
import { handleResponse, handleError } from 'helpers/response';

export default async function handler(req, res) {
  const { method, body: stringifiedBody, url, query } = req;
  let response;

  logReq({ method, path: url });

  switch (method) {
    case 'GET':
      try {
        response = await get({ id: query.id });
        handleResponse(res, response);
      } catch (error) {
        handleError(res, error);
      }
      break;
  }
}
