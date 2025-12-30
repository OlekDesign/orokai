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
    <div className="fixed top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-background">
      {title === "Orokai" ? (
        <img 
          src={`${import.meta.env.BASE_URL}logo-orokai-full-white.svg`}
          alt="Orokai" 
          className="h-7 w-auto"
        />
      ) : (
        <Heading3>{title}</Heading3>
      )}
      {showCloseButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
