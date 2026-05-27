import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CampaignCardProps {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  goal_amount: number;
  current_amount: number;
  status?: string;
  category?: { name: string };
}

// Gradients et emojis pour chaque catégorie
const categoryStyles: { [key: string]: { gradient: string; emoji: string } } = {
  "Technology": { gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", emoji: "💻" },
  "Energy": { gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", emoji: "⚡" },
  "Robotics": { gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", emoji: "🤖" },
  "Blockchain": { gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", emoji: "⛓️" },
  "default": { gradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)", emoji: "🎯" },
};

export function CampaignCard({
  id,
  title,
  description,
  image_url,
  goal_amount,
  current_amount,
  status = "active",
  category,
}: CampaignCardProps) {
  const progress = Math.min((current_amount / goal_amount) * 100, 100);
  const daysLeft = Math.ceil(Math.random() * 30); // Placeholder
  
  const categoryName = category?.name || "default";
  const styles = categoryStyles[categoryName] || categoryStyles["default"];

  return (
    <Link href={`/campaigns/${id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
      <div className="group cursor-pointer h-full">
        {/* Image Container with Real Image or Gradient Fallback */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
          marginBottom: '16px',
          backgroundColor: '#262626',
          aspectRatio: '16/9',
          backgroundImage: image_url ? `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('${image_url}')` : styles.gradient,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease',
          transform: 'translateZ(0)',
          color: 'inherit'
        }} className="group-hover:scale-105">
          {/* Emoji fallback only if no image_url */}
          {!image_url && (
            <div style={{
              textAlign: 'center',
              fontSize: '64px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {styles.emoji}
            </div>
          )}
          {/* Status Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs font-semibold text-cyan-400">
            {daysLeft} j restants
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3" style={{ color: 'inherit' }}>
          {/* Title */}
          <h3 className="font-bold text-lg group-hover:text-cyan-400 transition-colors line-clamp-2" style={{ color: 'white' }}>
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm line-clamp-2" style={{ color: '#d4d4d8' }}>
            {description}
          </p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs" style={{ color: '#9ca3af' }}>
              <span className="font-semibold" style={{ color: 'white' }}>{current_amount} ETH collectés</span>
              <span>sur {goal_amount} ETH</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div>
              <p className="text-xs" style={{ color: '#6b7280' }}>Financement</p>
              <p className="font-bold" style={{ color: '#06b6d4' }}>{Math.round(progress)}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: '#6b7280' }}>Contributeurs</p>
              <p className="font-bold" style={{ color: 'white' }}>{Math.ceil(current_amount * 10)}</p>
            </div>
            <ArrowRight className="w-5 h-5" style={{ color: '#6b7280', transition: 'color 0.3s' }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
