/*
  Warnings:

  - The primary key for the `tb_apptransactfile` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `tb_apptransactfile` DROP PRIMARY KEY,
    MODIFY `f_appimageidno` VARCHAR(256) NOT NULL,
    ADD PRIMARY KEY (`f_appimageidno`);
