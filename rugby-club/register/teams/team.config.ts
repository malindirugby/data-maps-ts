import { TeamMembership } from "./membership.types";
import { TeamModules } from "./team.registry";
import "../../../user/user.registry";
import "../../../database/teams.registry"

/* hooks the team membership module onto the user config (should not list an array of teams but only teams the user is a member of) */
declare module "../../../user/user.registry" {
    interface UserModules {
        teamMemberShips: TeamMembership[];
    }
}

/* hooks all teams created onto a visible array that the user can join */
declare module "../../../database/teams.registry" {
    interface Teams {
        teams?: TeamEntries[];
    }
}

export type TeamEntries = TeamModules;


/* Calling TeamEntries will give an array of teams and not a single team */
const exampleTeamEntry: TeamEntries = {
    officeTeamMembers: [],
    fieldTeamMembers: []
}

/*
Suggested fix: module augmentation should use explicit public types instead of a
misleading alias.

import type { officeTeamMember } from "./office/office-team.types";
import type { FieldTeamMember } from "./field/field-team.types";

export interface TeamEntries {
    officeTeamMembers: officeTeamMember[];
    fieldTeamMembers: FieldTeamMember[];
}

export const exampleTeamEntry: TeamEntries = {
    officeTeamMembers: [],
    fieldTeamMembers: []
};

// TeamModules can then remain an empty augmentation registry, if that pattern
// is still useful for the rest of the application.
*/