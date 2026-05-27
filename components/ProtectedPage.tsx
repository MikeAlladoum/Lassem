import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { Navbar } from "./Navbar";
import { LoadingSpinner } from "./ui/LoadingSpinner";

interface ProtectedPageProps {
  children: ReactNode;
  loading?: boolean;
}

export function ProtectedPage({ children, loading = false }: ProtectedPageProps) {
  const router = useRouter();
  const wallet = useWallet();

  if (!wallet.isConnected) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center pt-16">
          <p className="text-white">Veuillez vous connecter</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 pt-20">
        {loading ? <LoadingSpinner /> : children}
      </main>
    </>
  );
}
