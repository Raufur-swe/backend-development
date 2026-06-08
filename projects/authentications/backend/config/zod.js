import { z } from "zod"


export const registrationSchema = z.object({
    name: z.string().min(2, "Name must be required for at last 4 carecter"),
    email: z.string().email("invalid email"),
    password: z.string().min(6, "invalid password , must be 6 carecter or more")
})