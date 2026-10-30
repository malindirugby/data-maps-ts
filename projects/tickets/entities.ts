import { EntityDefinition } from "@core/data-types";
import  { requiredTypes }  from "./types";

export const TicketEntities = {
        Ticket: {
            name: "ticket",
            database: "tickets-db",
            table: "tickets",
            fields: {} as requiredTypes["Ticket"]
        },
        User: {
            name: "user",
            database: "users-db",
            table: "users",
            fields: {} as requiredTypes["User"]
        },
        Order: {
           name: "order",
            database: "orders-db",
            table: "orders",
            fields: {} as requiredTypes["Order"]
        }
    } as const satisfies Record<string, EntityDefinition<string, string>>;