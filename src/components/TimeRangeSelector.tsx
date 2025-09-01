import { motion } from 'framer-motion';

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
    <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className="relative px-3 py-1.5 text-sm font-medium"
        >
          {value === range.value && (
            <motion.div
              layoutId="timeRangeIndicator"
              className="absolute inset-0 bg-white dark:bg-gray-800 rounded-md shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className={`relative z-10 ${
            value === range.value
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-300'
          }`}>
            {range.label}
          </span>
        </button>
      ))}
    </div>
  );
}