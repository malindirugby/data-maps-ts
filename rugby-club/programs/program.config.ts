import { ProgramModules } from "./program.registry";
import type { Programs } from "./program.types";
import "../../user/user.registry";

declare module "../../user/user.registry" {
    interface UserModules {
        programs: ProgramEntries[];
    }
}

export type ProgramEntries = ProgramModules;
