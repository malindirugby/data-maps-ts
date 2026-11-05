import type { Citizen } from "../types/citizen.types.ts";

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export function validateCitizenShape(
  citizen: Citizen
): ValidationResult {
  const errors: string[] = [];

  if (!citizen.identity.citizenId) {
    errors.push("Citizen ID is required.");
  }

  if (!citizen.identity.fullName.trim()) {
    errors.push("Full name is required.");
  }

  if (!citizen.identity.identityReference) {
    errors.push("Identity reference is required.");
  }

  if (citizen.identity.nationality !== "KE") {
    errors.push("Nationality must be verified independently.");
  }

  if (!citizen.address.registrationCentreId.trim()) {
    errors.push("Registration centre is required.");
  }

  if (!citizen.relationships.length) {
    errors.push(
      "A verified relationship or approved alternative verification is required."
    );
  }

  if (citizen.createdAt && Number.isNaN(Date.parse(citizen.createdAt))) {
    errors.push("Invalid creation timestamp.");
  }

  if (citizen.updatedAt && Number.isNaN(Date.parse(citizen.updatedAt))) {
    errors.push("Invalid update timestamp.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}