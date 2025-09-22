import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  subtitle?: string;
  icon?: ReactNode;
  chart?: ReactNode;
  footer?: ReactNode;
}

export function StatsCard({ title, value, change, subtitle, icon, chart, footer }: StatsCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            key={String(value)}
          >
            <h4 className="mt-1">{value}</h4>
          </motion.div>
          {(typeof change === 'number' || subtitle) && (
            <div className="flex items-center space-x-2 mt-1">
              {typeof change === 'number' && (
                <p className={`text-sm ${
                  change >= 0 
                    ? 'text-success' 
                    : 'text-destructive'
                }`}>
                  {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                </p>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">
                  ({subtitle})
                </p>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
      {chart && (
        <div className="mt-4">
          {chart}
        </div>
      )}
      {footer && (
        <div className="border-t border-border pt-4 mt-4">
          {footer}
        </div>
      )}
    </Card>
  );
}