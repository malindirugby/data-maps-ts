export type KenyaCounty = | "Mombasa" | "Kwale" | "Kilifi" | "Tana River" | "Lamu" | "Taita-Taveta" | "Garissa" | "Wajir" | "Mandera" | "Marsabit" | "Isiolo" | "Meru" | "Tharaka-Nithi" | "Embu" | "Kitui" | "Machakos" | "Makueni" | "Nyandarua" | "Nyeri" | "Kirinyaga" | "Murang'a" | "Kiambu" | "Turkana" | "West Pokot" | "Samburu" | "Trans Nzoia" | "Uasin Gishu" | "Elgeyo-Marakwet"  | "Nandi" | "Baringo" | "Laikipia" | "Nakuru" | "Narok" | "Kajiado" | "Kericho" | "Bomet" | "Kakamega" | "Vihiga" | "Bungoma" | "Busia" | "Siaya" | "Kisumu" | "Homa Bay" | "Migori" | "Kisii" | "Nyamira" | "Nairobi";

export type CitizenId = string & {
  readonly __brand: "CitizenId";
};

export type IdentityReference = string & {
  readonly __brand: "IdentityReference";
};

export type VerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "UNDER_REVIEW";

export interface CitizenIdentity {
  readonly citizenId: CitizenId;
  readonly fullName: string;
  readonly dateOfBirth: string;
  readonly nationality: "KE";
  readonly identityReference: IdentityReference;
}

export interface CitizenAddress {
  readonly county: KenyaCounty;
  readonly constituency: string;
  readonly ward: string;
  readonly registrationCentreId: string;
}

export type ParentRelationship = {
  readonly type: "PARENT";
  readonly parentCitizenId: CitizenId;
  readonly relationshipVerificationId: string;
};

export type GuardianRelationship = {
  readonly type: "GUARDIAN";
  readonly guardianCitizenId: CitizenId;
  readonly relationshipVerificationId: string;
};

export type AlternativeVerification = {
  readonly type: "ALTERNATIVE_VERIFICATION";
  readonly caseReference: string;
  readonly approvingOfficerId: string;
};

export type CitizenRelationship = | ParentRelationship | GuardianRelationship | AlternativeVerification;

export interface Citizen {
  readonly identity: CitizenIdentity;
  readonly address: CitizenAddress;
  readonly relationships: readonly CitizenRelationship[];
  readonly verificationStatus: VerificationStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}