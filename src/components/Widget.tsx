import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heading2, BodyText } from '@/components/ui/typography';
import { useWidget } from '@/contexts/WidgetContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Widget() {
  const { widget, dismissWidget } = useWidget();

  return (
    <AnimatePresence>
      {widget && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden"
        >
          <div className="bg-card border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <div className="mx-auto max-w-[900px] flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Heading2 className="text-base sm:text-lg">{widget.title}</Heading2>
                </div>
                <BodyText className="text-sm text-muted-foreground mb-3">
                  {widget.subtitle}
                </BodyText>
                <Progress value={widget.progress} className="h-2" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={dismissWidget}
                className="flex-shrink-0 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
