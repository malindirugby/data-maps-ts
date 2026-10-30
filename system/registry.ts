import { TicketSystem } from "@/tickets/project";

export const projects = {
    tickets: TicketSystem,
    users: [],
} as const;

export type ProjectId = keyof typeof projects;

export type AllProjects =
    typeof projects[ProjectId];

export const system = {
    name: "system data map",
    projects
} as const
