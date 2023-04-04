import prisma from 'prisma/client';
import bcrypt from 'bcrypt';

export async function get(name) {
  const user = await prisma.user.findUnique({
    where: { name },
  });

  return user;
}

export async function getByName(name) {
  const user = await prisma.user.findUnique({
    where: { name },
  });

  return user;
}

export async function create({ name, password }) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = await prisma.user.create({
    data: {
      name,
      password: hash,
    },
  });

  return newUser;
}
