import { list, create, edit } from 'services/records';

export default async function handler(req, res) {
  const { method, query, body: stringifiedBody } = req;
  let response;

  switch (method) {
    case 'GET':
      response = await list({ userId: query.userId }, { groupBy: !!query.groupBy });
      break;
    case 'POST':
      const postBody = JSON.parse(stringifiedBody);
      response = await create({ userId: postBody.userId, emotionsIds: postBody.emotions, reason: postBody.reason });
      break;
    case 'PUT':
      const putBody = JSON.parse(stringifiedBody);
      response = await edit({ id: putBody.id, emotionsIds: putBody.emotions, reason: putBody.reason });
      break;
  }

  res.status(200).json(response);
}
