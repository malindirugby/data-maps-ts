export interface EntityDefinition<DB extends string, Table extends string> {
    readonly name: string;
    readonly database: DB;
    readonly table: Table;
    readonly fields: readonly string[];
}

export interface DataFlor<Entity extends string, Service extends string> {
    readonly entity: Entity;
    readonly service: Service;
    readonly operation: "read" | "write";
}