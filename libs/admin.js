/**
 * Admin Access Control Utilities
 * These functions handle admin role assignment and verification
 */

/**
 * Check if an email address should have admin access
 * @param {string} email - The email address to check
 * @returns {boolean} - True if the email should have admin access
 */
export function isAdminEmail(email) {
  if (!email) return false;

  const adminEmails = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  const adminList = adminEmails
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);

  return adminList.includes(email.toLowerCase());
}

/**
 * Determine the correct role for a user based on their email and selected role
 * @param {string} email - The user's email address
 * @param {string} selectedRole - The role the user selected ('artist' or 'dj')
 * @returns {string} - The final role ('artist', 'dj', or 'admin')
 */
export function determineUserRole(email, selectedRole = 'artist') {
  // Admin access is determined by email, not user selection
  if (isAdminEmail(email)) {
    return 'admin';
  }

  // Otherwise, use the selected role (artist or dj)
  return ['artist', 'dj'].includes(selectedRole) ? selectedRole : 'artist';
}

/**
 * Get admin configuration info (for debugging/status)
 * @returns {object} - Admin configuration details
 */
export function getAdminConfig() {
  const adminEmails = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  const adminList = adminEmails
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);

  return {
    adminEmails: adminList,
    count: adminList.length,
    configured: adminList.length > 0
  };
}

/**
 * Validate admin access for a user profile
 * @param {object} user - The user object from Supabase auth
 * @param {object} profile - The user profile from database
 * @returns {boolean} - True if the user should have admin access
 */
export function validateAdminAccess(user, profile) {
  if (!user?.email) return false;

  // Check if email is in admin list
  const hasAdminEmail = isAdminEmail(user.email);

  // Check if profile role is admin (for existing admins)
  const hasAdminRole = profile?.role === 'admin';

  return hasAdminEmail || hasAdminRole;
}