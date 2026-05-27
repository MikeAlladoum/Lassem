"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-2">Page non trouvée</h2>
        <p className="text-neutral-300 mb-8">
          Désolé, la page que vous recherchez n'existe pas.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-black font-semibold transition-all"
          >
            <Home className="w-5 h-5" /> Accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border border-neutral-700 rounded-lg text-white font-semibold hover:bg-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Retour
          </button>
        </div>
      </div>
    </main>
  );
}
