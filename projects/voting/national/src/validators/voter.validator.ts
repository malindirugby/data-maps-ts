import { z } from "zod";

const countyValues = [ "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi", ] as const;

const opaqueIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const voterRegistrationSchema = z
  .object({
    citizenId: z.string().uuid(),
    registrationCentreId: opaqueIdSchema,
    county: z.enum(countyValues),
  })
  .strict();

export const createCitizenSchema = z
  .object({
    fullName: z.string().trim().min(2).max(200),
    dateOfBirth: z.iso.date(),
    identityReference: opaqueIdSchema,
  })
  .strict();

export const electionAuthorizationSchema = z
  .object({
    electionId: z.string().uuid(),
    voterCardId: z.string().uuid(),
  })
  .strict();

export const citizenRelationshipSchema = z.discriminatedUnion(
  "type",
  [
    z
      .object({
        type: z.literal("PARENT"),
        parentCitizenId: z.string().uuid(),
        relationshipVerificationId: opaqueIdSchema,
      })
      .strict(),

    z
      .object({
        type: z.literal("GUARDIAN"),
        guardianCitizenId: z.string().uuid(),
        relationshipVerificationId: opaqueIdSchema,
      })
      .strict(),

    z
      .object({
        type: z.literal("ALTERNATIVE_VERIFICATION"),
        caseReference: opaqueIdSchema,
      })
      .strict(),
  ]
);

export type ValidatedVoterRegistrationRequest =
  z.infer<typeof voterRegistrationSchema>;

export type ValidatedCreateCitizenRequest =
  z.infer<typeof createCitizenSchema>;

export type ValidatedElectionAuthorizationRequest =
  z.infer<typeof electionAuthorizationSchema>;

export type ValidatedCitizenRelationship =
  z.infer<typeof citizenRelationshipSchema>;

export function validateVoterRegistrationRequest(
  input: unknown
): ValidatedVoterRegistrationRequest {
  return voterRegistrationSchema.parse(input);
}

export function validateCreateCitizenRequest(
  input: unknown
): ValidatedCreateCitizenRequest {
  return createCitizenSchema.parse(input);
}

export function validateElectionAuthorizationRequest(
  input: unknown
): ValidatedElectionAuthorizationRequest {
  return electionAuthorizationSchema.parse(input);
}

export function validateCitizenRelationship(
  input: unknown
): ValidatedCitizenRelationship {
  return citizenRelationshipSchema.parse(input);
}