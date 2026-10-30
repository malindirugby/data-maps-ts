import type { ProjectDefinition, DatabaseDefinition, ServiceDefinition } from "./types";

export function defineProject< D extends string, S extends string, DB extends string >(
    project: {
        readonly name: string;
        readonly domain: D;
        readonly subdomain: readonly S[];
        readonly databases: Readonly<Record<DB, DatabaseDefinition>>;
        readonly services: readonly ServiceDefinition<S[number], DB>[];
    }
): ProjectDefinition<D, S[number], DB> {
    return project;

}