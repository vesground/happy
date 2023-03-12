import { create } from 'services/users';

export default async function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case 'POST':
      try {
        const response = await create({ name: body.name, password: body.password });
        res.status(200).send({ response })
      } catch (error) {
        res.status(500).send({ error})
      }
      break;
  }
}
