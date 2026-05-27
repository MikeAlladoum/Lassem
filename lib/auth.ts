import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

// Message que l'utilisateur signe avec MetaMask
export const AUTH_MESSAGE = (nonce: string) =>
  `Connexion à DAMLEGEND DApp Crowdfunding\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;

// Vérifier la signature et connecter/créer l'utilisateur
export async function connectWallet(walletAddress: string, signature: string, message: string) {
  // 1. Récupérer l'adresse depuis la signature
  const recoveredAddress = ethers.verifyMessage(message, signature);
  
  if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    throw new Error("Signature invalide");
  }

  // 2. Chercher ou créer l'utilisateur dans PostgreSQL
  let user = await prisma.user.findUnique({
    where: { wallet_address: walletAddress.toLowerCase() }
  });

  if (!user) {
    // Nouveau utilisateur — créer le profil
    user = await prisma.user.create({
      data: {
        wallet_address: walletAddress.toLowerCase(),
        username: `user_${walletAddress.slice(2, 8)}`,
        role: "contributor",
        is_visible: true,
        is_active: true,
        created_by: null,
      }
    });
  } else {
    // Vérifier que le compte est actif
    if (!user.is_active) {
      throw new Error("Compte désactivé. Contactez l'administrateur.");
    }
    // Mettre à jour la dernière connexion
    user = await prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() }
    });
  }

  // 3. Générer un JWT
  const token = jwt.sign(
    { userId: user.id, walletAddress: user.wallet_address, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
}

// Vérifier un JWT
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as {
    userId: number;
    walletAddress: string;
    role: string;
  };
}
