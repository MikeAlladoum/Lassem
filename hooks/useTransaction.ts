/**
 * ═══════════════════════════════════════════════════════════════
 * HOOK: useTransaction
 * ═══════════════════════════════════════════════════════════════
 * 
 * Manages transaction lifecycle:
 * - pending: Waiting for user confirmation
 * - confirming: User confirmed, waiting for blockchain
 * - success: Transaction confirmed on blockchain
 * - error: Transaction failed
 * 
 * Usage:
 * const { state, startTransaction, completeTransaction, errorTransaction } = useTransaction()
 */

import { useState, useCallback } from "react";

export type TransactionState = "idle" | "pending" | "confirming" | "success" | "error";

export interface TransactionStatus {
  state: TransactionState;
  message?: string;
  txHash?: string;
  error?: string;
  progress?: number; // 0-100 for confirming state
}

interface UseTransactionReturn {
  status: TransactionStatus;
  startTransaction: (message: string) => void;
  confirmTransaction: () => void;
  completeTransaction: (txHash: string, message?: string) => void;
  errorTransaction: (error: string) => void;
  resetTransaction: () => void;
  setProgress: (progress: number) => void;
}

export function useTransaction(): UseTransactionReturn {
  const [status, setStatus] = useState<TransactionStatus>({
    state: "idle",
  });

  const startTransaction = useCallback((message: string) => {
    setStatus({
      state: "pending",
      message,
    });
  }, []);

  const confirmTransaction = useCallback(() => {
    setStatus((prev) => ({
      ...prev,
      state: "confirming",
      message: "Waiting for blockchain confirmation...",
      progress: 0,
    }));
  }, []);

  const completeTransaction = useCallback((txHash: string, message?: string) => {
    setStatus({
      state: "success",
      txHash,
      message: message || "Transaction successful!",
    });
  }, []);

  const errorTransaction = useCallback((error: string) => {
    setStatus({
      state: "error",
      error,
      message: "Transaction failed",
    });
  }, []);

  const resetTransaction = useCallback(() => {
    setStatus({
      state: "idle",
    });
  }, []);

  const setProgress = useCallback((progress: number) => {
    setStatus((prev) => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
    }));
  }, []);

  return {
    status,
    startTransaction,
    confirmTransaction,
    completeTransaction,
    errorTransaction,
    resetTransaction,
    setProgress,
  };
}

export default useTransaction;
