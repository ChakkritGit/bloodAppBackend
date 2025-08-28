-- CreateTable
CREATE TABLE `tb_apptransact` (
    `f_appidno` VARCHAR(20) NOT NULL,
    `f_appidgroup` INTEGER UNSIGNED NULL DEFAULT 0,
    `f_appidname` VARCHAR(100) NULL,
    `f_appstepno` INTEGER UNSIGNED NULL DEFAULT 0,
    `f_appcreatebyname` VARCHAR(150) NULL,
    `f_appcreatedatetime` DATETIME(0) NULL,
    `f_appcreateforhn` VARCHAR(20) NULL,
    `f_appcreateforname` VARCHAR(150) NULL,
    `f_appcreatefordatetime` DATETIME(0) NULL,
    `f_appcreateconfirmname` VARCHAR(150) NULL,
    `f_appcreateconfirmdatetime` DATETIME(0) NULL,
    `f_appcreatecontacttelephone` VARCHAR(15) NULL,
    `f_appcreatecontacttelephonetwo` VARCHAR(15) NULL,
    `f_appcreatecontactaddress` TEXT NULL,
    `f_appcreatecontactlat` VARCHAR(100) NULL,
    `f_appcreatecontactlon` VARCHAR(100) NULL,
    `f_appcreatecontactacc` VARCHAR(100) NULL,
    `f_appdoctorduedate` VARCHAR(10) NULL,
    `f_appadminduedate` VARCHAR(10) NULL,
    `f_appadmindueque` INTEGER UNSIGNED NULL DEFAULT 0,
    `f_appadminduequemax` INTEGER UNSIGNED NULL DEFAULT 0,
    `f_appadminconfirmdate` VARCHAR(12) NULL,
    `f_appadminconfirmtime` VARCHAR(12) NULL,
    `f_appadminconfirmque` INTEGER UNSIGNED NULL DEFAULT 0,
    `f_appadminconfirmvisitedate` DATETIME(0) NULL,
    `f_appcancelname` VARCHAR(150) NULL,
    `f_appcanceldatetime` DATETIME(0) NULL,
    `f_apppayby` VARCHAR(50) NULL,
    `f_apppaydatetime` DATETIME(0) NULL,
    `f_apppayprice` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `f_apppictureappdoc` VARCHAR(100) NULL,
    `f_apppictureappdocdatetime` DATETIME(0) NULL,
    `f_apppicturelisttestdoc` VARCHAR(100) NULL,
    `f_apppicturelisttestdocdatetime` DATETIME(0) NULL,
    `f_apppicturebloodtube` VARCHAR(100) NULL,
    `f_apppicturebloodtubedatetime` DATETIME(0) NULL,
    `f_apppictureslipdoc` VARCHAR(100) NULL,
    `f_apppictureslipdocdatetime` DATETIME(0) NULL,
    `f_apppicturepatient` VARCHAR(100) NULL,
    `f_apppicturepatientdatetime` DATETIME(0) NULL,
    `f_apppictureuser` VARCHAR(100) NULL,
    `f_apppictureuserdatetime` DATETIME(0) NULL,
    `f_appadminvisitfullname` VARCHAR(150) NULL,
    `f_appadminvisittelephone` VARCHAR(15) NULL,
    `f_appadminvisitdatetime` DATETIME(0) NULL,
    `f_apppatientproveinfodatetime` DATETIME(0) NULL,
    `f_apppatientproveinfostatus` DECIMAL(1, 0) NULL DEFAULT 0,
    `f_apppatientproveinfobyname` VARCHAR(150) NULL,
    `f_appcomment` VARCHAR(200) NULL,
    `f_appstatus` DECIMAL(1, 0) NULL DEFAULT 0,
    `f_appbastatus` DECIMAL(1, 0) NULL DEFAULT 0,
    `f_applastmodified` DATETIME(0) NULL,

    PRIMARY KEY (`f_appidno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_apptransactfile` (
    `f_appimageidno` VARCHAR(20) NOT NULL,
    `f_appimageidtype` INTEGER UNSIGNED NULL DEFAULT 0,
    `f_appimageidname` VARCHAR(100) NULL,
    `f_appimageidpart` VARCHAR(100) NULL,
    `f_appimageidrefno` VARCHAR(20) NOT NULL,
    `f_appimageidstatus` DECIMAL(1, 0) NULL DEFAULT 0,
    `f_appimageidbastatus` DECIMAL(1, 0) NULL DEFAULT 0,
    `f_appimageidlastmodified` DATETIME(0) NULL,

    PRIMARY KEY (`f_appimageidno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_user` (
    `f_username` VARCHAR(20) NOT NULL,
    `f_userpass` VARCHAR(20) NULL,
    `f_userfullname` VARCHAR(150) NULL,
    `f_usercomment` VARCHAR(200) NULL,
    `f_userstatus` DECIMAL(1, 0) NULL DEFAULT 0,
    `f_userbastatus` DECIMAL(1, 0) NULL DEFAULT 0,
    `f_userlastmodified` DATETIME(0) NULL,

    PRIMARY KEY (`f_username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_apptransactfile` ADD CONSTRAINT `tb_apptransactfile_f_appimageidrefno_fkey` FOREIGN KEY (`f_appimageidrefno`) REFERENCES `tb_apptransact`(`f_appidno`) ON DELETE RESTRICT ON UPDATE CASCADE;
