/*
  Warnings:

  - Added the required column `address1` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `address1` VARCHAR(191) NOT NULL,
    ADD COLUMN `address2` VARCHAR(191) NULL,
    ADD COLUMN `altPhone` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `deliveryTime` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `fullName` VARCHAR(191) NOT NULL,
    ADD COLUMN `giftMessage` VARCHAR(191) NULL,
    ADD COLUMN `landmark` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `pincode` VARCHAR(191) NOT NULL,
    ADD COLUMN `promoCode` VARCHAR(191) NULL,
    ADD COLUMN `specialInstructions` VARCHAR(191) NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL;
