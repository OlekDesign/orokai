interface ProgressBarProps {
  progress: number;
  label?: string;
  rightLabel?: string;
}

export function ProgressBar({ progress, label, rightLabel }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      {(label || rightLabel) && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          {label && <span>{label}</span>}
          {rightLabel && <span>{rightLabel}</span>}
        </div>
      )}
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-brand transition-all duration-500 ease-out rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}