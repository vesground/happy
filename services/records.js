import prisma from 'prisma/client';
import { groupBy as _groupBy } from 'lodash';
import dayjs from 'dayjs';

export async function list({ userId }, { groupBy }) {
  let records = await prisma.record.findMany({
    where: {
      userId: { equals: Number(userId) },
    },
    include: {
      emotion: true,
    },
  });

  if (groupBy) {
    records = _groupBy(records, (record) => dayjs(record.createdAt).startOf('day'));
  }

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
