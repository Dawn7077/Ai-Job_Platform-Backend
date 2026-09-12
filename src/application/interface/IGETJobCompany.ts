export interface IGetJOBCompany{
    execute(companyId: string):Promise<{
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
}[]>
}