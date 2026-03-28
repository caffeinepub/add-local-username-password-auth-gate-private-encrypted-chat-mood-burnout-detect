const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;

// Utility functions to convert between Uint8Array and hex strings
function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToUint8Array(hex: string): Uint8Array {
  const matches = hex.match(/.{1,2}/g);
  if (!matches) return new Uint8Array(0);
  return new Uint8Array(matches.map((byte) => Number.parseInt(byte, 16)));
}

export async function generateSalt(): Promise<Uint8Array> {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

export async function derivePasswordVerifier(
  username: string,
  password: string,
): Promise<{ salt: string; verifier: string; key: CryptoKey }> {
  const saltBytes = await generateSalt();
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password + username);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordData,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"],
  );

  const verifierBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBytes as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );

  return {
    salt: uint8ArrayToHex(saltBytes),
    verifier: uint8ArrayToHex(new Uint8Array(verifierBits)),
    key,
  };
}

export async function verifyPassword(
  password: string,
  saltHex: string,
  storedVerifierHex: string,
): Promise<boolean> {
  const salt = hexToUint8Array(saltHex);
  const storedVerifier = hexToUint8Array(storedVerifierHex);

  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordData,
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const verifierBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  const computedVerifier = new Uint8Array(verifierBits);

  if (computedVerifier.length !== storedVerifier.length) {
    return false;
  }

  let isMatch = true;
  for (let i = 0; i < computedVerifier.length; i++) {
    if (computedVerifier[i] !== storedVerifier[i]) {
      isMatch = false;
    }
  }

  return isMatch;
}

export async function generateEncryptionKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function deriveEncryptionKey(
  password: string,
  saltHex: string,
): Promise<CryptoKey> {
  const salt = hexToUint8Array(saltHex);
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordData,
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
