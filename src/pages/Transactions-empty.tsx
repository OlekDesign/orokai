import { History } from 'lucide-react';

export default function TransactionsEmpty() {
  return (
    <div className="relative h-[calc(100vh-10rem)]">
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center mx-auto mb-4">
            <History className="w-6 h-6 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold mb-2">No transactions yet</h1>
          <p className="text-muted-foreground text-sm max-w-[300px]">
            You will find all your investments, withdrawals, and rewards on this page.
          </p>
        </div>
      </div>
    </div>
  );
}