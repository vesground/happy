import { create } from 'services/users';
import { logReq } from 'helpers/loggers';

export default async function handler(req, res) {
  const { method, body, url } = req;

  logReq({method, path: url})

  switch (method) {
    case 'POST':
      try {
        const response = await create({ name: body.name, password: body.password });
        res.status(200).send({ response })
      } catch (error) {
        res.status(500).send({ error })
      }
      break;
  }
}
