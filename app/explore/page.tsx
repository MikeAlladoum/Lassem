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
        {/* Header */}
        <section className="border-b border-neutral-800" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '40px', paddingBottom: '40px' }}>
          <div className="max-w-7xl mx-auto" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
            <h1 className="text-4xl font-bold text-white mb-2">Découvrir les projets</h1>
            <p className="text-neutral-400">Explorez des centaines de campagnes innovantes</p>
          </div>
        </section>

        {/* Content */}
        <section style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '48px', paddingBottom: '48px' }}>
          <div className="max-w-7xl mx-auto" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
            {/* Search & Filters */}
            <div className="mb-12 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Rechercher un projet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Status Filters & Count */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      status === "all"
                        ? "bg-cyan-500 text-neutral-950"
                        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setStatus("active")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      status === "active"
                        ? "bg-cyan-500 text-neutral-950"
                        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    }`}
                  >
                    En cours
                  </button>
                  <button
                    onClick={() => setStatus("completed")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      status === "completed"
                        ? "bg-cyan-500 text-neutral-950"
                        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    }`}
                  >
                    Complétés
                  </button>
                </div>
                {!loading && (
                  <span className="text-sm text-neutral-400">
                    {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            {/* Results */}
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
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-neutral-400 text-lg mb-2">Aucun projet trouvé</p>
                <p className="text-neutral-500 text-sm">Essayez de modifier votre recherche ou vos filtres</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
