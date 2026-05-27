export function LoadingSpinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function LoadingInline() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-neutral-400">Chargement...</span>
    </div>
  );
}
