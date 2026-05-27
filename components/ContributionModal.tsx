"use client";

import { useState } from "react";
import { X, Loader } from "lucide-react";
import { Button } from "./ui/Button";

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: number;
  goalAmount: number;
  currentAmount: number;
  onSuccess?: () => void;
}

export function ContributionModal({
  isOpen,
  onClose,
  campaignId,
  goalAmount,
  currentAmount,
  onSuccess,
}: ContributionModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const remainingAmount = Math.max(0, goalAmount - currentAmount);
  const suggestedAmounts = [
    Math.min(1, remainingAmount),
    Math.min(5, remainingAmount),
    Math.min(10, remainingAmount),
  ].filter((a) => a > 0);

  const handleContribute = async () => {
    const numAmount = parseFloat(amount);

    if (!amount || numAmount <= 0) {
      setError("Veuillez entrer un montant valide");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("wallet_token");
      if (!token) {
        setError("Veuillez vous connecter");
        return;
      }

      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaign_id: campaignId,
          amount: numAmount,
        }),
      });

      if (res.ok) {
        onSuccess?.();
        onClose();
        setAmount("");
      } else {
        setError("Erreur lors de la contribution");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full space-y-6 p-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Contribuer</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Info */}
        <div className="bg-neutral-800/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Montant restant à collecter</span>
            <span className="text-white font-semibold">{remainingAmount} ETH</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Actuellement collecté</span>
            <span className="text-cyan-400 font-semibold">{currentAmount} ETH</span>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-neutral-300">Montant (ETH)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            placeholder="Entrez le montant..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Quick Suggestions */}
        {suggestedAmounts.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-neutral-500 font-medium">Montants suggérés:</p>
            <div className="grid grid-cols-3 gap-2">
              {suggestedAmounts.map((suggested) => (
                <button
                  key={suggested}
                  onClick={() => {
                    setAmount(suggested.toString());
                    setError("");
                  }}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    amount === suggested.toString()
                      ? "bg-cyan-500 text-white"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  {suggested} ETH
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3">{error}</div>}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleContribute}
            disabled={loading || !amount}
            className="flex-1 gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading ? "Contribution..." : "Confirmer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
