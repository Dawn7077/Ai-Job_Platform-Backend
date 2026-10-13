import { z } from 'zod'

export const JobBase = { 
    title:z.string().min(3,'Job Title must be atleast 3 characters'),
    jobType:z.enum(["REMOTE","HYBRID","ONSITE"]),
    description:z.string().min(10,'descriptionmust be atleast 10 characters'),
    skills:z.array(z.string()).min(1,'At least one skill is required'),
    salaryMax:z.number().nonnegative('Maximum salary cannot be negative'),
    salaryMin:z.number().nonnegative('Minimum salary cannot be negative')
}


export const CreateJobSchema =z.object(JobBase).refine((data)=> data.salaryMax >= data.salaryMin,{
    message:'Maximum salary must be greater than or equal to minimum salary',
    path:['salaryMax'],
})

export type CreateJobRequestDTO = z.infer<typeof CreateJobSchema>


export const UpdateJobSchema = z.object(JobBase).partial().extend({   
    status:z.enum(["OPEN","CLOSED"]).optional(), 
}).refine((data)=>{
    if(data.salaryMax !== undefined && data.salaryMin !== undefined){
        return data.salaryMax >= data.salaryMin
    }
    return true
},{
    message:'Maximum salary must be greater than or equal to minimum salary',
    path:['salaryMax'],
})

export type UpdateJobRequestDTO = z.infer<typeof UpdateJobSchema>
