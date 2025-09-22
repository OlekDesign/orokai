import { useNavigate, useLocation } from 'react-router-dom';
import { Toggle } from "@/components/ui/toggle";

export function EmptyStateToggle() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Check if we're on an empty state page
  const isEmptyState = currentPath.endsWith('-empty');
  
  // Get the base path and empty state path
  const basePath = isEmptyState ? currentPath.replace('-empty', '') : currentPath;
  const emptyStatePath = isEmptyState ? currentPath : `${currentPath}-empty`;

  const handleToggle = () => {
    navigate(isEmptyState ? basePath : emptyStatePath);
  };

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-50">
      <div className="flex items-center space-x-2 bg-card rounded-lg p-2 shadow-lg border border-border">
        <span className={`text-xs ${!isEmptyState ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          Regular
        </span>
        <Toggle
          pressed={isEmptyState}
          onPressedChange={handleToggle}
          size="sm"
          className="data-[state=on]:bg-primary"
        />
        <span className={`text-xs ${isEmptyState ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          Empty
        </span>
      </div>
    </div>
  );
}
