/**
 * ═══════════════════════════════════════════════════════════════
 * SERVICE: Contribution Flow Handler
 * ═══════════════════════════════════════════════════════════════
 * 
 * Handles the complete contribution flow:
 * 1. User submits amount
 * 2. System shows confirmation
 * 3. User sends blockchain transaction
 * 4. Poll for confirmation
 * 5. Save to database
 * 6. Show success/error
 */

export interface ContributionPayload {
  campaignId: number;
  amount: string; // In ETH
  walletAddress: string;
  token: string; // JWT token
}

export interface ContributionResponse {
  success: boolean;
  data?: {
    id: number;
    campaign_id: number;
    contributor_id: number;
    amount: string;
    tx_hash: string;
    status: string;
    created_at: string;
  };
  error?: string;
}

/**
 * Submit contribution to backend
 * @param payload Contribution data
 * @returns Contribution response
 */
export async function submitContribution(payload: ContributionPayload): Promise<ContributionResponse> {
  try {
    const response = await fetch("/api/contributions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
      body: JSON.stringify({
        campaign_id: payload.campaignId,
        amount: payload.amount,
        tx_hash: "", // Will be filled after blockchain confirmation
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to submit contribution");
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An error occurred",
    };
  }
}

/**
 * Poll for transaction confirmation
 * @param txHash Transaction hash to check
 * @param maxAttempts Maximum polling attempts
 * @returns Transaction receipt or null if not confirmed
 */
export async function pollForConfirmation(
  txHash: string,
  maxAttempts: number = 30
): Promise<boolean> {
  const provider = new (await import("ethers")).ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
  );

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const receipt = await provider.getTransactionReceipt(txHash);

      if (receipt) {
        return receipt.status === 1; // 1 = success, 0 = failed
      }

      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error checking transaction:", error);
      // Continue polling
    }
  }

  // Timeout after max attempts
  return false;
}

/**
 * Update contribution with transaction hash
 * @param contributionId Contribution ID to update
 * @param txHash Transaction hash
 * @param token JWT token
 */
export async function updateContributionWithTxHash(
  contributionId: number,
  txHash: string,
  token: string
): Promise<ContributionResponse> {
  try {
    const response = await fetch(`/api/contributions/${contributionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tx_hash: txHash,
        status: "confirmed",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to update contribution");
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An error occurred",
    };
  }
}

/**
 * Generate explorer URL for transaction
 * @param txHash Transaction hash
 * @returns URL to view transaction on Etherscan
 */
export function getExplorerUrl(txHash: string): string {
  // Sepolia testnet
  return `https://sepolia.etherscan.io/tx/${txHash}`;
}
