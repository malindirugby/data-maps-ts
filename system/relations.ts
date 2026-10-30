import { ProjectId } from "./registry";

export type systemRelationship = {
    readonly from: {
        readonly project: ProjectId;
        readonly service: string;        
    };
    readonly to: {
        readonly project: ProjectId;
        readonly service: string;
    };
    readonly kind: "api" | "event" | "shared-identity" | "data-sync";
    readonly description?: string;
}

export const relationships = [
    {
        from: {
            project: "tickets",
            service: "ticket-service"
        },
        to: {
            project: "users",
            service: "user-service"
        },
        kind: "api",
        description: "The ticket-service communicates with the user-service to retrieve user information for tickets."
    }
] as const satisfies readonly systemRelationship[];