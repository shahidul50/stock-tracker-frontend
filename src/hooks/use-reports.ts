import { useQuery } from "@tanstack/react-query"

import { reportService } from "@/services/report.service"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { StockSummaryParams, SalesReportParams } from "@/types"

export const useStockSummary = (params?: StockSummaryParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.STOCK_SUMMARY, params],
        queryFn: () => reportService.getStockSummary(params),
    })
}

export const useStockSummaryExport = (
    params?: { companyId?: string; categoryId?: string },
    enabled: boolean = false,
) => {
    return useQuery({
        queryKey: [QUERY_KEYS.STOCK_SUMMARY_EXPORT, params],
        queryFn: () => reportService.exportStockSummary(params),
        enabled,
    })
}

export const useSalesReport = (
    params: SalesReportParams,
    enabled: boolean = true,
) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SALES_REPORT, params],
        queryFn: () => reportService.getSalesReport(params),
        enabled: enabled && !!params.fromDate && !!params.toDate,
    })
}

export const useSalesReportExport = (
    params: { fromDate: string; toDate: string },
    enabled: boolean = false,
) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SALES_REPORT_EXPORT, params],
        queryFn: () => reportService.exportSalesReport(params),
        enabled,
    })
}
