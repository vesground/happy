const { PrismaClient } = require('@prisma/client');
const csvParseSync = require('csv-parse/sync');
const csvParse = require('csv-parse');
const fs = require('fs');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const userData = [
  {
    name: 'vesground',
    password: 'q123-321Q',
  },
];
const emotionsCsvString = fs.readFileSync('/Users/vesground/Documents/happy/prisma/emotions.csv').toLocaleString();
const emotionsData = csvParseSync.parse(emotionsCsvString, { columns: true });

const csvStream = fs
  .createReadStream('/Users/vesground/Documents/happy/prisma/records.csv')
  .pipe(csvParse.parse({ delimiter: ',', columns: true }));

async function insertRecord({ userId, emotionId, createdAt, reason }) {
  const newRecord = await prisma.record.create({
    data: {
      user: {
        connect: { id: 1 },
      },
      emotion: {
        connect: { id: Number(emotionId) },
      },
      createdAt: new Date(createdAt),
      reason,
    },
  });
  console.log('Successfully upserted emotion', newRecord.id);
}

async function insertEmotion({ name, type, primaryEmotionId }) {
  const data = { name, type };

  if (primaryEmotionId) {
    data.primaryEmotion = {
      connect: { id: Number(primaryEmotionId) },
    };
  }

  const newEmotion = await prisma.emotion.upsert({
    where: { name },
    create: data,
    update: {},
  });
  console.log('Successfully upserted emotion', newEmotion.name);
}

async function main() {
  console.log(`Start seeding ...`);

  for (const user of userData) {
    const { name, password } = user;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = await prisma.user.upsert({
      where: { name },
      create: {
        name,
        password: hash,
      },
      update: {},
    });
    console.log(`Created user with id: ${newUser.id}`);
  }

  for (const emotion of emotionsData) {
    await insertEmotion(emotion);
  }

  const hasRecords = await prisma.record.findFirst();
  if (!hasRecords) {
    csvStream
      .on('data', async function (row) {
        await insertRecord(row);
      })
      .on('end', function () {
        console.log('finished');
      })
      .on('error', function (error) {
        console.log(error.message);
      });
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
