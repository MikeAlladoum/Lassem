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
        {/* Premium Header Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-neutral-900/50">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight mb-3">
                Découvrir
              </h1>
              <p className="text-lg text-neutral-400 leading-relaxed max-w-2xl">
                Explorez les campagnes innovantes et trouvez les projets qui vous passionnent
              </p>
            </div>

            {/* Controls Section */}
            <div className="space-y-6">
              {/* Search Bar - Premium Style */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Rechercher un projet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-900/60 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:bg-neutral-900 transition-all duration-200 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Filters & Results - Segmented Control Style */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                {/* Segmented Control for Filters */}
                <div className="inline-flex items-center gap-1 bg-neutral-900/50 p-1 rounded-lg border border-neutral-800">
                  <button
                    onClick={() => setStatus("all")}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                      status === "all"
                        ? "bg-cyan-500 text-neutral-950 shadow-lg shadow-cyan-500/20"
                        : "text-neutral-400 hover:text-neutral-300"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setStatus("active")}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                      status === "active"
                        ? "bg-cyan-500 text-neutral-950 shadow-lg shadow-cyan-500/20"
                        : "text-neutral-400 hover:text-neutral-300"
                    }`}
                  >
                    En cours
                  </button>
                  <button
                    onClick={() => setStatus("completed")}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                      status === "completed"
                        ? "bg-cyan-500 text-neutral-950 shadow-lg shadow-cyan-500/20"
                        : "text-neutral-400 hover:text-neutral-300"
                    }`}
                  >
                    Complétés
                  </button>
                </div>

                {/* Result Counter - Subtle but Present */}
                {!loading && (
                  <div className="text-sm text-neutral-400 font-medium">
                    <span className="text-cyan-400">{filtered.length}</span>
                    {" "}
                    résultat{filtered.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-40">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full blur animate-pulse" />
                  <div className="absolute inset-1 bg-neutral-950 rounded-full" />
                  <div className="absolute inset-0 border-2 border-transparent border-t-cyan-500 border-r-cyan-400 rounded-full animate-spin" />
                </div>
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filtered.map((campaign) => (
                  <CampaignCard key={campaign.id} {...campaign} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 px-6">
                <div className="mb-6 p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
                  <Filter className="w-12 h-12 text-neutral-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Aucun projet trouvé</h3>
                <p className="text-neutral-400 text-center mb-8 max-w-sm">
                  Essayez de modifier vos critères de recherche ou explorez d'autres catégories
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatus("all");
                  }}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-neutral-950 font-medium rounded-lg transition-colors duration-200"
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
