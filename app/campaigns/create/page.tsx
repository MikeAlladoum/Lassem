"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useWallet } from "@/hooks/useWallet";
import { FormField, FormTextarea, FormSelect } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CATEGORIES = [
  { id: "tech", name: "Technologie" },
  { id: "art", name: "Art" },
  { id: "music", name: "Musique" },
  { id: "film", name: "Cinéma" },
  { id: "games", name: "Jeux" },
  { id: "other", name: "Autre" },
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tech",
    goal_amount: "",
    deadline: "",
    image_url: "",
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert("Titre requis");
      return;
    }
    if (!formData.description.trim()) {
      alert("Description requise");
      return;
    }
    if (!formData.goal_amount || parseFloat(formData.goal_amount) <= 0) {
      alert("Montant valide requis");
      return;
    }
    if (!formData.deadline) {
      alert("Date limite requise");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${wallet.token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category_id: formData.category,
          goal_amount: parseFloat(formData.goal_amount),
          deadline: new Date(formData.deadline).toISOString(),
          image_url: formData.image_url || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert("✅ Campagne créée avec succès!");
        router.push(`/campaigns/${data.data.id}`);
      } else {
        alert("❌ Erreur lors de la création");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedPage>
      <Navbar />
      <div className="min-h-screen bg-neutral-950 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Back Link */}
          <Link href="/dashboard" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
            <ArrowLeft size={20} /> Retour
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Créer une campagne</h1>
            <p className="text-neutral-300">Lancez votre projet et collectez des fonds</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <FormField
                label="Titre du projet"
                placeholder="Ex: Mon super projet..."
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <FormTextarea
                label="Description"
                placeholder="Décrivez votre projet, son impact, et pourquoi vous avez besoin de financement..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={loading}
                rows={6}
              />
            </div>

            {/* Category */}
            <div>
              <FormSelect
                label="Catégorie"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                options={CATEGORIES}
                disabled={loading}
              />
            </div>

            {/* Goal Amount */}
            <div>
              <FormField
                label="Montant cible (ETH)"
                placeholder="Ex: 10"
                type="number"
                step="0.1"
                min="0"
                value={formData.goal_amount}
                onChange={(e) => handleChange("goal_amount", e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-neutral-300 mt-1">
                Le montant que vous souhaitez collecter
              </p>
            </div>

            {/* Deadline */}
            <div>
              <FormField
                label="Date limite"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-neutral-300 mt-1">
                Jusqu'à quelle date voulez-vous collecter?
              </p>
            </div>

            {/* Image URL */}
            <div>
              <FormField
                label="Image URL (optionnel)"
                placeholder="https://example.com/image.jpg"
                type="url"
                value={formData.image_url}
                onChange={(e) => handleChange("image_url", e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-neutral-300 mt-1">
                URL complète de l'image du projet (optionnel)
              </p>
            </div>

            {/* Submit */}
            <div className="pt-6 space-y-3">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Création..." : "Créer la campagne"}
              </Button>
              <Link href="/dashboard" className="block">
                <Button
                  variant="secondary"
                  type="button"
                  className="w-full"
                  disabled={loading}
                >
                  Annuler
                </Button>
              </Link>
            </div>

            {/* Info Box */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mt-8">
              <p className="text-cyan-400 text-sm">
                <strong>💡 Conseil:</strong> Une bonne description et une image attrayante augmentent vos chances de succès.
              </p>
            </div>
          </form>
        </div>
      </div>
    </ProtectedPage>
  );
}
