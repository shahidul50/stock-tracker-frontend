import { z } from "zod"

export const stockOutItemSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.number().int().positive("Quantity must be a positive number"),
  type: z.enum(["Sell", "Damage", "Lost"]),
})

export const stockOutFormSchema = z.object({
  items: z
    .array(stockOutItemSchema)
    .min(1, "At least one item is required in the cart"),
})

export type StockOutItemFormData = z.infer<typeof stockOutItemSchema>
export type StockOutFormData = z.infer<typeof stockOutFormSchema>
