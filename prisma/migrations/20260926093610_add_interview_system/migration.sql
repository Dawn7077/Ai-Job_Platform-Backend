-- CreateTable
CREATE TABLE `interviews` (
    `id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `candidate_id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `room_key` VARCHAR(191) NOT NULL,
    `scheduled_at` DATETIME(3) NOT NULL,
    `status` ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `interviews_room_key_key`(`room_key`),
    INDEX `interviews_room_key_idx`(`room_key`),
    INDEX `interviews_company_id_scheduled_at_idx`(`company_id`, `scheduled_at`),
    INDEX `interviews_candidate_id_scheduled_at_idx`(`candidate_id`, `scheduled_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Interview_evaluations` (
    `id` VARCHAR(191) NOT NULL,
    `interview_id` VARCHAR(191) NOT NULL,
    `technical_score` INTEGER NOT NULL,
    `communication_score` INTEGER NOT NULL,
    `problem_solving_score` INTEGER NOT NULL,
    `notes` TEXT NOT NULL,
    `decision` ENUM('HIRED', 'REJECTED', 'NEXT_ROUND', 'PENDING') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Interview_evaluations_interview_id_key`(`interview_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `interviews` ADD CONSTRAINT `interviews_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interviews` ADD CONSTRAINT `interviews_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interviews` ADD CONSTRAINT `interviews_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interview_evaluations` ADD CONSTRAINT `Interview_evaluations_interview_id_fkey` FOREIGN KEY (`interview_id`) REFERENCES `interviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
