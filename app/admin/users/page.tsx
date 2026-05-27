"use client";

import React, { useEffect, useState } from "react";
import { Search, Shield, Ban, Check } from "lucide-react";

interface User {
  id: number;
  username: string;
  wallet_address: string;
  role: "admin" | "creator" | "contributor" | "visitor";
  is_active: boolean;
  is_visible: boolean;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (roleFilter !== "all") params.append("role", roleFilter);

        const response = await fetch(
          `/api/users?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300); // Debounce
    return () => clearTimeout(timer);
  }, [search, roleFilter]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-900/30 text-red-400";
      case "creator":
        return "bg-purple-900/30 text-purple-400";
      case "contributor":
        return "bg-cyan-900/30 text-cyan-400";
      default:
        return "bg-neutral-700/30 text-neutral-400";
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (response.ok) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, is_active: !isActive } : u
          )
        );
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-neutral-400">
          Manage user roles, permissions, and account status
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
            placeholder="Search by username or wallet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-cyan-900/30 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-600"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 bg-neutral-900/50 border border-cyan-900/30 rounded-lg text-white focus:outline-none focus:border-cyan-600"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="creator">Creator</option>
          <option value="contributor">Contributor</option>
          <option value="visitor">Visitor</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-neutral-900/50 border border-cyan-900/30 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-900 border-t-cyan-400 animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-neutral-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-900/30 bg-neutral-900/20">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-xs text-neutral-500">ID: {user.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono text-cyan-300">
                        {formatAddress(user.wallet_address)}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.is_active ? (
                          <span className="flex items-center gap-1 text-xs text-green-400">
                            <Check size={14} />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-400">
                            <Ban size={14} />
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            handleToggleActive(user.id, user.is_active)
                          }
                          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                            user.is_active
                              ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                              : "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                          }`}
                        >
                          {user.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
