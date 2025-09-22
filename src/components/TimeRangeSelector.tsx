import { motion } from 'framer-motion';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

type TimeRange = 'week' | 'month' | 'all';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const ranges: { value: TimeRange; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'all', label: 'All' },
];

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <ToggleGroup type="single" value={value} onValueChange={(val) => val && onChange(val as TimeRange)}>
      {ranges.map((range) => (
        <ToggleGroupItem
          key={range.value}
          value={range.value}
          size="sm"
          className="relative px-3 py-1.5 text-sm font-medium"
        >
          {value === range.value && (
            <motion.div
              layoutId="timeRangeIndicator"
              className="absolute inset-0 bg-muted rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">
            {range.label}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}