/**
 * Audit Logging System
 * Tracks admin actions for security and compliance
 */

import fs from 'fs';
import path from 'path';

export enum AuditAction {
  // User actions
  USER_VIEWED = 'USER_VIEWED',
  USER_FILTERED = 'USER_FILTERED',
  USER_SEARCHED = 'USER_SEARCHED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  USER_SUSPENDED = 'USER_SUSPENDED',
  USER_ACTIVATED = 'USER_ACTIVATED',

  // Campaign actions
  CAMPAIGN_VIEWED = 'CAMPAIGN_VIEWED',
  CAMPAIGN_FILTERED = 'CAMPAIGN_FILTERED',
  CAMPAIGN_SEARCHED = 'CAMPAIGN_SEARCHED',
  CAMPAIGN_APPROVED = 'CAMPAIGN_APPROVED',
  CAMPAIGN_REJECTED = 'CAMPAIGN_REJECTED',
  CAMPAIGN_SUSPENDED = 'CAMPAIGN_SUSPENDED',
  CAMPAIGN_DELETED = 'CAMPAIGN_DELETED',

  // Authentication
  AUTH_LOGIN = 'AUTH_LOGIN',
  AUTH_LOGIN_FAILED = 'AUTH_LOGIN_FAILED',
  AUTH_LOGOUT = 'AUTH_LOGOUT',
  AUTH_TOKEN_REFRESHED = 'AUTH_TOKEN_REFRESHED',

  // System
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  SECURITY_ALERT = 'SECURITY_ALERT',
}

export interface AuditLogEntry {
  timestamp: string;
  action: AuditAction;
  adminId: string;
  adminWallet: string;
  targetId?: string | number;
  targetType?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  errorMessage?: string;
}

class AuditLogger {
  private logDir: string;
  private logFile: string;
  private inMemoryLogs: AuditLogEntry[] = [];
  private maxInMemoryLogs: number = 1000;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs', 'audit');
    this.logFile = path.join(this.logDir, `audit-${new Date().toISOString().split('T')[0]}.log`);
    this.ensureLogDirectory();
  }

  /**
   * Ensure log directory exists
   */
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Log an audit event
   */
  async log(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    // Store in memory
    this.inMemoryLogs.push(logEntry);
    if (this.inMemoryLogs.length > this.maxInMemoryLogs) {
      this.inMemoryLogs.shift();
    }

    // Write to file
    this.writeToFile(logEntry);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUDIT] ${logEntry.action} - Admin: ${logEntry.adminId} - Status: ${logEntry.status}`);
    }
  }

  /**
   * Write audit entry to file
   */
  private writeToFile(entry: AuditLogEntry): void {
    try {
      const line = JSON.stringify(entry) + '\n';
      fs.appendFileSync(this.logFile, line, 'utf-8');
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }

  /**
   * Get recent logs (from memory)
   */
  getRecentLogs(limit: number = 100): AuditLogEntry[] {
    return this.inMemoryLogs.slice(-limit);
  }

  /**
   * Get logs filtered by action
   */
  getLogsByAction(action: AuditAction, limit: number = 100): AuditLogEntry[] {
    return this.inMemoryLogs.filter((log) => log.action === action).slice(-limit);
  }

  /**
   * Get logs filtered by admin
   */
  getLogsByAdmin(adminId: string, limit: number = 100): AuditLogEntry[] {
    return this.inMemoryLogs.filter((log) => log.adminId === adminId).slice(-limit);
  }

  /**
   * Get logs filtered by status
   */
  getLogsByStatus(status: 'success' | 'failure', limit: number = 100): AuditLogEntry[] {
    return this.inMemoryLogs.filter((log) => log.status === status).slice(-limit);
  }

  /**
   * Search logs
   */
  searchLogs(query: Partial<AuditLogEntry>, limit: number = 100): AuditLogEntry[] {
    return this.inMemoryLogs
      .filter((log) => {
        for (const [key, value] of Object.entries(query)) {
          if (log[key as keyof AuditLogEntry] !== value) {
            return false;
          }
        }
        return true;
      })
      .slice(-limit);
  }

  /**
   * Get statistics
   */
  getStats() {
    const logs = this.inMemoryLogs;
    const successCount = logs.filter((l) => l.status === 'success').length;
    const failureCount = logs.filter((l) => l.status === 'failure').length;
    const actionGroups = logs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalLogs: logs.length,
      successCount,
      failureCount,
      actionGroups,
    };
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger();

export default AuditLogger;
