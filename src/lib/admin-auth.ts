/**
 * Admin authentication utility
 * Uses simple password-based auth via ADMIN_PASSWORD env var
 */

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  return password === adminPassword && adminPassword.length > 0;
}

export function hashPassword(password: string): string {
  // Simple hash for demonstration — use bcrypt in production
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

export function createSessionToken(): string {
  return Buffer.from(
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  ).toString('base64url');
}
