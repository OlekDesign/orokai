import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heading3 } from './ui/typography';

interface PageHeaderProps {
  title?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function PageHeader({ 
  title = "Orokai", 
  onClose, 
  showCloseButton = true 
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="fixed top-6 left-6 right-6 flex items-center justify-between z-10">
      <Heading3>{title}</Heading3>
      {showCloseButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="rounded-full hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
