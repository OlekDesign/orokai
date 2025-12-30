import { motion } from 'framer-motion';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedSwitchProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  className?: string;
  layoutId?: string;
}

export function SegmentedSwitch<T extends string>({ 
  value, 
  onChange, 
  options,
  className,
  layoutId = "segmentedSwitchIndicator"
}: SegmentedSwitchProps<T>) {
  return (
    <ToggleGroup 
      type="single" 
      value={value} 
      onValueChange={(val) => val && onChange(val as T)}
      className={cn("flex items-center", className)}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          size="sm"
          className={cn(
            "relative px-4 py-1.5 text-sm font-medium transition-colors duration-200",
            value === option.value ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {value === option.value && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-0 bg-muted rounded-md"
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          )}
          <span className="relative z-10 whitespace-nowrap">
            {option.label}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

