"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/hooks/useWallet";
import Link from "next/link";
import { Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Campaign {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  goal_amount: number;
  current_amount: number;
  status: string;
  category: { name: string };
}

export default function CampaignsPage() {
  const wallet = useWallet();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const result = await res.json();
        const campaignsData = result.data?.campaigns || result.campaigns || [];
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(search.toLowerCase()) ||
      campaign.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && campaign.status === "active") ||
      (filter === "completed" && campaign.status === "succeeded");
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 pt-20" style={{ paddingTop: '80px' }}>
        {/* Header Section - Premium UX */}
        <section className="border-b border-neutral-800/50 bg-gradient-to-b from-neutral-900/50 to-neutral-950 pt-12 pb-8">
          <div className="max-w-6xl mx-auto px-6">
            {/* Title & Description */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-white mb-3">Campagnes</h1>
              <p className="text-lg text-neutral-400 leading-relaxed">
                Découvrez et soutenez les projets innovants qui façonnent l'avenir
              </p>
            </div>

            {/* Search Bar - Premium Focus */}
            <div className="mb-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher un projet, créateur ou catégorie..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-16 py-4 bg-neutral-900 border border-neutral-700 rounded-xl text-base text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:bg-neutral-900 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                {wallet.isConnected && (
                  <Link href="/campaigns/create" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Button variant="primary" size="sm" className="gap-2 whitespace-nowrap">
                      <Plus className="w-4 h-4" />
                      Créer
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Filters & Results - Minimalist Style */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
              <div className="flex flex-wrap items-center gap-3 md:gap-6">
                {[
                  { value: "all" as const, label: "Tous" },
                  { value: "active" as const, label: "En cours" },
                  { value: "completed" as const, label: "Terminés" },
                ].map((option, idx) => (
                  <div key={option.value} className="flex items-center gap-3 md:gap-6">
                    <button
                      onClick={() => setFilter(option.value)}
                      className={`pb-2 font-medium transition-all whitespace-nowrap border-b-2 text-sm md:text-base ${
                        filter === option.value
                          ? "text-cyan-400 border-cyan-400"
                          : "text-neutral-500 border-transparent hover:text-neutral-300"
                      }`}
                    >
                      {option.label}
                    </button>
                    {idx < 2 && <span className="text-neutral-600 text-sm md:text-base">·</span>}
                  </div>
                ))}
              </div>
              
              {/* Result Count - Subtle Right Align */}
              <span className="text-sm text-neutral-400 whitespace-nowrap">
                {filteredCampaigns.length} résultat{filteredCampaigns.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </section>

        {/* Campaigns Grid Section - Premium Spacing */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            {loading ? (
              <div className="flex justify-center py-32">
                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => {
                  const progress = (campaign.current_amount / campaign.goal_amount) * 100;
                  
                  // Category-based styling for fallback
                  const categoryGradients: { [key: string]: { gradient: string; emoji: string } } = {
                    "Technology": { gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", emoji: "💻" },
                    "Energy": { gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", emoji: "⚡" },
                    "Robotics": { gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", emoji: "🤖" },
                    "Blockchain": { gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", emoji: "⛓️" },
                    "default": { gradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)", emoji: "🎯" },
                  };
                  const categoryName = campaign.category?.name || "default";
                  const styles = categoryGradients[categoryName] || categoryGradients["default"];
                  
                  return (
                    <Link
                      key={campaign.id}
                      href={`/campaigns/${campaign.id}`}
                      className="group bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all h-full flex flex-col no-underline text-inherit"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <div 
                        className="overflow-hidden flex items-center justify-center transition-transform duration-300"
                        style={{ 
                          position: 'relative',
                          width: '100%',
                          height: '150px',
                          background: campaign.image_url 
                            ? `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('${campaign.image_url}')`
                            : styles.gradient,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                        {!campaign.image_url && (
                          <div style={{
                            fontSize: '48px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                          }}>
                            {styles.emoji}
                          </div>
                        )}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          padding: '6px 12px',
                          backgroundColor: 'rgba(10, 14, 39, 0.9)',
                          backdropFilter: 'blur(4px)',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#22d3ee',
                          zIndex: 10
                        }}>
                          {progress.toFixed(0)}%
                        </div>
                      </div>

                      <div className="p-5">
                        {campaign.category && (
                          <p className="text-xs text-cyan-300 uppercase tracking-wider font-bold mb-2">
                            {campaign.category.name}
                          </p>
                        )}
                        <h3 className="text-white font-bold mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                          {campaign.title}
                        </h3>
                        <p className="text-neutral-300 text-sm mb-4 line-clamp-2">
                          {campaign.description}
                        </p>

                        <div className="space-y-3">
                          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-500 transition-all"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-300">
                              {campaign.current_amount} ETH
                            </span>
                            <span className="text-neutral-400">
                              / {campaign.goal_amount} ETH
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-neutral-300 text-lg font-medium mb-2">Aucun projet trouvé</p>
                <p className="text-neutral-500 text-sm mb-8">Essayez de modifier votre recherche ou vos filtres</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="px-6 py-2 rounded-lg bg-neutral-800 text-cyan-400 hover:bg-neutral-700 text-sm font-medium transition-all"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
