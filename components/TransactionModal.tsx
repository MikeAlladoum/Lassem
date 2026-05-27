/**
 * ═══════════════════════════════════════════════════════════════
 * COMPONENT: TransactionModal
 * ═══════════════════════════════════════════════════════════════
 * 
 * Professional transaction feedback modal
 * Shows confirmation, pending, success, and error states
 * 
 * Props:
 * - isOpen: boolean
 * - status: TransactionStatus
 * - onClose: () => void
 * - explorerUrl?: string (for tx link)
 */

"use client";

import React from "react";
import { X, CheckCircle, AlertCircle, Clock, Loader } from "lucide-react";
import { TransactionStatus } from "@/hooks/useTransaction";

interface TransactionModalProps {
  isOpen: boolean;
  status: TransactionStatus;
  onClose: () => void;
  explorerUrl?: string;
}

export function TransactionModal({
  isOpen,
  status,
  onClose,
  explorerUrl,
}: TransactionModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (status.state) {
      case "pending":
        return <Clock className="w-12 h-12 text-cyan-400" />;
      case "confirming":
        return <Loader className="w-12 h-12 text-cyan-400 animate-spin" />;
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-400" />;
      case "error":
        return <AlertCircle className="w-12 h-12 text-red-400" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (status.state) {
      case "pending":
        return "Confirm Transaction";
      case "confirming":
        return "Processing Transaction";
      case "success":
        return "Transaction Successful";
      case "error":
        return "Transaction Failed";
      default:
        return "";
    }
  };

  const getBackgroundColor = () => {
    switch (status.state) {
      case "pending":
        return "bg-neutral-900/50";
      case "confirming":
        return "bg-neutral-900/50";
      case "success":
        return "bg-green-900/10";
      case "error":
        return "bg-red-900/10";
      default:
        return "bg-neutral-900/50";
    }
  };

  const borderColor = () => {
    switch (status.state) {
      case "pending":
        return "border-cyan-500/30";
      case "confirming":
        return "border-cyan-500/30";
      case "success":
        return "border-green-500/30";
      case "error":
        return "border-red-500/30";
      default:
        return "border-neutral-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md rounded-xl border ${borderColor()} ${getBackgroundColor()} p-8 shadow-2xl`}
      >
        {/* Close button */}
        {(status.state === "success" || status.state === "error") && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-neutral-800 rounded-lg transition"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-6">{getIcon()}</div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white text-center mb-3">{getTitle()}</h3>

        {/* Message */}
        {status.message && (
          <p className="text-neutral-300 text-center mb-6">{status.message}</p>
        )}

        {/* Error message */}
        {status.error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">{status.error}</p>
          </div>
        )}

        {/* Progress bar for confirming state */}
        {status.state === "confirming" && (
          <div className="mb-6">
            <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-full transition-all duration-300"
                style={{ width: `${status.progress || 30}%` }}
              />
            </div>
            <p className="text-neutral-400 text-xs text-center mt-3">
              Waiting for network confirmation...
            </p>
          </div>
        )}

        {/* Transaction hash */}
        {status.txHash && (
          <div className="bg-neutral-800/50 rounded-lg p-4 mb-6 break-all">
            <p className="text-neutral-400 text-xs mb-2">Transaction Hash:</p>
            <p className="text-cyan-300 font-mono text-xs">{status.txHash}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {status.state === "success" && explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition text-center"
            >
              View on Explorer
            </a>
          )}

          {(status.state === "success" || status.state === "error") && (
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                status.state === "success"
                  ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              }`}
            >
              Close
            </button>
          )}

          {status.state === "pending" && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Additional info */}
        {status.state === "confirming" && (
          <p className="text-neutral-500 text-xs text-center mt-4">
            Please do not close this page
          </p>
        )}
      </div>
    </div>
  );
}

export default TransactionModal;
