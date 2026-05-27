"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useWallet } from "@/hooks/useWallet";
import { useFetch } from "@/hooks/useFetch";
import { User, Calendar, Wallet as WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  wallet_address: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const wallet = useWallet();
  const { data: profile, loading, fetch: updateProfile } = useFetch<UserProfile>("/api/users/me");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });

  const handleEdit = () => {
    setFormData({ username: profile?.username || "", email: profile?.email || "" });
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile({ username: formData.username, email: formData.email });
      alert("✅ Profil mis à jour");
      setEditing(false);
    } catch {
      alert("❌ Erreur lors de la mise à jour");
    }
  };

  return (
    <ProtectedPage loading={loading}>
      <div className="border-b border-neutral-800 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white">Mon Profil</h1>
        </div>
      </div>

      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-neutral-900 border border-neutral-800 rounded-lg p-8">
          {/* Avatar */}
          <div className="mb-8 pb-8 border-b border-neutral-800">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">{profile?.username || "Utilisateur"}</h2>
          </div>

          {/* Fields */}
          <div className="space-y-6">
            {editing ? (
              <>
                <FormField
                  label="Nom d'utilisateur"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <FormField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </>
            ) : (
              <>
                <div>
                  <label className="text-neutral-300 text-sm">Nom d'utilisateur</label>
                  <p className="text-white text-lg">{profile?.username || "-"}</p>
                </div>
                <div>
                  <label className="text-neutral-300 text-sm">Email</label>
                  <p className="text-white text-lg">{profile?.email || "-"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <WalletIcon className="w-4 h-4 text-neutral-300" />
                  <div>
                    <label className="text-neutral-300 text-sm">Wallet</label>
                    <p className="text-white text-lg font-mono">{wallet.address || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-300" />
                  <div>
                    <label className="text-neutral-300 text-sm">Membre depuis</label>
                    <p className="text-white text-lg">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("fr-FR") : "-"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="mt-12 pt-8 border-t border-neutral-800 flex gap-4">
            {editing ? (
              <>
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Annuler
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Enregistrer
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={handleEdit}>
                Modifier
              </Button>
            )}
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}
