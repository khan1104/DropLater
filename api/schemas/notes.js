import z from "zod";


export const noteSchema=z.object({
    title: z.string(),
    body: z.string(),
    releaseAt: z.string(),
    webhookUrl: z.string()
})
