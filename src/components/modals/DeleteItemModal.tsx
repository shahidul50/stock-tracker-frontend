import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteItemModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this item",
  isLoading = false,
}: DeleteItemModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-md rounded-xl border border-border bg-card p-0 shadow-xl overflow-hidden dark:bg-gray-900">
        {/* Modal Header & Content */}
        <div className="flex items-start gap-4 p-6 pb-5">
          {/* Top Left Alert Icon Badge */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertTriangle className="size-5" />
          </div>

          <div className="space-y-1.5 text-left">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Delete Item
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong className="font-semibold text-foreground">
                '{itemName}'
              </strong>
              ? This action cannot be undone and will remove the item from your
              inventory master list.
            </p>
          </div>
        </div>

        {/* Modal Action Footer with Subtly Colored Background */}
        <DialogFooter className="flex flex-col-reverse gap-1.5 border-t border-border bg-muted/40 px-6 py-4 sm:flex-row sm:justify-end sm:gap-3 dark:bg-gray-800/40">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 h-10 w-full rounded-lg border-border bg-background hover:bg-accent sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 h-10 w-full gap-2 rounded-lg bg-rose-600 font-medium text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Item
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}