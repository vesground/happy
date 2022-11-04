-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_emotionId_fkey";

-- CreateTable
CREATE TABLE "_EmotionToRecord" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmotionToRecord_AB_unique" ON "_EmotionToRecord"("A", "B");

-- CreateIndex
CREATE INDEX "_EmotionToRecord_B_index" ON "_EmotionToRecord"("B");

-- AddForeignKey
ALTER TABLE "_EmotionToRecord" ADD CONSTRAINT "_EmotionToRecord_A_fkey" FOREIGN KEY ("A") REFERENCES "Emotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmotionToRecord" ADD CONSTRAINT "_EmotionToRecord_B_fkey" FOREIGN KEY ("B") REFERENCES "Record"("id") ON DELETE CASCADE ON UPDATE CASCADE;
