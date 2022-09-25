-- CreateTable
CREATE TABLE "Emotion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "primaryEmotionId" INTEGER,
    CONSTRAINT "Emotion_primaryEmotionId_fkey" FOREIGN KEY ("primaryEmotionId") REFERENCES "Emotion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Emotion_name_key" ON "Emotion"("name");
