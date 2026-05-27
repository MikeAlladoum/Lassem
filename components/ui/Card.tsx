"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 ${
        hover ? "hover:border-neutral-700 hover:bg-neutral-900 transition-all" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
