import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { EmptyStateToggle } from './EmptyStateToggle';

interface LayoutProps {
  children: ReactNode;
}


export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isTransactionReview = location.pathname === '/transaction-review';

  return (
    <div className="min-h-screen bg-background">
      {!isTransactionReview && <Navbar />}

      {/* Main Content */}
      <main className={
        !isTransactionReview 
          ? "md:ml-64 pb-20 md:pb-6 mt-3 md:mt-8 bg-background" 
          : "mt-3 md:mt-16 bg-background"
      }>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="mx-auto px-4 py-4 sm:py-6 max-w-[900px] bg-background"
        >
          {children}
        </motion.div>
      </main>

      {/* Empty State Toggle - appears on all pages */}
      {!isTransactionReview && <EmptyStateToggle />}
    </div>
  );
}