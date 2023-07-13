import prisma from 'prisma/client';
import { groupBy as _groupBy, orderBy } from 'lodash';
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

export async function list(filters, options = {}) {
  const where = buildWhere(filters);
  const orderBy = buildOrderBy(options);

  let records = await prisma.record.findMany({
    where,
    include: {
      emotions: true,
    },
    orderBy,
  });

  if (options.groupBy) {
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

function buildWhere({ userId, emotions = [], exclude = [] }) {
  const query = {};

  if (userId) {
    query.userId = { equals: Number(userId) };
  }

  if (emotions.length) {
    query.emotions = { some: { OR: emotions.map((id) => ({ id: Number(id) })) } };
  }

  if (exclude.length) {
    query.NOT = { AND: exclude.map((id) => ({ id: Number(id) })) };
  }

  return query;
}

function buildOrderBy({ sortBy, order }) {
  const orderBy = [];

  if (sortBy === 'emotions') {
    const orderRule = {
      emotions: {
        _count: order,
      },
    };
    orderBy.push(orderRule);
  } else if (sortBy) {
    const orderRule = {
      [sortBy]: order,
    };
    orderBy.push(orderRule);
  }

  return orderBy;
}
