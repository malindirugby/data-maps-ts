import { FieldTeamMember } from '../field/field-team.types';
import type { Country } from '../../../countries';

export interface Player {
    teamId: FieldTeamMember['teamId'];
    nationality: Country;
    height: number;
    weight: number;
}
