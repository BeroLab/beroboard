import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { XIcon } from "@phosphor-icons/react";

interface DeleteLabelModalProps {
	isOpen: boolean;
	onClose: () => void;
  onSubmit: (id: string) => Promise<void>;
	labelId: string | null
}

export function DeleteLabelModal({ isOpen, onClose, onSubmit, labelId }: DeleteLabelModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if(!labelId) return
    
      setIsDeleting(true);
    try {
      await onSubmit(labelId);
      onClose()
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-120 max-w-120 gap-0 rounded-xl border border-border bg-card p-0 sm:max-w-120"
      >
        <DialogHeader className="flex-row items-center justify-between border-border border-b px-5 py-4">
          <DialogTitle className="font-semibold text-base text-foreground">
						Delete label
					</DialogTitle>
					<DialogClose className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
						<XIcon size={16} />
					</DialogClose>
        </DialogHeader>
        
        <div className="px-5 py-6">
					<p className="text-muted-foreground text-sm">
						Are you sure you want to delete this label? This action cannot be undone.
					</p>
				</div>
        
        <DialogFooter className="flex-row justify-end gap-2 border-border border-t px-5 py-4">
					<DialogClose className="flex h-8 items-center justify-center rounded-lg border border-border px-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
						<span className="text-sm">Cancel</span>
          </DialogClose>
					
					<Button
						type="button"
						onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
						className="h-8 rounded-lg px-4"
          >
            {isDeleting ? "Deleting..." : "Confirm"}
					</Button>
				</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
