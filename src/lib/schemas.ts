import { z } from "zod"

export const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),

  date: z.string().refine(
    (value) => !Number.isNaN(new Date(value).getTime()) && new Date(value) > new Date(),
    "Event date must be in the future"
  ),

  location: z.string().min(3),

  category: z.string().min(3),

  organizer: z.string().min(3),

  posterUrl: z.string().min(1, "Poster is required")
})

export type EventInput = z.infer<typeof eventSchema>
