import { z } from "zod"

export const salesReportFilterSchema = z
    .object({
        fromDate: z.string().min(1, "From date is required"),
        toDate: z.string().min(1, "To date is required"),
    })
    .refine((data) => new Date(data.fromDate) <= new Date(data.toDate), {
        message: "From date must be less than or equal to To date",
        path: ["toDate"],
    })

export const stockSummaryFilterSchema = z.object({
    companyId: z.string().optional(),
    categoryId: z.string().optional(),
})

export type SalesReportFilterFormData = z.infer<typeof salesReportFilterSchema>
export type StockSummaryFilterFormData = z.infer<typeof stockSummaryFilterSchema>
