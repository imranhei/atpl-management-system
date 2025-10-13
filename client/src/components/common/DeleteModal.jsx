import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export default function DeleteModal({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  itemLabel,
}) {
  // Prevent closing via outside click or ESC while loading
  const blockWhileLoading = (e) => {
    if (loading) e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !loading && onOpenChange(o)}>
      <DialogContent
        className="sm:max-w-md w-5/6"
        onInteractOutside={blockWhileLoading}
        onEscapeKeyDown={blockWhileLoading}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            {title ?? `Delete${itemLabel ? ` “${itemLabel}”` : ""}?`}
          </DialogTitle>
          <DialogDescription className="mt-1">
            {description ??
              `This action cannot be undone. This will permanently delete${
                itemLabel ? ` “${itemLabel}”` : " the item"
              } from the system.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                Deleting…
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
