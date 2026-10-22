-- CreateTable
CREATE TABLE `mock_interview_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `candidate_id` VARCHAR(191) NOT NULL,
    `job_id` VARCHAR(191) NULL,
    `type` ENUM('BEHAVIOUR', 'TECHNICAL', 'SYSTEM_DESIGN') NOT NULL DEFAULT 'BEHAVIOUR',
    `target_role` VARCHAR(191) NOT NULL,
    `status` ENUM('IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'IN_PROGRESS',
    `transcript` JSON NOT NULL,
    `feedback` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mock_interview_sessions` ADD CONSTRAINT `mock_interview_sessions_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
