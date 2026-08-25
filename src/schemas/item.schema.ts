import { z } from "zod"

export const createItemSchema = z.object({
  name: z.string().min(1, "Item name is required").trim(),
  categoryId: z.string().min(1, "Category is required"),
  companyId: z.string().min(1, "Company is required"),
  reorderLevel: z.number().int().min(0, "Reorder level must be 0 or higher"),
  // description: z.string().trim().optional(),
})

export const updateItemSchema = z.object({
  name: z.string().min(1, "Item name is required").trim(),
  categoryId: z.string().min(1, "Category is required"),
  companyId: z.string().min(1, "Company is required"),
  reorderLevel: z
    .number()
    .int()
    .min(0, "Reorder level must be 0 or higher"),
  // description: z.string().trim().optional(),
})

export type CreateItemFormData = z.infer<typeof createItemSchema>
export type UpdateItemFormData = z.infer<typeof updateItemSchema>
