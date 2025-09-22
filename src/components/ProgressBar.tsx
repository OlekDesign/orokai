import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  progress: number;
  label?: string;
  rightLabel?: string;
}

export function ProgressBar({ progress, label, rightLabel }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      {(label || rightLabel) && (
        <div className="flex justify-between text-sm text-muted-foreground">
          {label && <span>{label}</span>}
          {rightLabel && <span>{rightLabel}</span>}
        </div>
      )}
      <Progress value={Math.min(100, Math.max(0, progress))} className="h-2" />
    </div>
  );
}