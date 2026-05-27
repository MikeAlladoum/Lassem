interface ProgressBarProps {
  current: number;
  goal: number;
  showLabel?: boolean;
}

export function ProgressBar({ current, goal, showLabel = true }: ProgressBarProps) {
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-neutral-500">Collecté</p>
            <p className="text-lg font-bold text-white">{current} ETH</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">{Math.round(progress)}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-500">Objectif</p>
            <p className="text-lg font-bold text-neutral-400">{goal} ETH</p>
          </div>
        </div>
      )}
    </div>
  );
}
