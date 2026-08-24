import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { CategoryFormSchema, type CategoryFormValues } from "@/schemas/category.schema"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: CategoryFormValues) => Promise<void> | void
  initialValues?: { id?: string; name: string; description?: string } | null
  isLoading?: boolean
}

export function CategoryAddOrEditModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isLoading = false,
}: CategoryModalProps) {
  const isEdit = Boolean(initialValues?.id || initialValues?.name)

  const form = useForm({
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
    },
    validators: {
      onSubmit: CategoryFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
      onClose()
    },
  })

  // To update form state when Modal Open or Initial Values ​​are updated
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: initialValues?.name || "",
        description: initialValues?.description || "",
      })
    }
  }, [isOpen, initialValues])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full rounded-lg bg-card text-card-foreground border border-border shadow-lg p-0 overflow-hidden dark:bg-gray-900">
        {/* Header */}
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {isEdit ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          {!isEdit && (
            <DialogDescription className="text-xs text-muted-foreground sm:text-sm mt-1">
              Create a new category to organize your inventory items.
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Form Body */}
        <form
          id="category-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="px-6 py-2"
        >
          <FieldGroup className="space-y-4">
            {/* Category Name Field */}
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Category Name <span className="text-rose-500">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g., Electronics"
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

            {/* Description Field */}
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                const descValue = field.state.value || ""
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Description{" "}
                      <span className="text-xs text-muted-foreground font-normal">
                        (Optional)
                      </span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        id={field.name}
                        name={field.name}
                        value={descValue}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Briefly describe this category..."
                        rows={4}
                        className="min-h-20 resize-none"
                        aria-invalid={isInvalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums text-xs">
                          {descValue.length}/200 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
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
            className="w-full sm:w-auto h-10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="category-form"
            disabled={isLoading}
            className="w-full sm:w-auto h-10 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {isEdit && <Save className="size-4" />}
                {isEdit ? "Update Category" : "Save Category"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}