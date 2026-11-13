import { CandidateProfile } from '../../../domain/entities/candidate-profile.entity';
import { Job } from '../../../domain/entities/job.entity';

export const JobMatchAiAnalysisPrompt = (
  job: Job,
  candidateProfile: CandidateProfile,
  feedbackTags: string[],
  reviewText: string,
  jobMatchScore: number,
  companyData: {
    companyName: string;
    averageRating: number;
    cultureScoreAvg: number;
    totalReviewCount: number;
  }
) => `
    You are an expert Ai Career Coach and workplace analyst.
        Analyse the candidate's profile against the job posting and past company insights to provide 
        personalized evaluations.

        Candidate Skills:${JSON.stringify(candidateProfile.skills)}
        Candidate Experience:${JSON.stringify(candidateProfile.experience)}

        Job Title: ${job.title}
        Job description: ${job.description}
        Job Required Skills: ${job.skills}

        Recent past 5 Company Peer reviews & insights:" ${reviewText || 'No reviews available yet.'}"
        Common Company Feedback tags: ${JSON.stringify(feedbackTags)}
        Company Internal calculated metrics: ${JSON.stringify(companyData)}
        Calculated internal system assesment Match Score:${jobMatchScore}

        Return ONLY a JSON object strictly matching this format (no markdown formatting or extra prose):
        {
            "analysisNote":"A comprehensive coaching breif explaining why this job fits the candidate, how to improve skill gaps, and an honest assessment of whether the company is good to work for based on past reviews and data."
            "strengths":["string"],
            "skillGaps":["string"],
            "interviewExpectations":["string"],
            "companyCultureAnalysis":"String analyzing work-life balance, culture, and whether it's good place based on employee reviews",
            "estimatedAcceptanceProbality":75
        }
`;
