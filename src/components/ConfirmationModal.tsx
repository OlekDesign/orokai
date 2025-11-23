import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heading2, BodyText } from "@/components/ui/typography";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false,
  title = "Close Investment?",
  message = "Your funds will be available in Wallet once you close the investment within a couple of minutes. Do you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Nevermind"
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="pt-6 px-6 pb-10 md:p-6 md:max-w-md mx-auto"
        onInteractOutside={onClose}
      >
      <DialogHeader className="text-left">
        <DialogTitle>
          <Heading2>{title}</Heading2>
        </DialogTitle>
      </DialogHeader>
      
      <div className="py-1">
        <BodyText className="text-muted-foreground leading-relaxed">
          {message}
        </BodyText>
      </div>

      <DialogFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? "Processing..." : confirmText}
        </Button>
      </DialogFooter>
    </DialogContent>
    </Dialog>
  );
}
