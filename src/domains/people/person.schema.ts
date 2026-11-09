import { z } from "zod";

/** Validates person input and applies the default active status. */
export const personSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  dateOfBirth: z.string().optional(),
  isActive: z.boolean().default(true),
});

/** Infers the person data type from its validation schema. */
export type Person = z.infer<typeof personSchema>;
