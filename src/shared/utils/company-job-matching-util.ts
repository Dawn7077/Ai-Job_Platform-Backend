import { CandidateProfile } from '../../domain/entities/candidate-profile.entity';
import { Job } from '../../domain/entities/job.entity';
import { calculateTotalExperienceYears } from './calculate-total-year-exp.utils';

export const calculateCandidateJobMatchScore = (
  candidateProfile: CandidateProfile,
  job: Job
) => {
  let totalScore = 0;
  const profileData = candidateProfile.toJSON();
  const jobData = job.toJSON();
  if (jobData.skills?.length > 0) {
    const jobSkillsLower = jobData.skills.map((s) => s.toLowerCase());
    if (!profileData.skills || profileData.skills.length === 0) {
      return totalScore;
    }
    const candidateSkillsLower = profileData.skills.map((s) => s.toLowerCase());

    const matchedSkills = jobSkillsLower.filter((s) =>
      candidateSkillsLower.includes(s)
    ).length;

    const skillRatio = matchedSkills / jobSkillsLower.length;

    totalScore += skillRatio * 40;
  } else {
    totalScore += 40;
  }

  const minExp = jobData.experienceMin || 0;
  const maxExp = jobData.experienceMax || 0;

  let candidateExp = calculateTotalExperienceYears(
    profileData.experience || []
  );
  if (!candidateExp) candidateExp = 0;

  if (minExp === 0) {
    totalScore += 20;
  } else if (candidateExp >= minExp) {
    totalScore += 20;
  } else {
    const expRatio = Math.max(0, candidateExp / minExp);
    totalScore += expRatio * 20;
  }

  const techScoreAvg = profileData.internalTechScoreAvg || 0;
  const techRatio = Math.min(5, Math.max(0, techScoreAvg)) / 5;
  totalScore += techRatio * 20;

  const cultureScoreAvg = profileData.internalCultureScoreAvg || 0;
  const cultureRatio = Math.min(5, Math.max(0, cultureScoreAvg)) / 5;
  totalScore += cultureRatio * 10;

  const endorsementCount = profileData.endorsementCount || 0;
  const endorsementCap = 5;
  const endorsementRatio = Math.min(1, endorsementCount / endorsementCap);
  totalScore += endorsementRatio * 10;

  return Math.min(100, Math.max(0, Math.round(totalScore * 100) / 100));
};
