import { UserModules } from './user.registry';
import type { User } from './user.types';

export type AuthenticatedUser = User & {
    config: UserModules;
};