import prisma from 'prisma/client';
import { groupBy as _groupBy } from 'lodash';
import dayjs from 'dayjs';

export async function list({ userId }, { groupBy }) {
  let records = await prisma.record.findMany({
    where: {
      userId: { equals: Number(userId) },
    },
    include: {
      emotions: true,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });

  if (groupBy) {
    records = _groupBy(records, (record) => dayjs(record.createdAt).startOf('day'));
  }

  return records;
}

export async function create({ userId, emotionsIds, reason }) {
  const record = await prisma.record.create({
    data: {
      reason,
      user: { connect: { id: userId } },
      emotions: { connect: emotionsIds.map((id) => ({ id })) },
    },
  });

  return record;
}

export async function edit({ id, reason }) {
  const record = await prisma.record.update({
    where: {
      id,
    },
    data: {
      reason,
    },
    include: {
      emotions: true,
    },
  });

  return record;
}
