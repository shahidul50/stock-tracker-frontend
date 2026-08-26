export interface StockSummaryRow {
    itemName: string
    companyName: string
    categoryName: string
    availableQty: number
    reorderLevel: number
    status: "Out of Stock" | "Low Stock" | "In Stock"
}

export interface StockSummaryParams {
    companyId?: string
    categoryId?: string
    page?: number
    limit?: number
}

export interface SalesReportRow {
    itemName: string
    categoryName: string
    companyName: string
    totalSoldQty: number
    soldDate: string
}

export interface SalesReportParams {
    fromDate: string
    toDate: string
    page?: number
    limit?: number
}
