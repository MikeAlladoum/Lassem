import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const SEPOLIA_CHAIN_ID = "11155111";

interface User {
  id: number;
  wallet_address: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  role: string;
}

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  chainId: string | null;
  isCorrectNetwork: boolean;
  error: string | null;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  isLoading: false,
  user: null,
  token: null,
  chainId: null,
  isCorrectNetwork: false,
  error: null,
};

export const useWallet = () => {
  const [state, setState] = useState<WalletState>(initialState);

  // Vérifier si MetaMask est installé
  const hasMetaMask = useCallback(() => {
    return typeof window !== "undefined" && (window as any).ethereum !== undefined;
  }, []);

  // Restaurer la session depuis localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedAddress = localStorage.getItem("walletAddress");

    if (storedToken && storedAddress) {
      setState((prev) => ({
        ...prev,
        token: storedToken,
        address: storedAddress,
        isConnected: true,
      }));
      // Récupérer les infos utilisateur
      fetchUserProfile(storedToken);
    }

    // Écouter les changements de compte
    if (hasMetaMask()) {
      const provider = new ethers.BrowserProvider((window as any).ethereum);

      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== state.address) {
          disconnect();
        }
      });

      (window as any).ethereum.on("chainChanged", (chainId: string) => {
        setState((prev) => ({
          ...prev,
          chainId,
          isCorrectNetwork: chainId === SEPOLIA_CHAIN_ID,
        }));
      });

      // Récupérer le chainId actuel
      provider.getNetwork().then((network) => {
        setState((prev) => ({
          ...prev,
          chainId: network.chainId.toString(),
          isCorrectNetwork: network.chainId.toString() === SEPOLIA_CHAIN_ID,
        }));
      });
    }

    return () => {
      if (hasMetaMask()) {
        (window as any).ethereum.removeAllListeners();
      }
    };
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const { data } = await response.json();
        setState((prev) => ({
          ...prev,
          user: data,
        }));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("walletAddress");
        setState(initialState);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const connect = useCallback(async () => {
    if (!hasMetaMask()) {
      setState((prev) => ({
        ...prev,
        error: "MetaMask n'est pas installé",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Demander les comptes
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];

      // Vérifier le réseau
      const network = await provider.getNetwork();
      if (network.chainId.toString() !== SEPOLIA_CHAIN_ID) {
        await switchToSepolia();
        return;
      }

      // Récupérer le nonce
      const nonceResponse = await fetch("/api/auth/nonce");
      const { data: nonceData } = await nonceResponse.json();
      const { nonce, message } = nonceData;

      // Signer le message
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      // Envoyer la signature au backend
      const connectResponse = await fetch("/api/auth/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          message,
        }),
      });

      if (!connectResponse.ok) {
        throw new Error("Authentification échouée");
      }

      const { data: connectData } = await connectResponse.json();
      const { user, token } = connectData;

      // Stocker le token
      localStorage.setItem("token", token);
      localStorage.setItem("walletAddress", address);

      setState((prev) => ({
        ...prev,
        address,
        isConnected: true,
        user,
        token,
        chainId: network.chainId.toString(),
        isCorrectNetwork: true,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Connection error:", error);
      setState((prev) => ({
        ...prev,
        error: error.message || "Erreur de connexion",
        isLoading: false,
      }));
    }
  }, [hasMetaMask]);

  const disconnect = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("walletAddress");
    setState(initialState);
  }, []);

  const switchToSepolia = useCallback(async () => {
    if (!hasMetaMask()) {
      setState((prev) => ({
        ...prev,
        error: "MetaMask n'est pas installé",
      }));
      return;
    }

    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + parseInt(SEPOLIA_CHAIN_ID).toString(16) }],
      });

      setState((prev) => ({
        ...prev,
        isCorrectNetwork: true,
      }));
    } catch (error: any) {
      if (error.code === 4902) {
        // Chaîne non ajoutée, la proposer
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x" + parseInt(SEPOLIA_CHAIN_ID).toString(16),
                chainName: "Sepolia",
                rpcUrls: [process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL],
                nativeCurrency: {
                  name: "Sepolia ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding Sepolia:", addError);
          setState((prev) => ({
            ...prev,
            error: "Impossible d'ajouter Sepolia",
          }));
        }
      }
    }
  }, [hasMetaMask]);

  return {
    ...state,
    connect,
    disconnect,
    switchToSepolia,
    hasMetaMask: hasMetaMask(),
  };
};
