"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/hooks/useWallet";
import { ProgressBar } from "@/components/ProgressBar";
import { CreatorCard } from "@/components/CreatorCard";
import { ContributionModal } from "@/components/ContributionModal";
import Link from "next/link";
import { ArrowLeft, Calendar, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Campaign {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  goal_amount: number;
  current_amount: number;
  deadline: string;
  status: string;
  creator: { id: number; username: string };
  category: { name: string };
  contributions?: Array<{ id: number; amount: number }>;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const wallet = useWallet();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`/api/campaigns/${params.id}`);
        const data = await res.json();
        setCampaign(data.data);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCampaign();
    }
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-screen flex items-center justify-center bg-neutral-950">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
        </div>
      </>
    );
  }

  if (!campaign) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-neutral-950 pt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <Link href="/explore" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
              <ArrowLeft size={20} /> Retour
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Campagne non trouvée</h1>
              <p className="text-neutral-300 mb-8">Cette campagne n'existe pas ou a été supprimée.</p>
              <Link href="/explore">
                <Button variant="primary">Découvrir d'autres projets</Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const daysRemaining = Math.ceil(
    (new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const progressPercent = Math.min((campaign.current_amount / campaign.goal_amount) * 100, 100);
  const contributorCount = campaign.contributions?.length ?? 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-950 pt-20">
        {/* Back Link */}
        <div className="max-w-6xl mx-auto" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px' }}>
          <Link href="/explore" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
            <ArrowLeft size={20} /> Retour
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto" style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Section - Campaign Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image */}
              <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                {campaign.image_url ? (
                  <img
                    src={campaign.image_url}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Target size={48} className="mx-auto text-cyan-400 mb-2" />
                      <p className="text-neutral-300">Pas d'image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium">
                    {campaign.category?.name || "Sans catégorie"}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    campaign.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-neutral-700 text-neutral-300"
                  }`}>
                    {campaign.status === "active" ? "En cours" : "Terminé"}
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-2" style={{ color: '#22d3ee' }}>{campaign.title}</h1>
              </div>

              {/* Creator */}
              <div>
                <p className="text-neutral-300 text-sm uppercase tracking-wide mb-3">Par</p>
                <CreatorCard
                  name={campaign.creator?.username || "Anonyme"}
                />
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">À propos de ce projet</h2>
                <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {campaign.description}
                </p>
              </div>
            </div>

            {/* Right Section - Sticky Contribution Box */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Progress Card */}
                <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
                  {/* Amount */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-3xl font-bold text-cyan-400">
                        {campaign.current_amount.toLocaleString()} ETH
                      </span>
                    </div>
                    <p className="text-neutral-300 text-sm">
                      sur {campaign.goal_amount.toLocaleString()} ETH
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <p className="text-neutral-300 text-xs font-medium mt-2">
                      {Math.round(progressPercent)}% financé
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-neutral-800/50 rounded p-3">
                      <p className="text-neutral-300 text-xs uppercase tracking-wide mb-1">Jours restants</p>
                      <p className="text-xl font-bold text-white">
                        {Math.max(daysRemaining, 0)}
                      </p>
                    </div>
                    <div className="bg-neutral-800/50 rounded p-3">
                      <p className="text-neutral-300 text-xs uppercase tracking-wide mb-1">Contributeurs</p>
                      <p className="text-xl font-bold text-white">{contributorCount}</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  {campaign.status === "active" && wallet.isConnected ? (
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => setShowModal(true)}
                    >
                      Contribuer maintenant
                    </Button>
                  ) : campaign.status !== "active" ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Campagne terminée
                    </Button>
                  ) : (
                    <Button variant="secondary" className="w-full" disabled>
                      Connecter le portefeuille
                    </Button>
                  )}
                </div>

                {/* Quick Share */}
                <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                  <p className="text-neutral-400 text-xs uppercase tracking-wide mb-3">Partager</p>
                  <Button
                    variant="ghost"
                    className="w-full text-cyan-400"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Lien copié!");
                    }}
                  >
                    Copier le lien
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={showModal}
        campaignId={campaign.id}
        goalAmount={campaign.goal_amount}
        currentAmount={campaign.current_amount}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          // Refresh campaign data
          window.location.reload();
        }}
      />
    </>
  );
}
