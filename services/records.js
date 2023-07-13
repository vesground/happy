import prisma from 'prisma/client';
import { groupBy as _groupBy } from 'lodash';
import dayjs from 'dayjs';

export async function get({ id }) {
  const record = await prisma.record.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      emotions: true,
    },
  });

  return record;
}

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

export async function edit({ id }, { emotionsIds, reason }) {
  const data = {};

  if (emotionsIds) {
    data.emotions = { set: emotionsIds.map((id) => ({ id })) };
  }

  if (reason) {
    data.reason = reason;
  }

  const record = await prisma.record.update({
    where: {
      id: Number(id),
    },
    data,
    include: {
      emotions: true,
    },
  });

  return record;
}
