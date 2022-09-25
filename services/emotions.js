import prisma from 'prisma/client';

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
