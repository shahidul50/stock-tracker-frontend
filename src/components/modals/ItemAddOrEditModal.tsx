import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { Info, Loader2, Save, SquarePen } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  createItemSchema,
  updateItemSchema,
  type CreateItemFormData,
} from "@/schemas/item.schema"
import type { Item } from "@/types"

interface Option {
  label: string
  value: string
}

interface ItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: CreateItemFormData) => Promise<void> | void
  initialValues?: Item | null
  categoryOptions?: Option[]
  companyOptions?: Option[]
  isLoading?: boolean
}

export function ItemAddOrEditModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  categoryOptions = [],
  companyOptions = [],
  isLoading = false,
}: ItemModalProps) {
  const isEdit = Boolean(initialValues?.id || initialValues?.name)

  // Default values object
  const defaultValues = React.useMemo(
    () => ({
      name: initialValues?.name || "",
      categoryId: initialValues?.category?.id || "",
      companyId: initialValues?.company?.id || "",
      reorderLevel: initialValues?.reorderLevel ?? 0,
    }),
    [initialValues]
  )

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: isEdit ? updateItemSchema : createItemSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
      onClose()
    },
  })

  // To set the form state correctly when the modal opens and initialValues ​​changes
  React.useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues)
    }
  }, [isOpen, defaultValues, form])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-[95vw] sm:w-full rounded-lg bg-card text-card-foreground border border-border shadow-lg p-0 overflow-hidden dark:bg-gray-900">
        {/* Header */}
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {isEdit ? "Edit Item" : "Create New Item"}
          </DialogTitle>
        </DialogHeader>

        {/* Form Body */}
        <form
          id="item-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="px-6 py-2"
        >
          <FieldGroup className="space-y-4">
            {/* Category & Company Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Field */}
              <form.Field
                name="categoryId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Category <span className="text-rose-500">*</span>
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => {
                          field.handleChange(val ?? "")
                        }}
                      >
                        <SelectTrigger id={field.name} className="min-h-10">
                          <SelectValue placeholder="Select Category">
                            {field.state.value === "ALL" || !field.state.value
                              ? "Select Category"
                              : categoryOptions.find(
                                  (cat) => cat.value === field.state.value
                                )?.label || "Select Category"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              {/* Company Field */}
              <form.Field
                name="companyId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Company <span className="text-rose-500">*</span>
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => {
                          field.handleChange(val ?? "")
                        }}
                      >
                        <SelectTrigger id={field.name} className="min-h-10">
                          <SelectValue placeholder="Select Company">
                            {field.state.value === "ALL" || !field.state.value
                              ? "Select Company"
                              : companyOptions.find(
                                  (comp) => comp.value === field.state.value
                                )?.label || "Select Company"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {companyOptions.map((comp) => (
                            <SelectItem key={comp.value} value={comp.value}>
                              {comp.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>

            {/* Item Name Field */}
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Item Name <span className="text-rose-500">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g., Ergonomic Office Chair"
                      autoComplete="off"
                      className="min-h-10"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            {/* Reorder Level Field */}
            <form.Field
              name="reorderLevel"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid} className="sm:w-1/2">
                    <div className="flex items-center gap-1.5">
                      <FieldLabel htmlFor={field.name}>Reorder Level</FieldLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <Info className="size-3.5 text-muted-foreground hover:text-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              Minimum stock quantity to trigger a reorder alert
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min="0"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      aria-invalid={isInvalid}
                      className="min-h-10"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>

        {/* Modal Footer */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 bg-muted/30 px-6 py-4 mt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto h-10 px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="item-form"
            disabled={isLoading}
            className="w-full px-4 sm:w-auto h-10 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {isEdit ? (
                  <SquarePen className="size-4" />
                ) : (
                  <Save className="size-4" />
                )}
                {isEdit ? "Update Item" : "Save Item"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}