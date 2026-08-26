import api from "@/lib/axios"
import type {
    ApiResponse,
    PaginatedData,
    StockSummaryRow,
    StockSummaryParams,
    SalesReportRow,
    SalesReportParams,
} from "@/types"

export const reportService = {
    getStockSummary: async (params?: StockSummaryParams) => {
        const { data } = await api.get<
            ApiResponse<PaginatedData<StockSummaryRow>>
        >("/reports/stock-summary", { params })
        return data
    },

    exportStockSummary: async (params?: {
        companyId?: string
        categoryId?: string
    }) => {
        const { data } = await api.get<
            ApiResponse<{ data: StockSummaryRow[] }>
        >("/reports/stock-summary/export", { params })
        return data
    },

    getSalesReport: async (params: SalesReportParams) => {
        const { data } = await api.get<
            ApiResponse<PaginatedData<SalesReportRow>>
        >("/reports/sales", { params })
        return data
    },

    exportSalesReport: async (params: {
        fromDate: string
        toDate: string
    }) => {
        const { data } = await api.get<
            ApiResponse<{ data: SalesReportRow[] }>
        >("/reports/sales/export", { params })
        return data
    },
}
