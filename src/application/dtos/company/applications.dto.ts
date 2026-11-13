import { z } from 'zod';

export const GetCompanyApplicationsSchema = z.object({
  // status:z.enum(['APPLIED',"SCREENING","SHORTLISTED","INTERVIEW","OFFER","HIRED","REJECTED","WITHDRAWN",])
  companyId: z.string().min(1, 'Company Id is required'),
});

export type GetCompanyApplicationsRequestDTO = z.infer<
  typeof GetCompanyApplicationsSchema
>;

// by jobID
export const C_GetApplicationsByJobIDSchema = z.object({
  status: z.enum([
    'APPLIED',
    'SCREENING',
    'SHORTLISTED',
    'INTERVIEW',
    'OFFER',
    'HIRED',
    'REJECTED',
    'WITHDRAWN',
  ]),
});
export type C_GetApplicationsByJobIDRequestDTO = z.infer<
  typeof C_GetApplicationsByJobIDSchema
>;
