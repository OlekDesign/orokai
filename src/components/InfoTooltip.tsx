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
}

export function InfoTooltip({ 
  content, 
  className = "", 
  iconClassName = "w-3 h-3 text-muted-foreground hover:text-foreground cursor-help",
  delayDuration = 0 
}: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          <Info className={iconClassName} />
        </TooltipTrigger>
        <TooltipContent className={`max-w-xs bg-foreground p-4 ${className}`}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
