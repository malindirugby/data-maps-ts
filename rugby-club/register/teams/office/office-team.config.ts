
import { officeTeamMember } from "./office-team.types";
import "../team.registry"

declare module "../team.registry" {
    interface TeamModules {
        officeTeamMembers: officeTeamMember[];
    } 
}