import { ProgramModules } from "../../program.registry";
import type { schoolRegistration } from "./school.types";

declare module "../../program.registry" {
    interface ProgramModules {
        schools: schoolRegistration[];
    } 
}
