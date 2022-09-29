import { list, create } from 'services/records';

export default async function handler(req, res) {
  const { method, query, body: stringifiedBody } = req;
  let response;

  switch (method) {
    case 'GET':
      response = await list({ userId: query.userId });
      break;
    case 'POST':
      const body = JSON.parse(stringifiedBody);
      response = await create({ userId: body.userId, emotionId: body.emotionId, reason: body.reason });
      break;
  }

  res.status(200).json(response);
}
