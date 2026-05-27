/**
 * ═══════════════════════════════════════════════════════════════
 * ADMIN MIDDLEWARE - Web3 Professional DApp
 * ═══════════════════════════════════════════════════════════════
 * 
 * Handles:
 * - Admin wallet verification
 * - Role-based access control (RBAC)
 * - Admin-only operations
 */

const ADMIN_WALLET = process.env.ADMIN_WALLET?.toLowerCase();

if (!ADMIN_WALLET) {
  console.warn(
    "⚠️  WARNING: ADMIN_WALLET not configured in .env.local\n" +
    "Set it via: ADMIN_WALLET=0x... (owner's wallet address)"
  );
}

/**
 * Check if a wallet address is the admin
 * @param walletAddress - Ethereum wallet address to check
 * @returns boolean - true if wallet is admin
 */
export function isAdminWallet(walletAddress: string | null | undefined): boolean {
  if (!walletAddress || !ADMIN_WALLET) {
    return false;
  }
  return walletAddress.toLowerCase() === ADMIN_WALLET;
}

/**
 * Check if a user has admin role
 * @param role - User role from JWT or database
 * @returns boolean - true if role is admin
 */
export function isAdminRole(role: string | null | undefined): boolean {
  return role === "admin";
}

/**
 * Verify that a wallet is authorized as admin
 * Throws error if not authorized
 * @param walletAddress - Ethereum wallet address
 * @throws Error if not admin
 */
export function requireAdminWallet(walletAddress: string | null | undefined): void {
  if (!isAdminWallet(walletAddress)) {
    throw new Error("Admin wallet required for this operation");
  }
}

/**
 * Verify that a user role is admin
 * Throws error if not authorized
 * @param role - User role
 * @throws Error if not admin
 */
export function requireAdminRole(role: string | null | undefined): void {
  if (!isAdminRole(role)) {
    throw new Error("Admin role required for this operation");
  }
}

/**
 * Get the configured admin wallet address
 * @returns Ethereum address of platform admin or null
 */
export function getAdminWallet(): string | null {
  return ADMIN_WALLET || null;
}

/**
 * Log admin action for audit trail
 * @param action - Description of the admin action
 * @param adminAddress - Admin's wallet address
 * @param metadata - Additional context
 */
export function logAdminAction(
  action: string,
  adminAddress: string,
  metadata?: Record<string, any>
): void {
  console.log(
    `[ADMIN_ACTION] ${new Date().toISOString()} | ${action} | Admin: ${adminAddress}`,
    metadata || ""
  );
}

export default {
  isAdminWallet,
  isAdminRole,
  requireAdminWallet,
  requireAdminRole,
  getAdminWallet,
  logAdminAction,
};
