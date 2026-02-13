const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;

export async function generateSalt(): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  return Array.from(salt)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function derivePasswordVerifier(
  username: string,
  password: string
): Promise<{ salt: string; verifier: string; key: CryptoKey }> {
  const salt = await generateSalt();
  const saltBuffer = new TextEncoder().encode(salt + username);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const keyBytes = await crypto.subtle.exportKey('raw', key);
  const verifier = Array.from(new Uint8Array(keyBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return { salt, verifier, key };
}

export async function verifyPassword(
  password: string,
  salt: string,
  expectedVerifier: string
): Promise<boolean> {
  try {
    const saltBuffer = new TextEncoder().encode(salt);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const keyBytes = await crypto.subtle.exportKey('raw', key);
    const verifier = Array.from(new Uint8Array(keyBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return verifier === expectedVerifier;
  } catch {
    return false;
  }
}

export async function importKeyFromVerifier(verifier: string): Promise<CryptoKey> {
  const keyBytes = new Uint8Array(
    verifier.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  );

  return crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}
