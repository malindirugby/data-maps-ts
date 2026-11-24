import { Teams } from "./teams.registry";

export type CreatedTeams = Teams;

const exampleTeams: CreatedTeams = {
    teams: [
        {
            officeTeamMembers: [
                {
                    userId: "",
                    name: "",
                    teamId: "",
                    nationality: "Kenya",
                    position: "Administrator",
                }
            ],
            fieldTeamMembers: [
                {
                    teamId: "",
                    nationality: "Kenya",
                    position: "Coach"
                }
            ]
        }
    ]
}