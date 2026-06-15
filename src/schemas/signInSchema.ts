import {z} from 'zod';

//identifier -> username, we are using here because in prod mostly we use this term identifier
export const signInSchmea = z.object({
    identifier: z.string(),
    password: z.string()
})