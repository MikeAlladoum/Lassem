"use client";

import React, { useEffect, useState } from "react";
import { Search, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface Campaign {
  id: number;
  title: string;
  creator_id: number;
  status: "draft" | "active" | "succeeded" | "failed" | "cancelled";
  current_amount: string;
  goal_amount: string;
  is_active: boolean;
  is_visible: boolean;
  created_at: string;
}

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const params = new URLSearchParams();
        if (search) params.append("search", search);

        const response = await fetch(
          `/api/campaigns?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          let filtered = data.campaigns || [];
          if (statusFilter !== "all") {
            filtered = filtered.filter((c: Campaign) => c.status === statusFilter);
          }
          setCampaigns(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCampaigns, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock size={16} className="text-yellow-400" />;
      case "succeeded":
        return <CheckCircle size={16} className="text-green-400" />;
      case "failed":
        return <AlertCircle size={16} className="text-red-400" />;
      default:
        return <Clock size={16} className="text-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-yellow-900/30 text-yellow-400";
      case "succeeded":
        return "bg-green-900/30 text-green-400";
      case "failed":
        return "bg-red-900/30 text-red-400";
      case "cancelled":
        return "bg-neutral-900/30 text-neutral-400";
      default:
        return "bg-cyan-900/30 text-cyan-400";
    }
  };

  const calculateProgress = (current: string, goal: string) => {
    const curr = parseFloat(current);
    const g = parseFloat(goal);
    return Math.min(100, Math.round((curr / g) * 100));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Campaign Moderation</h1>
        <p className="text-neutral-400">
          Review and monitor all campaigns on the platform
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-cyan-900/30 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-600"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-neutral-900/50 border border-cyan-900/30 rounded-lg text-white focus:outline-none focus:border-cyan-600"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="succeeded">Succeeded</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-900 border-t-cyan-400 animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-neutral-400">No campaigns found</p>
          </div>
        ) : (
          campaigns.map((campaign) => {
            const progress = calculateProgress(campaign.current_amount, campaign.goal_amount);
            return (
              <div
                key={campaign.id}
                className="bg-neutral-900/50 border border-cyan-900/30 rounded-lg p-6 hover:border-cyan-700/50 transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                  {/* Campaign Info */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-neutral-400 mb-4">
                      ID: {campaign.id} • Creator: #{campaign.creator_id}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-neutral-400">
                          {campaign.current_amount} / {campaign.goal_amount} ETH
                        </span>
                        <span className="text-xs text-cyan-400 font-medium">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {getStatusIcon(campaign.status)}
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {campaign.status.charAt(0).toUpperCase() +
                          campaign.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wide">
                        Visibility
                      </p>
                      <p className="text-white font-semibold">
                        {campaign.is_visible ? "Public" : "Hidden"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wide">
                        Status
                      </p>
                      <p className="text-white font-semibold">
                        {campaign.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wide">
                        Created
                      </p>
                      <p className="text-white font-semibold">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all text-sm font-medium">
                      View Details
                    </button>
                    <button className="w-full px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-all text-sm font-medium">
                      Edit Campaign
                    </button>
                    {campaign.is_visible && (
                      <button className="w-full px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-all text-sm font-medium">
                        Hide Campaign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
