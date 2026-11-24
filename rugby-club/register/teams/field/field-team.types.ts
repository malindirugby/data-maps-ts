import { Country } from "../../../countries";
import { Team } from "../team.types";
import { Position } from "./positions";

export interface FieldTeamMember {
    teamId: Team['id'] | Team['name'];
    nationality?: Country;
    position: Position;
}