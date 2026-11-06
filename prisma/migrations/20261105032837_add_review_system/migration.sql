-- AlterTable
ALTER TABLE `candidate_profiles` ADD COLUMN `endorsement_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `internal_comm_score` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `internal_culture_score` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `internal_tech_score` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `company_profiles` ADD COLUMN `average_rating` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `communication_score_avg` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `culture_score_avg` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `internal_score_avg` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `total_review_count` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `company_review` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `candidate_id` VARCHAR(191) NOT NULL,
    `overall_rating` DOUBLE NOT NULL,
    `interview_rating` DOUBLE NOT NULL,
    `culture_rating` DOUBLE NOT NULL,
    `communication_rating` DOUBLE NOT NULL,
    `tags` JSON NULL,
    `review_text` TEXT NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL,

    INDEX `company_review_company_id_idx`(`company_id`),
    UNIQUE INDEX `company_review_company_id_candidate_id_key`(`company_id`, `candidate_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `candidate_review` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `candidate_id` VARCHAR(191) NOT NULL,
    `technical_score` DOUBLE NOT NULL,
    `culture_score` DOUBLE NOT NULL,
    `communication_score` DOUBLE NOT NULL,
    `is_endorsed` BOOLEAN NOT NULL DEFAULT false,
    `comment` VARCHAR(191) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL,

    INDEX `candidate_review_candidate_id_idx`(`candidate_id`),
    UNIQUE INDEX `candidate_review_company_id_candidate_id_key`(`company_id`, `candidate_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `company_review` ADD CONSTRAINT `company_review_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_review` ADD CONSTRAINT `company_review_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidate_review` ADD CONSTRAINT `candidate_review_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidate_review` ADD CONSTRAINT `candidate_review_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
