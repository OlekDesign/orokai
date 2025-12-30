import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Heading1, BodyText, Caption } from './ui/typography';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number | string;
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
          <Caption className="text-muted-foreground font-medium">{title}</Caption>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            key={String(value)}
          >
            <Heading1 className="mt-1 text-foreground">{value}</Heading1>
          </motion.div>
          {(change !== undefined || subtitle) && (
            <div className="flex items-center space-x-2 mt-1">
              {change !== undefined && (
                <BodyText className={`${
                  typeof change === 'number' 
                    ? (change >= 0 ? 'text-success' : 'text-destructive')
                    : (change.toString().startsWith('+') ? 'text-success' : 'text-destructive')
                }`}>
                  {typeof change === 'number' && (change >= 0 ? '↑ ' : '↓ ')}
                  {typeof change === 'number' ? `${Math.abs(change)}%` : change}
                </BodyText>
              )}
              {subtitle && (
                <Caption className="text-muted-foreground">
                  ({subtitle})
                </Caption>
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
