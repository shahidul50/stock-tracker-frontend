import { AlertTriangle, Info, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  companyName?: string;
  linkedItemsCount?: number;
  isLoading?: boolean;
}

export function DeleteCompanyModal({
  isOpen,
  onClose,
  onConfirm,
  companyName = "this company",
  linkedItemsCount = 0,
  isLoading = false,
}: DeleteCompanyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl dark:bg-gray-900 sm:p-8">
        <div className="flex flex-col items-center text-center">
          {/* Centered Top Warning Badge */}
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertTriangle className="size-6" />
          </div>

          {/* Title & Description */}
          <DialogHeader className="p-0 text-center">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Delete Company
            </DialogTitle>
          </DialogHeader>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              '{companyName}'
            </span>
            ? This action cannot be undone and will affect associated inventory
            items.
          </p>

          {/* Dynamic Information Alert Box */}
          <div className="mt-5 flex w-full items-start gap-3 rounded-xl bg-slate-100 p-3.5 text-left text-xs sm:text-sm text-slate-600 dark:bg-gray-800/80 dark:text-gray-300">
            <Info className="mt-0.5 size-4 shrink-0 text-slate-500 dark:text-gray-400" />
            <span>
              <strong className="font-semibold text-slate-800 dark:text-gray-100">
                {linkedItemsCount} active inventory items
              </strong>{" "}
              are currently linked to this supplier.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="h-8 px-5 py-5 w-full rounded-lg border-border bg-secondary/50 font-medium hover:bg-secondary sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="h-8 py-5 w-full rounded-lg bg-rose-700 text-white font-medium hover:bg-rose-800 dark:bg-rose-600 dark:hover:bg-rose-700 sm:w-auto gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Company
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}