import { stream } from 'services/emotions';

export default async function handler(req, res) {
  const { query } = req;

  // set default chunks to 10
  let chunks = query.chunks || 10;
  // max out chunks at 100
  if (chunks > 100) chunks = 100;

  for await (const emotions of stream({ batchSize: chunks })) {
    res.write(JSON.stringify(emotions));
  }

  res.end();
}
