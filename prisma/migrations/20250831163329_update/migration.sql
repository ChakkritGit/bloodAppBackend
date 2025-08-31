/*
  Warnings:

  - The primary key for the `tb_user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `tb_user` DROP PRIMARY KEY,
    MODIFY `f_username` VARCHAR(64) NOT NULL,
    MODIFY `f_userpass` VARCHAR(256) NOT NULL,
    ADD PRIMARY KEY (`f_username`);
