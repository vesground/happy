import { list, create, edit } from 'services/records';
import { logReq } from 'helpers/loggers';
import { handleResponse, handleError } from 'helpers/response';

export default async function handler(req, res) {
  const { method, query, body: stringifiedBody, url } = req;
  let response;

  logReq({ method, path: url });

  switch (method) {
    case 'GET':
      try {
        response = await list({ userId: query.userId }, { groupBy: !!query.groupBy });
        handleResponse(res, response);
      } catch (error) {
        handleError(res, error);
      }
      break;
    case 'POST':
      const postBody = JSON.parse(stringifiedBody);

      try {
        response = await create({ userId: postBody.userId, emotionsIds: postBody.emotions, reason: postBody.reason });
        handleResponse(res, response);
      } catch (error) {
        handleError(res, error);
      }
      break;
    case 'PUT':
      const putBody = JSON.parse(stringifiedBody);

      try {
        response = await edit({ id: putBody.id, emotionsIds: putBody.emotions, reason: putBody.reason });
        handleResponse(res, response);
      } catch (error) {
        handleError(res, error);
      }
      break;
  }
}
