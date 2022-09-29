import prisma from 'prisma/client';

export async function list({ userId }) {
  const records = await prisma.record.findMany({
    where: {
      userId: { equals: Number(userId) },
    },
    include: {
      emotion: true,
    },
  });

  return records;
}

export async function create({ userId, emotionId, reason }) {
  const record = await prisma.record.create({
    data: {
      reason,
      user: { connect: { id: userId } },
      emotion: { connect: { id: emotionId } },
    },
  });

  return record;
}
