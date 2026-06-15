import {z} from 'zod'

export const acceptMessageSchmea = z.object({
    acceptMessage: z.boolean()
})