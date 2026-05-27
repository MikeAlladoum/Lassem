import { User } from "lucide-react";

interface CreatorCardProps {
  name?: string;
  description?: string;
  avatar?: string;
}

export function CreatorCard({ name = "Créateur", description, avatar }: CreatorCardProps) {
  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-white truncate">{name}</p>
          <p className="text-xs text-cyan-400">Créateur vérifié</p>
        </div>
      </div>
      {description && <p className="text-sm text-neutral-400 line-clamp-2">{description}</p>}
    </div>
  );
}
