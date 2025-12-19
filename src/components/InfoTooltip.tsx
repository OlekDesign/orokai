import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  content: React.ReactNode;
  className?: string;
  iconClassName?: string;
  delayDuration?: number;
  videoUrl?: string;
}

export function InfoTooltip({ 
  content, 
  className = "", 
  iconClassName = "w-3 h-3 text-muted-foreground hover:text-foreground cursor-help",
  delayDuration = 0,
  videoUrl
}: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          <Info className={iconClassName} />
        </TooltipTrigger>
        <TooltipContent className={`max-w-xs bg-foreground p-4 ${className}`}>
          <div className="w-full aspect-video mb-3 rounded-md overflow-hidden bg-muted">
            <video
              src={videoUrl || "/video.mp4"}
              className="w-full h-full object-cover"
              controls
              playsInline
              loop
            />
          </div>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
