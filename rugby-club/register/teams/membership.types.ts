import { Team } from "./team.types";

export type TeamRole = "owner" | "admin" | "member";

export type membershipStatus = | "pending" | "active" | "suspended" | "rejected";

export type TeamMembership =
    | TeamMembershipBase & { team: undefined }
    | TeamMembershipBase & { team: Team };

export interface TeamMembershipBase{
    id: string;

    userId: string;
    teamId: string;

    role: TeamRole;
    status: membershipStatus;

    joinedAt?: string;
    invitedAt?: string;

    /* sometimes the database will retun just the membership record while other times it will return the membership alongside the populated team */
    team?: Team;
}



const exmpleTeamMembership: TeamMembership = {
    id: "",
    /* User id generated from team membership */
    userId: "",

    teamId: "",
    role: "member",
    status: "active",
    joinedAt: "",
    invitedAt: "",

    /* Team details  */
    team: {
        id: "",
        name: "",
        description: "",
        createdAt: "",
    }
}