const { PrismaClient } = require('@prisma/client');
const { parse } = require('csv-parse');
const fs = require('fs');

const prisma = new PrismaClient();

const userData = [
  {
    name: 'vesground',
    email: 'vesground@gmail.com',
  },
];

const csvStream = fs
  .createReadStream('/Users/vesground/Documents/happy/prisma/emotions.csv')
  .pipe(parse({ delimiter: ',', from_line: 7 }))
  .on('data', async function (row) {
    console.log(row);
    await insertEmotion(row[0], row[1], row[2]);
  })
  .on('end', function () {
    console.log('finished');
  })
  .on('error', function (error) {
    console.log(error.message);
  });

async function insertEmotion(name, type, primaryEmotionId) {
  const data = { name, type };

  if (primaryEmotionId) {
    data.primaryEmotion = {
      connect: { id: Number(primaryEmotionId) },
    };
  }

  const newEmotion = await prisma.emotion.create({ data });
  console.log('Successfully inserted emotion', newEmotion.name);
}

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
