export type SystemRole =
  | "CITIZEN"
  | "REGISTRATION_OFFICER"
  | "IDENTITY_VERIFIER"
  | "RELATIONSHIP_VERIFIER"
  | "ELECTION_OFFICER"
  | "AUDITOR"
  | "SYSTEM_ADMIN";

export type Permission =
  | "citizen:read:own"
  | "citizen:read:any"
  | "citizen:create"
  | "citizen:verify"
  | "relationship:verify"
  | "relationship:approve:alternative"
  | "voter:register"
  | "voter:read"
  | "voter:suspend"
  | "election:read"
  | "election:manage"
  | "voter:authorize"
  | "audit:read"
  | "access:manage";

const rolePermissions: Record<
  SystemRole,
  ReadonlySet<Permission>
> = {
  CITIZEN: new Set([
    "citizen:read:own",
  ]),

  REGISTRATION_OFFICER: new Set([
    "citizen:read:any",
    "citizen:create",
    "voter:register",
    "voter:read",
  ]),

  IDENTITY_VERIFIER: new Set([
    "citizen:read:any",
    "citizen:verify",
  ]),

  RELATIONSHIP_VERIFIER: new Set([
    "citizen:read:any",
    "relationship:verify",
  ]),

  ELECTION_OFFICER: new Set([
    "citizen:read:any",
    "voter:read",
    "election:read",
    "voter:authorize",
  ]),

  AUDITOR: new Set([
    "audit:read",
    "citizen:read:any",
    "voter:read",
    "election:read",
  ]),

  SYSTEM_ADMIN: new Set([
    "access:manage",
    "election:manage",
    "election:read",
    "audit:read",
  ]),
};

export interface AuthenticatedPrincipal {
  readonly userId: string;
  readonly roles: readonly SystemRole[];
  readonly active: boolean;
  readonly authenticatedAt: string;
}

export class AuthorizationError extends Error {
  constructor(message = "Access denied.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function hasPermission(
  principal: AuthenticatedPrincipal,
  permission: Permission
): boolean {
  if (!principal.active) {
    return false;
  }

  return principal.roles.some((role) =>
    rolePermissions[role].has(permission)
  );
}

export function requirePermission(
  principal: AuthenticatedPrincipal,
  permission: Permission
): void {
  if (!hasPermission(principal, permission)) {
    throw new AuthorizationError(
      `Permission required: ${permission}`
    );
  }
}

export function requireAnyPermission(
  principal: AuthenticatedPrincipal,
  permissions: readonly Permission[]
): void {
  const allowed = permissions.some((permission) =>
    hasPermission(principal, permission)
  );

  if (!allowed) {
    throw new AuthorizationError(
      "None of the required permissions are granted."
    );
  }
}

export function requireSelfOrPermission(
  principal: AuthenticatedPrincipal,
  targetUserId: string,
  permission: Permission
): void {
  if (principal.userId === targetUserId) {
    return;
  }

  requirePermission(principal, permission);
}

export function requireSeparateApprover(
  requesterId: string,
  approver: AuthenticatedPrincipal,
  permission: Permission
): void {
  if (requesterId === approver.userId) {
    throw new AuthorizationError(
      "A requester cannot approve their own request."
    );
  }

  requirePermission(approver, permission);
}