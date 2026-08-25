import { z } from "zod"

export const stockInSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.number().int().positive("Quantity must be a positive number"),
})

export type StockInFormData = z.infer<typeof stockInSchema>
