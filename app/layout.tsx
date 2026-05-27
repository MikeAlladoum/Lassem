import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "DAMLEGEND - Crowdfunding Web3",
  description: "Plateforme de financement participatif décentralisée",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-neutral-950 text-white font-sans">
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <div style={{ flex: 1 }}>
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
