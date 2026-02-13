export interface PasswordComplexityResult {
  isValid: boolean;
  errors: string[];
}

const MIN_LENGTH = 12;
const ROTATION_DAYS = 90;

export function validatePasswordComplexity(password: string): PasswordComplexityResult {
  const errors: string[] = [];

  if (password.length < MIN_LENGTH) {
    errors.push(`Password must be at least ${MIN_LENGTH} characters long`);
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'admin', 'letmein'];
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    errors.push('Password contains common patterns and is not secure');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function isPasswordRotationRequired(lastChangeTimestamp: number): boolean {
  const daysSinceChange = (Date.now() - lastChangeTimestamp) / (1000 * 60 * 60 * 24);
  return daysSinceChange > ROTATION_DAYS;
}

export function getPasswordRequirementsText(): string[] {
  return [
    `At least ${MIN_LENGTH} characters long`,
    'Contains uppercase and lowercase letters',
    'Contains at least one number',
    'Contains at least one special character',
    'Does not contain common patterns',
    `Must be changed every ${ROTATION_DAYS} days`,
  ];
}

export function getRotationWindowText(): string {
  return `Passwords must be changed every ${ROTATION_DAYS} days for security.`;
}
