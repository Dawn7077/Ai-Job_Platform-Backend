import { ExperienceItem } from '../../domain/entities/candidate-profile.entity';

export const calculateTotalExperienceYears = (experience: ExperienceItem[]) => {
  if (!experience || experience.length === 0) {
    return 0;
  }
  let totalYears = 0;
  for (const item of experience) {
    const startDate = new Date(item.startDate);
    const endDate =
      !item.endDate || item.endDate === 'present'
        ? new Date()
        : new Date(item.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) continue;

    const diffInMs = endDate.getTime() - startDate.getTime();
    const year = diffInMs / (1000 * 60 * 60 * 24 * 365.25);

    if (year > 0) {
      totalYears += year;
    }
  }
  if (totalYears < 0.1) return 0;
  return Math.round(totalYears * 10) / 10;
};
