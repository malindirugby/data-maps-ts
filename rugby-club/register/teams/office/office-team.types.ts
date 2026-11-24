import { Country } from "../../../countries";
import { Position } from "./positions";
import { Team } from "../team.types";

export interface officeTeamMember {
    userId: string;
    name: string;
    teamId: Team['name'];
    nationality: Country;
    position: Position;
}