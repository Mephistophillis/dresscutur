/*
  Warnings:

  - You are about to drop the column `helpful` on the `FAQ` table. All the data in the column will be lost.
  - You are about to drop the column `notHelpful` on the `FAQ` table. All the data in the column will be lost.
  - You are about to drop the `GalleryItemDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GalleryItemDetails" DROP CONSTRAINT "GalleryItemDetails_galleryItemId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#3b82f6',
ADD COLUMN     "location" TEXT,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "FAQ" DROP COLUMN "helpful",
DROP COLUMN "notHelpful",
ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "GalleryItem" ADD COLUMN     "client" TEXT,
ADD COLUMN     "date" TEXT,
ADD COLUMN     "materials" TEXT[],
ADD COLUMN     "process" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "advantages" TEXT[],
ADD COLUMN     "timeline" JSONB;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'string';

-- DropTable
DROP TABLE "GalleryItemDetails";

-- CreateTable
CREATE TABLE "Workshop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "directions" TEXT,
    "coordinates" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "socialLinks" JSONB,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "Event"("category");

-- CreateIndex
CREATE INDEX "Fabric_category_idx" ON "Fabric"("category");

-- CreateIndex
CREATE INDEX "Fabric_isActive_idx" ON "Fabric"("isActive");

-- CreateIndex
CREATE INDEX "Fabric_order_idx" ON "Fabric"("order");

-- CreateIndex
CREATE INDEX "GalleryItem_category_idx" ON "GalleryItem"("category");

-- CreateIndex
CREATE INDEX "GalleryItem_isActive_idx" ON "GalleryItem"("isActive");

-- CreateIndex
CREATE INDEX "GalleryItem_order_idx" ON "GalleryItem"("order");

-- CreateIndex
CREATE INDEX "GalleryItem_isNew_idx" ON "GalleryItem"("isNew");

-- CreateIndex
CREATE INDEX "Service_isActive_idx" ON "Service"("isActive");

-- CreateIndex
CREATE INDEX "Service_order_idx" ON "Service"("order");

-- CreateIndex
CREATE INDEX "Settings_category_idx" ON "Settings"("category");

-- CreateIndex
CREATE INDEX "Testimonial_isActive_idx" ON "Testimonial"("isActive");

-- CreateIndex
CREATE INDEX "Testimonial_order_idx" ON "Testimonial"("order");
