-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parentid_fkey";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentid_fkey" FOREIGN KEY ("parentid") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
