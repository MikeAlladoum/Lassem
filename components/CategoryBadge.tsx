interface CategoryBadgeProps {
  name: string;
  count?: number;
}

export function CategoryBadge({ name, count }: CategoryBadgeProps) {
  return (
    <button className="px-3 py-1.5 rounded-full text-sm font-medium transition-all bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-cyan-500 hover:text-cyan-400">
      {name}
      {count && <span className="ml-2 text-xs text-neutral-500">({count})</span>}
    </button>
  );
}
