import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  categoryName?: string;
  totalItemsLinked?: number;
  isLoading?: boolean;
}

export function DeleteCategoryModal({
  isOpen,
  onClose,
  onConfirm,
  categoryName = "this category",
  totalItemsLinked = 0,
  isLoading = false,
}: DeleteCategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full rounded-lg bg-card text-card-foreground border border-border shadow-lg p-0 overflow-hidden dark:bg-gray-900">
        {/* Header & Body */}
        <div className="flex gap-4 p-6 pb-4">
          {/* Warning Icon Badge */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertTriangle className="size-5" />
          </div>

          <div className="space-y-2">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Delete Category
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete the{" "}
              <span className="font-semibold text-foreground">
                "{categoryName}"
              </span>{" "}
              category? This action cannot be undone and will unlink all{" "}
              <span className="font-semibold text-foreground">
                {totalItemsLinked} items
              </span>{" "}
              associated with it.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 bg-muted/30 px-6 py-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto h-8 px-5 py-5 border-slate-200 dark:border-gray-700"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto h-8  py-5 flex items-center bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 text-white font-medium gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Category
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}