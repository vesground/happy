import prisma from 'prisma/client';

export async function list({ userId }) {
  const records = await prisma.record.findMany({ where: { userId: { equals: userId } } });

  return records;
}

export async function create({ userId, emotionId }) {
  const record = await prisma.record.create({
    data: {
      user: { connect: { id: userId } },
      emotion: { connect: { id: emotionId } },
    },
  });

  return record;
}
