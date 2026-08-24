import { z } from "zod";

export const CompanyFormSchema = z.object({
  name: z.string().min(1, "Company name is required").max(50, "Name is too long"),
  description: z.string().max(200, "Description maximum 200 characters"),
});

export type CompanyFormValues = z.infer<typeof CompanyFormSchema>;