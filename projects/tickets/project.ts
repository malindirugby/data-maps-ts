import { defineProject } from "@core/projects";

export const TicketSystem = defineProject({
    name: "Ticket System",
    domain: "tickets.com",

    subdomain: ["api", "admin"],

    databases: {},
    
    services: [
        {
            name: "Ticket Service",
            subdomain: "api",
            database: [],
            reads: [],
            writes: []
        },
        {
            name: "Admin Service",
            subdomain: "admin",
            database: [],
            reads: [],
            writes: []
        }
    ]
} as const);