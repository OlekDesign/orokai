import * as React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
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
  iconClassName = "w-3 h-3 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200 delay-100",
  delayDuration = 100,
  videoUrl
}: InfoTooltipProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Tooltip 
      open={open} 
      onOpenChange={setOpen} 
      delayDuration={delayDuration}
    >
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center w-10 h-10 -m-[14px] md:w-auto md:h-auto md:m-0 p-0 bg-transparent border-none outline-none cursor-pointer md:cursor-help"
          onClick={(e) => {
            if (window.innerWidth < 768) {
              e.preventDefault();
              setOpen(!open);
            }
          }}
        >
          <Info className={iconClassName} />
        </button>
      </TooltipTrigger>
      <TooltipContent 
        className={`max-w-xs bg-card text-card-foreground border border-border rounded-lg shadow-lg p-4 ${className}`}
      >
        <div className="w-full aspect-video mb-3 rounded-md overflow-hidden bg-muted">
          <video
            src={videoUrl || "/video.mp4"}
            className="w-full h-full object-cover"
            controls
            playsInline
            loop
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
