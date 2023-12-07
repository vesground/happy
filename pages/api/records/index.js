import { list, create, edit } from 'services/records';
import { logReq } from 'helpers/loggers';
import { handleResponse, handleError } from 'helpers/response';

function parseEmotionsQuery(emotions) {
  if (emotions && Array.isArray(emotions)) {
    return emotions;
  } else if (emotions && typeof emotions === 'string') {
    return [emotions];
  }

  return [];
}

export default async function handler(req, res) {
  const { method, query, body: stringifiedBody, url } = req;
  let response;

  logReq({ method, path: url });

  switch (method) {
    case 'GET':
      try {
        const exclude = query.exclude && !Array.isArray(query.exclude) ? Array.of(query.exclude) : query.exclude;
        const emotions = parseEmotionsQuery(query.emotions);

        response = await list(
          { userId: query.userId, emotions, exclude },
          { groupBy: !!query.groupBy, sortBy: query.sortBy, order: query.order },
        );
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
  }
}
