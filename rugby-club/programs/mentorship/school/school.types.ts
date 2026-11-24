import { Programs } from "../../program.types";
import { SessionFrequency } from "../../session";
import { subscriptionTier } from "../../tiers";
import { SchoolCategory } from "./category";
import { SchoolGradeLevel } from "./level";
import { RegistrationStatus } from "./status";

/* School details  */
export interface SchoolProfile {
  id: string;
  name: string;
  category: SchoolCategory;
  schoolType: 'public' | 'private' | 'charter' | 'international';
  address: Address;
  facilityDetails: {
    hasOwnPitch: boolean;
    pitchSurfaceType?: 'grass' | 'turf' | 'indoor_hall';
    hasFloodlights: boolean;
    changingRoomsAvailable: boolean;
  };
}

/* school address */
export interface Address {
  street: string;
  city: string;
  countyOrState: string;
  postalCode: string;
}

/* Contact personnel do not have to be directly associated/registered with the club */
export interface ContactPerson {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  role: string; // e.g., "Games Master", "Head of Sports", "Principal"
}


/* Program & Grade Selection */
export interface ClassRegistration {
  gradeLevel: SchoolGradeLevel;
  estimatedStudentCount: number; /* estimate number of students that would be in the program */
  genderCategory: 'boys' | 'girls' | 'mixed';
}

export interface CoachingRequirements {
  focusAreas: ( | 'fundamentals' | 'tackling_safety' | 'scrum_lineout' | 's&c' | 'sevens' | 'tactics' )[];
  coachesRequestedCount?: number;
  coachingLevelRequired?: 'level_1' | 'level_2';
  equipmentProvidedBySchool: boolean; // e.g., balls, cones, bibs
}


// --- MAIN REGISTRATION PAYLOAD ---
export interface schoolRegistration {
  id: string;
  registrationNumber: string;
  schoolDetails: SchoolProfile;
  contacts: ContactPerson[];

  // Program & Grade Selection
  programTier: subscriptionTier;
  sessionFrequency: SessionFrequency;
  class: ClassRegistration[];
  requirements: CoachingRequirements;
  
  // Logistics & Schedule
  proposedStartDate: string; // ISO 8601 YYYY-MM-DD
  proposedEndDate: string;
  totalWeeks: number;
  
  // Status
  status: RegistrationStatus;

  // Legal & Compliance
  termsAccepted: boolean;
  termsAcceptedAt: string; // ISO timestamp
  medicalDisclaimerSigned: boolean;
  specialNotesOrRequests?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}


// --- API REQUEST / RESPONSE UTILITIES ---

export type CreateRegistrationDTO = Omit< schoolRegistration, 'id' | 'registrationNumber' | 'status' | 'createdAt' | 'updatedAt' >;

export type UpdateRegistrationStatusDTO = Pick<schoolRegistration, 'id' | 'status' > & { 
  reviewerNotes?: string;
};