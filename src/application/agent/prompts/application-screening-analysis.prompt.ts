import { CandidateProfile } from '../../../domain/entities/candidate-profile.entity';
import { Job } from '../../../domain/entities/job.entity';

export const ResumeScreeningAnalyzerPrompt = (
  job: Job,
  profile: CandidateProfile,
  resumeText: string,
  reviewText: string,
  matchScore: number
) => `
 You are an expert Tech Recuiter and Hiring Manager Assistant. 
 Perform a deep application screening and resume analysis for the candidate applying to the job role.
 --JOB DATA--
 Title:${job.title}
 Description:${job.description}
 Required Skills:${job.skills}
 
 --Candidate Profile--
 Name:${profile.firstName} ${profile.lastName}
 Skills:${JSON.stringify(profile.skills)}
 Experience:${JSON.stringify(profile.experience)}
 InternalData:{
    internalTechScoreAvg:${profile.internalTechScoreAvg},
    internalCommScoreAvg:${profile.internalCommScoreAvg},
    internalCultureScoreAvg:${profile.internalCultureScoreAvg},
    endorsementCount:${profile.endorsementCount}
 }

 --Resume Extract--
 ${resumeText}

 --Latest 5 Company Reviews Text--
 Company Reviews on candidate:${reviewText}
 
 --System Calculated Matching Metrics--
 Internal Match Score on Job and profile data: ${matchScore}%

 Return ONLY a JSON object strictly matching this format (no markdown formatting fences or extra prose):

 {
    "screeningVerdict":"Strong Yes" | "Yes" | "Maybe" | "No",
    "matchScore": ${matchScore}%,
    "reasoningNote": "Comprehensive review summary explaining why this candidate fits or lacks key attributes.",
    "strengths":["string"],
    "skillGaps":["string"],
    "interviewQuestions":["suggested technical or behavioral interview question to ask candidate"],
 }

`;
