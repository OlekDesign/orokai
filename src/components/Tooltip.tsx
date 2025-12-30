import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipProps {
  show: boolean;
  message: string;
}

export function Tooltip({ show, message }: TooltipProps) {
  if (!show) return null;

  return (
    <ShadcnTooltip open>
      <TooltipContent
        side="top"
        className="bg-popover text-popover-foreground"
      >
        {message}
      </TooltipContent>
    </ShadcnTooltip>
  );
}