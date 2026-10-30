export interface DatabaseDefinition {
    readonly name: string;
    readonly engine: "postgres" | "mysql" | "sqlite" | "mssql" | "oracle" | "mongodb" | "cassandra" | "redis" | "dynamodb" | "firebase" | "couchdb" | "neo4j" | "elasticsearch" | "other";
    readonly purpose: string;
}

export interface ServiceDefinition< S extends string, DB extends string > {
    readonly name: string;
    readonly subdomain: S;
    readonly database: readonly DB[];
    readonly reads: readonly string[];
    readonly writes: readonly string[];
}

export interface ProjectDefinition< D extends string, S extends string, DB extends string > {
    readonly name: string;
    readonly domain: D;
    readonly subdomain: readonly S[];    
    readonly databases: Readonly<Record<DB, DatabaseDefinition>>;
    readonly services: readonly ServiceDefinition<S, DB>[];
}