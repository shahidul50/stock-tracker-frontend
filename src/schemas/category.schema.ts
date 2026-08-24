import { z } from "zod";

export const CategoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name is too long"),
  description: z.string().max(200, "Description maximum 200 characters"),
});

export type CategoryFormValues = z.infer<typeof CategoryFormSchema>;