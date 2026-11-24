import { FieldTeamMember } from "./field-team.types";
import "../team.registry"

declare module "../team.registry" {
    interface TeamModules {
        fieldTeamMembers: FieldTeamMember[];
    } 
}