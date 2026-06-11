-- CreateTable
CREATE TABLE `users` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'petugas') NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_nip_key`(`nip`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `area_parkir` (
    `id_area` INTEGER NOT NULL AUTO_INCREMENT,
    `name_area` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `kapasitas_total` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_area`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_parkir_logs` (
    `id_log` INTEGER NOT NULL AUTO_INCREMENT,
    `id_area` INTEGER NOT NULL,
    `jenis_kendaraan` VARCHAR(191) NOT NULL,
    `waktu_masuk` DATETIME(3) NOT NULL,
    `waktu_keluar` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_log`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `violation_reports` (
    `id_reports` INTEGER NOT NULL AUTO_INCREMENT,
    `photo` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_reports`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `log_parkir_logs` ADD CONSTRAINT `log_parkir_logs_id_area_fkey` FOREIGN KEY (`id_area`) REFERENCES `area_parkir`(`id_area`) ON DELETE RESTRICT ON UPDATE CASCADE;
