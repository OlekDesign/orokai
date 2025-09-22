import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipProps {
  show: boolean;
  message: string;
}

export function Tooltip({ show, message }: TooltipProps) {
  if (!show) return null;

  return (
    <TooltipProvider>
      <ShadcnTooltip open>
        <TooltipContent
          side="top"
          className="bg-popover text-popover-foreground"
        >
          {message}
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
}