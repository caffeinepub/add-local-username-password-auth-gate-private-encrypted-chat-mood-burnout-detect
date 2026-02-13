export interface EncryptedMessage {
  ciphertext: string;
  iv: string;
}

export async function encryptMessage(
  message: string,
  key: CryptoKey
): Promise<EncryptedMessage> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedMessage = new TextEncoder().encode(message);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedMessage
  );

  return {
    ciphertext: Array.from(new Uint8Array(ciphertext))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(''),
    iv: Array.from(iv)
      .map(b => b.toString(16).padStart(2, '0'))
      .join(''),
  };
}

export async function decryptMessage(
  encrypted: EncryptedMessage,
  key: CryptoKey
): Promise<string | null> {
  try {
    const ciphertext = new Uint8Array(
      encrypted.ciphertext.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );
    const iv = new Uint8Array(
      encrypted.iv.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}

export function parseEncryptedMessage(text: string): EncryptedMessage | null {
  try {
    const parsed = JSON.parse(text);
    if (parsed.ciphertext && parsed.iv) {
      return parsed as EncryptedMessage;
    }
    return null;
  } catch {
    return null;
  }
}

export function serializeEncryptedMessage(encrypted: EncryptedMessage): string {
  return JSON.stringify(encrypted);
}

export function encryptedMessageToBytes(encrypted: EncryptedMessage): Uint8Array {
  const serialized = serializeEncryptedMessage(encrypted);
  return new TextEncoder().encode(serialized);
}

export function bytesToEncryptedMessage(bytes: Uint8Array): EncryptedMessage | null {
  try {
    const text = new TextDecoder().decode(bytes);
    return parseEncryptedMessage(text);
  } catch {
    return null;
  }
}
