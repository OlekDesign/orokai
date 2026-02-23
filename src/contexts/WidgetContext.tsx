import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface WidgetData {
  title: string;
  subtitle: string;
  progress: number; // 0-100
}

interface WidgetContextType {
  widget: WidgetData | null;
  showWidget: (data: WidgetData) => void;
  dismissWidget: () => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export function WidgetProvider({ children }: { children: ReactNode }) {
  const [widget, setWidget] = useState<WidgetData | null>(null);

  const showWidget = (data: WidgetData) => {
    setWidget(data);
  };

  const dismissWidget = () => {
    setWidget(null);
  };

  return (
    <WidgetContext.Provider value={{ widget, showWidget, dismissWidget }}>
      {children}
    </WidgetContext.Provider>
  );
}

export function useWidget() {
  const context = useContext(WidgetContext);
  if (context === undefined) {
    throw new Error('useWidget must be used within a WidgetProvider');
  }
  return context;
}
