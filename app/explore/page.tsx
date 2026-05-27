"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CampaignCard } from "@/components/CampaignCard";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/Button";
import { Search, Filter } from "lucide-react";

interface Campaign {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  goal_amount: number;
  current_amount: number;
}

export default function ExplorePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filtered, setFiltered] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns?limit=50");
        const response = await res.json();
        setCampaigns(response.data?.campaigns || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    let result = Array.isArray(campaigns) ? [...campaigns] : [];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (status === "active") {
      result = result.filter((c) => c.current_amount < c.goal_amount);
    } else if (status === "completed") {
      result = result.filter((c) => c.current_amount >= c.goal_amount);
    }

    // Sort by progress
    if (Array.isArray(result)) {
      result.sort((a, b) => {
        const progressA = a.current_amount / a.goal_amount;
        const progressB = b.current_amount / b.goal_amount;
        return progressB - progressA;
      });
    }

    setFiltered(result);
  }, [campaigns, searchTerm, status]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 pt-20">
        {/* Header Section - Premium UX */}
        <section className="border-b border-neutral-800/50 bg-gradient-to-b from-neutral-900/50 to-neutral-950 pt-12 pb-8">
          <div className="max-w-6xl mx-auto px-6">
            {/* Title & Description */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-white mb-3">Découvrir les projets</h1>
              <p className="text-lg text-neutral-400 leading-relaxed">
                Explorez des centaines de campagnes innovantes du monde entier
              </p>
            </div>

            {/* Search Bar - Premium Focus */}
            <div className="mb-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher un projet, créateur ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-900 border border-neutral-700 rounded-xl text-base text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:bg-neutral-900 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {/* Filters & Results - Minimalist Style */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
              <div className="flex flex-wrap items-center gap-3 md:gap-6">
                {[
                  { value: "all" as const, label: "Tous" },
                  { value: "active" as const, label: "En cours" },
                  { value: "completed" as const, label: "Complétés" },
                ].map((option, idx) => (
                  <div key={option.value} className="flex items-center gap-3 md:gap-6">
                    <button
                      onClick={() => setStatus(option.value)}
                      className={`pb-2 font-medium transition-all whitespace-nowrap border-b-2 text-sm md:text-base ${
                        status === option.value
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
              {!loading && (
                <span className="text-sm text-neutral-400 whitespace-nowrap">
                  {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Results Grid Section - Premium Spacing */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((campaign) => (
                  <CampaignCard key={campaign.id} {...campaign} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-neutral-300 text-lg font-medium mb-2">Aucun projet trouvé</p>
                <p className="text-neutral-500 text-sm">Essayez de modifier votre recherche ou vos filtres pour trouver le projet idéal</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
