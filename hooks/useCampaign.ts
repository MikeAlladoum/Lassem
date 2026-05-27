import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";

const CAMPAIGN_ABI = [
  "function contribute() external payable",
  "function withdrawFunds() external",
  "function refund() external",
  "function refundAll() external",
  "function cancel() external",
  "function getCampaignInfo() external view returns (address, uint256, uint256, uint256, bool, bool)",
  "function getContributorsCount() external view returns (uint256)",
  "function contributions(address) external view returns (uint256)",
  "event ContributionReceived(address indexed contributor, uint256 amount, uint256 newTotal)",
  "event FundsWithdrawn(address indexed owner, uint256 amount)",
  "event RefundIssued(address indexed contributor, uint256 amount)",
  "event CampaignCancelled()",
];

interface CampaignInfo {
  owner: string;
  goalAmount: bigint;
  currentAmount: bigint;
  deadline: bigint;
  withdrawn: boolean;
  cancelled: boolean;
}

interface ContributionState {
  isLoading: boolean;
  hash: string | null;
  error: string | null;
  success: boolean;
}

const initialContributionState: ContributionState = {
  isLoading: false,
  hash: null,
  error: null,
  success: false,
};

export const useCampaign = (campaignAddress: string | null) => {
  const [campaignInfo, setCampaignInfo] = useState<CampaignInfo | null>(null);
  const [contributorsCount, setContributorsCount] = useState<number>(0);
  const [userContribution, setUserContribution] = useState<bigint | null>(null);
  const [contributionState, setContributionState] = useState<ContributionState>(
    initialContributionState
  );

  // Récupérer les infos de la campagne
  const fetchCampaignInfo = useCallback(async () => {
    if (!campaignAddress || !ethers.isAddress(campaignAddress)) return;

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const contract = new ethers.Contract(
        campaignAddress,
        CAMPAIGN_ABI,
        provider
      );

      const [owner, goalAmount, currentAmount, deadline, withdrawn, cancelled] =
        await contract.getCampaignInfo();
      const count = await contract.getContributorsCount();

      setCampaignInfo({
        owner,
        goalAmount,
        currentAmount,
        deadline,
        withdrawn,
        cancelled,
      });

      setContributorsCount(Number(count));

      // Récupérer la contribution de l'utilisateur si connecté
      const signer = await provider.getSigner();
      if (signer) {
        const userAddress = await signer.getAddress();
        const contribution = await contract.contributions(userAddress);
        setUserContribution(contribution);
      }
    } catch (error) {
      console.error("Error fetching campaign info:", error);
    }
  }, [campaignAddress]);

  useEffect(() => {
    if (campaignAddress) {
      fetchCampaignInfo();
      // Rafraîchir toutes les 10 secondes
      const interval = setInterval(fetchCampaignInfo, 10000);
      return () => clearInterval(interval);
    }
  }, [campaignAddress, fetchCampaignInfo]);

  // Contribuer à la campagne
  const contribute = useCallback(
    async (amountInEth: string) => {
      if (!campaignAddress || !ethers.isAddress(campaignAddress)) {
        setContributionState((prev) => ({
          ...prev,
          error: "Adresse campagne invalide",
        }));
        return;
      }

      setContributionState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          campaignAddress,
          CAMPAIGN_ABI,
          signer
        );

        const amountInWei = ethers.parseEther(amountInEth);
        const tx = await contract.contribute({ value: amountInWei });

        setContributionState((prev) => ({
          ...prev,
          hash: tx.hash,
        }));

        // Attendre la confirmation
        const receipt = await tx.wait();

        if (receipt) {
          setContributionState((prev) => ({
            ...prev,
            isLoading: false,
            success: true,
          }));

          // Rafraîchir les infos
          fetchCampaignInfo();

          // Retourner le hash pour enregistrement en DB
          return tx.hash;
        }
      } catch (error: any) {
        console.error("Contribution error:", error);
        setContributionState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || "Erreur lors de la contribution",
        }));
      }
    },
    [campaignAddress, fetchCampaignInfo]
  );

  // Retirer les fonds
  const withdrawFunds = useCallback(async () => {
    if (!campaignAddress || !ethers.isAddress(campaignAddress)) {
      setContributionState((prev) => ({
        ...prev,
        error: "Adresse campagne invalide",
      }));
      return;
    }

    setContributionState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        campaignAddress,
        CAMPAIGN_ABI,
        signer
      );

      const tx = await contract.withdrawFunds();

      setContributionState((prev) => ({
        ...prev,
        hash: tx.hash,
      }));

      const receipt = await tx.wait();

      if (receipt) {
        setContributionState((prev) => ({
          ...prev,
          isLoading: false,
          success: true,
        }));

        fetchCampaignInfo();
        return tx.hash;
      }
    } catch (error: any) {
      console.error("Withdraw error:", error);
      setContributionState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Erreur lors du retrait",
      }));
    }
  }, [campaignAddress, fetchCampaignInfo]);

  // Demander un remboursement
  const refund = useCallback(async () => {
    if (!campaignAddress || !ethers.isAddress(campaignAddress)) {
      setContributionState((prev) => ({
        ...prev,
        error: "Adresse campagne invalide",
      }));
      return;
    }

    setContributionState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        campaignAddress,
        CAMPAIGN_ABI,
        signer
      );

      const tx = await contract.refund();

      setContributionState((prev) => ({
        ...prev,
        hash: tx.hash,
      }));

      const receipt = await tx.wait();

      if (receipt) {
        setContributionState((prev) => ({
          ...prev,
          isLoading: false,
          success: true,
        }));

        fetchCampaignInfo();
        return tx.hash;
      }
    } catch (error: any) {
      console.error("Refund error:", error);
      setContributionState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Erreur lors du remboursement",
      }));
    }
  }, [campaignAddress, fetchCampaignInfo]);

  const resetState = useCallback(() => {
    setContributionState(initialContributionState);
  }, []);

  return {
    campaignInfo,
    contributorsCount,
    userContribution,
    ...contributionState,
    contribute,
    withdrawFunds,
    refund,
    fetchCampaignInfo,
    resetState,
  };
};
