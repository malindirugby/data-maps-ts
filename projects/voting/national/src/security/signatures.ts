import {
  createPrivateKey,
  createPublicKey,
  sign,
  verify,
  type KeyObject,
} from "node:crypto";

export interface SignedAssertion<T> {
  readonly issuer: string;
  readonly issuedAt: string;
  readonly expiresAt: string;
  readonly assertionId: string;
  readonly payload: T;
  readonly signature: string;
}

export interface VerificationResult {
  readonly valid: boolean;
  readonly reason?: string;
}

function canonicalize(value: unknown): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value);
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("Non-finite numbers cannot be signed.");
    }

    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }

  if (typeof value === "object") {
    const object = value as Record<string, unknown>;

    const keys = Object.keys(object).sort();

    return `{${keys
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalize(object[key])}`
      )
      .join(",")}}`;
  }

  throw new Error("Unsupported value in signed assertion.");
}

function assertionContent<T>(
  assertion: Omit<SignedAssertion<T>, "signature">
): string {
  return canonicalize(assertion);
}

export class AssertionSigner {
  private readonly privateKey: KeyObject;
  private readonly publicKey: KeyObject;

  constructor(
    privateKeyPem: string,
    publicKeyPem: string,
    private readonly issuer: string
  ) {
    this.privateKey = createPrivateKey(privateKeyPem);
    this.publicKey = createPublicKey(publicKeyPem);

    if (this.privateKey.asymmetricKeyType !== "ed25519") {
      throw new Error("Expected an Ed25519 private key.");
    }

    if (this.publicKey.asymmetricKeyType !== "ed25519") {
      throw new Error("Expected an Ed25519 public key.");
    }

    if (!issuer.trim()) {
      throw new Error("A signing issuer is required.");
    }
  }

  signAssertion<T>(
    payload: T,
    lifetimeSeconds = 300
  ): SignedAssertion<T> {
    if (
      !Number.isInteger(lifetimeSeconds) ||
      lifetimeSeconds < 1 ||
      lifetimeSeconds > 3600
    ) {
      throw new Error("Invalid assertion lifetime.");
    }

    const now = Date.now();

    const unsignedAssertion = {
      issuer: this.issuer,
      issuedAt: new Date(now).toISOString(),
      expiresAt: new Date(
        now + lifetimeSeconds * 1000
      ).toISOString(),
      assertionId: crypto.randomUUID(),
      payload,
    };

    const content = assertionContent(unsignedAssertion);

    const signature = sign(
      null,
      Buffer.from(content, "utf8"),
      this.privateKey
    ).toString("base64url");

    return {
      ...unsignedAssertion,
      signature,
    };
  }

  verifyAssertion<T>(
    assertion: SignedAssertion<T>
  ): VerificationResult {
    try {
      if (assertion.issuer !== this.issuer) {
        return {
          valid: false,
          reason: "Unexpected assertion issuer.",
        };
      }

      if (!assertion.assertionId.trim()) {
        return {
          valid: false,
          reason: "Missing assertion ID.",
        };
      }

      const issuedAt = Date.parse(assertion.issuedAt);
      const expiresAt = Date.parse(assertion.expiresAt);
      const now = Date.now();

      if (
        !Number.isFinite(issuedAt) ||
        !Number.isFinite(expiresAt) ||
        expiresAt <= issuedAt
      ) {
        return {
          valid: false,
          reason: "Invalid assertion timestamps.",
        };
      }

      // Allow a small clock skew for distributed systems.
      const clockSkewMs = 30_000;

      if (issuedAt > now + clockSkewMs) {
        return {
          valid: false,
          reason: "Assertion was issued in the future.",
        };
      }

      if (now >= expiresAt) {
        return {
          valid: false,
          reason: "Assertion has expired.",
        };
      }

      const { signature: suppliedSignature, ...unsigned } =
        assertion;

      const content = assertionContent(unsigned);

      const signatureBytes = Buffer.from(
        suppliedSignature,
        "base64url"
      );

      // Ed25519 signatures are 64 bytes.
      if (signatureBytes.length !== 64) {
        return {
          valid: false,
          reason: "Invalid signature encoding.",
        };
      }

      const valid = verify(
        null,
        Buffer.from(content, "utf8"),
        this.publicKey,
        signatureBytes
      );

      return valid
        ? { valid: true }
        : {
            valid: false,
            reason: "Signature verification failed.",
          };
    } catch {
      return {
        valid: false,
        reason: "Malformed or unsupported assertion.",
      };
    }
  }
}