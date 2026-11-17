import { UserDetail } from "./profile.types";
import "../user.registry"

declare module "../user.registry" {
    interface UserModules {
    userProfile?: UserDetail;
    }
}