import prisma from 'prisma/client';
import { Readable } from 'stream';

export async function list({ type, primaryEmotionId }) {
  const query = {
    type: { equals: type },
  };

  if (primaryEmotionId) {
    query.NOT = { primaryEmotionId: null };
    query.primaryEmotionId = { equals: Number(primaryEmotionId) };
  }

  const emotions = await prisma.emotion.findMany({ where: query });
  return emotions;
}

export function stream({ batchSize }) {
  let cursorId = undefined;

  return new Readable({
    objectMode: true,
    async read() {
      try {
        const items = await prisma.emotion.findMany({
          take: batchSize,
          skip: cursorId ? 1 : 0,
          cursor: cursorId ? { id: cursorId } : undefined,
        });
        if (items.length === 0) {
          this.push(null);
        } else {
          this.push(items);
          cursorId = items[items.length - 1].id;
        }
      } catch (err) {
        this.destroy(err);
      }
    },
  });
}
