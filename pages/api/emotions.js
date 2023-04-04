import { list } from 'services/emotions';
import { logReq } from 'helpers/loggers';
import { handleResponse, handleError } from 'helpers/response';

export default async function handler(req, res) {
  const { method, query, url } = req;
  let response;

  logReq({method, path: url})

  switch (method) {
    case 'GET':
      try {
        response = await list({ userId: query.userId }, { groupBy: !!query.groupBy });
        handleResponse(res, response)
      } catch (error) {
        handleError(res, error)
      }
      break;
  }
}
