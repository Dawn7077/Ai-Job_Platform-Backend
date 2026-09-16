import { Job } from "../../domain/entities/Job.js";

export interface IGetJOBCompany{
    execute(companyId: string): Promise<{ 
    jobList: {
        id: string;
        companyId: string;
        title: string;
        jobType: "REMOTE" | "HYBRID" | "ONSITE";
        description: string;
        skills: string[];
        salaryMax: number;
        salaryMin: number;
        status: "OPEN" | "CLOSED";
        createdAt: Date;
        updatedAt: Date;
    }[];
}>
}

export interface IGetJOBTypeCompany{
    execute(companyId: string,jobType:"REMOTE"|"HYBRID"|"ONSITE"): Promise<{
     totalJobs: Job[];
    jobList: {
        id: string;
        companyId: string;
        title: string;
        jobType: "REMOTE" | "HYBRID" | "ONSITE";
        description: string;
        skills: string[];
        salaryMax: number;
        salaryMin: number;
        status: "OPEN" | "CLOSED";
        createdAt: Date;
        updatedAt: Date;
    }[];
}>
}