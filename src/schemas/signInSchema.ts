import {z} from 'zod';

//identifier -> username, we are using here because in prod mostly we use this term identifier
export const signInSchema = z.object({
    identifier: z.string().min(3, "Username/Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})