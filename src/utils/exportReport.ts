import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import Papa from "papaparse"
import type { SalesReportRow, StockSummaryRow } from "@/types"

// ─── Helper: browser download trigger ────────────────────────────────────────
const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

// ─── Helper: current date string for filename ─────────────────────────────────
const dateStr = () => new Date().toISOString().split("T")[0]

// ─── Helper: Dynamic Footer & Watermark for Landscape PDF ──────────────────────
const applyPDFDecorations = (doc: jsPDF) => {
    const totalPages = (doc as any).internal.getNumberOfPages()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)

        // 1. Diagonal Watermark: "INTERNAL USE ONLY"
        // doc.saveGraphicsState()
        // doc.setFontSize(65)
        // doc.setTextColor(240, 240, 240) // Ultra light gray watermark
        // doc.setFont("helvetica", "bold")
        // doc.text("INTERNAL USE ONLY", pageWidth / 2, pageHeight / 2 + 15, {
        //     align: "center",
        //     angle: 25,
        // })
        // doc.restoreGraphicsState()

        //2. Footer Section
        doc.setDrawColor(220, 220, 220)
        doc.setLineWidth(0.5)
        doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15)

        doc.setFontSize(8)
        doc.setTextColor(120, 120, 120)
        doc.setFont("helvetica", "bold")
        doc.text("STOCKTRACKER INTERNAL USE ONLY", 14, pageHeight - 8)

        doc.setFont("helvetica", "normal")
        doc.text(`PAGE ${i} OF ${totalPages}`, pageWidth - 14, pageHeight - 8, {
            align: "right",
        })
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  SALES REPORT EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export const exportSalesReportCSV = (rows: SalesReportRow[]) => {
    const data = rows.map((r) => ({
        "Item Name": r.itemName,
        Category: r.categoryName,
        Company: r.companyName,
        "Total Sold Qty": r.totalSoldQty,
        "Sold Date": r.soldDate,
    }))

    const csvContent = Papa.unparse(data)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    triggerDownload(blob, `Stock Tracker - Sales Report-${dateStr()}.csv`)
}

export const exportSalesReportPDF = (
    rows: SalesReportRow[],
    meta?: { fromDate?: string; toDate?: string }
) => {
    // Landscape Mode Initialization
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
    const pageWidth = doc.internal.pageSize.getWidth()

    // --- Top Branding Header ---
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(4, 120, 87) // Emerald-700
    doc.text("STOCKTRACKER", 14, 16)

    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(100, 100, 100)
    doc.text("INVENTORY MANAGEMENT", 14, 21)

    // Report Generated Date Info (Top Right)
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(100, 100, 100)
    doc.text("REPORT GENERATED", pageWidth - 14, 16, { align: "right" })

    const nowFormatted = new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
    doc.setFont("helvetica", "normal")
    doc.text(nowFormatted, pageWidth - 14, 21, { align: "right" })

    // Header Divider Line
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.5)
    doc.line(14, 25, pageWidth - 14, 25)

    // Title
    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(30, 41, 59)
    doc.text("Date-wise Sales Summary Report", 14, 33)

    // Accent Line under Title
    doc.setDrawColor(4, 120, 87)
    doc.setLineWidth(1.5)
    doc.line(14, 36, pageWidth - 14, 36)

    // --- Parameter/Meta Banner Box ---
    doc.setFillColor(243, 244, 246)
    doc.roundedRect(14, 42, pageWidth - 28, 12, 1, 1, "F")

    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(75, 85, 99)
    doc.text("REPORT TYPE: ", 18, 50)
    doc.setFont("helvetica", "normal")
    doc.text("SALES SUMMARY", 43, 50)

    const datePeriod =
        meta?.fromDate && meta?.toDate
            ? `${meta.fromDate} - ${meta.toDate}`
            : "OCT 01, 2023 - OCT 27, 2023"

    doc.setFont("helvetica", "bold")
    doc.text("PERIOD: ", pageWidth - 80, 50)
    doc.setFont("helvetica", "normal")
    doc.text(datePeriod, pageWidth - 65, 50)

    // --- KPI Card (Total Items Sold) ---
    const totalQty = rows.reduce((sum, r) => sum + (r.totalSoldQty || 0), 0)

    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(229, 231, 235)
    doc.setLineWidth(0.5)
    doc.roundedRect(14, 59, 70, 24, 2, 2, "FD")

    doc.setFontSize(7.5)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(107, 114, 128)
    doc.text("TOTAL ITEMS SOLD", 19, 66)

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(17, 24, 39)
    doc.text(`${totalQty} Units`, 19, 76)

    // --- Data Table ---
    autoTable(doc, {
        startY: 89,
        head: [["ITEM NAME", "CATEGORY", "COMPANY", "TOTAL SOLD QTY", "SOLD DATE"]],
        body: rows.map((r) => [
            r.itemName,
            r.categoryName,
            r.companyName,
            r.totalSoldQty,
            r.soldDate,
        ]),
        headStyles: {
            fillColor: [243, 244, 246],
            textColor: [55, 65, 81],
            fontStyle: "bold",
            fontSize: 8.5,
            lineWidth: 0.1,
            lineColor: [229, 231, 235],
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [51, 65, 85],
            cellPadding: 4,
        },
        columnStyles: {
            0: { fontStyle: "normal" },
            1: { fontStyle: "bold", textColor: [17, 24, 39] },
            3: { halign: "center" },
            4: { halign: "right" },
        },
        theme: "grid",
        styles: {
            lineColor: [229, 231, 235],
            lineWidth: 0.3,
        },
    })

    // Apply Dynamic Footer & Watermark
    applyPDFDecorations(doc)

    doc.save(`Stock Tracker - Sales Report-${dateStr()}.pdf`)
}

// ══════════════════════════════════════════════════════════════════════════════
//  STOCK SUMMARY EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export const exportStockSummaryCSV = (rows: StockSummaryRow[]) => {
    const data = rows.map((r) => ({
        "Item Name": r.itemName,
        Category: r.categoryName,
        Company: r.companyName,
        "Reorder Level": r.reorderLevel,
        "Available Qty": r.availableQty,
        Status: r.status,
    }))

    const csvContent = Papa.unparse(data)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    triggerDownload(blob, `Stock Tracker - Stock Summary-${dateStr()}.csv`)
}

export const exportStockSummaryPDF = (
    rows: StockSummaryRow[],
    meta?: { categoryName?: string; companyName?: string }
) => {
    // Landscape Mode Initialization
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
    const pageWidth = doc.internal.pageSize.getWidth()

    // --- Top Header ---
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(4, 120, 87)
    doc.text("STOCKTRACKER", 14, 16)

    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(100, 100, 100)
    doc.text("INTERNAL INVENTORY REPORT", 14, 21)

    // Report Date Info (Top Right)
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(100, 100, 100)
    doc.text("REPORT GENERATED", pageWidth - 14, 16, { align: "right" })

    const nowFormatted = new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
    doc.setFont("helvetica", "normal")
    doc.text(nowFormatted, pageWidth - 14, 21, { align: "right" })

    // Header Divider
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.5)
    doc.line(14, 25, pageWidth - 14, 25)

    // Page Sub-Title
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(4, 120, 87)
    doc.text("Stock Level Summary Report", 14, 34)

    // --- Meta Parameter Box ---
    doc.setFillColor(243, 244, 246)
    doc.roundedRect(14, 40, pageWidth - 28, 14, 1, 1, "F")

    doc.setFontSize(7.5)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(107, 114, 128)
    doc.text("REPORT TYPE", 20, 46)
    doc.text("PARAMETERS", 85, 46)

    const categoryLabel = meta?.categoryName || "All Categories"
    const companyLabel = meta?.companyName || "All Companies"

    doc.setFontSize(8.5)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(31, 41, 55)
    doc.text("Complete Inventory", 20, 51)
    doc.setFont("helvetica", "normal")
    doc.text(`${categoryLabel}  |  ${companyLabel}`, 85, 51)

    // Accent vertical pill inside meta box
    doc.setFillColor(4, 120, 87)
    doc.rect(14, 40, 2, 14, "F")

    // --- KPI Cards Section ---
    const totalItems = rows.length
    const lowStockCount = rows.filter(
        (r) =>
            r.status === "Low Stock" ||
            r.status === "Out of Stock"
    ).length

    // Total Items Card
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(229, 231, 235)
    doc.setLineWidth(0.5)
    doc.roundedRect(14, 59, 70, 24, 1, 1, "FD")

    doc.setFontSize(7.5)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(107, 114, 128)
    doc.text("TOTAL ITEMS", 19, 66)

    doc.setFontSize(15)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(17, 24, 39)
    doc.text(`${totalItems}`, 19, 76)

    // Low Stock Items Card (Red Box)
    doc.setFillColor(254, 226, 226) // Light Red bg
    doc.setDrawColor(252, 165, 165)
    doc.roundedRect(90, 59, 70, 24, 1, 1, "FD")

    doc.setFontSize(7.5)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(185, 28, 28)
    doc.text("LOW STOCK ITEMS", 95, 66)

    doc.setFontSize(15)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(153, 27, 27)
    doc.text(`${lowStockCount}`, 95, 76)

    // --- Stock Table ---
    autoTable(doc, {
        startY: 89,
        head: [["ITEM NAME", "CATEGORY", "COMPANY", "REORDER LEVEL", "AVAILABLE QTY", "STATUS"]],
        body: rows.map((r) => [
            r.itemName,
            r.categoryName,
            r.companyName,
            `${r.reorderLevel} Units`,
            `${r.availableQty} Units`,
            r.status === "Low Stock" ? "Low Stock Alert" : r.status,
        ]),
        headStyles: {
            fillColor: [243, 244, 246],
            textColor: [55, 65, 81],
            fontStyle: "bold",
            fontSize: 8.5,
            lineWidth: 0.1,
            lineColor: [229, 231, 235],
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [51, 65, 85],
            cellPadding: 4,
        },
        columnStyles: {
            3: { halign: "center" },
            4: { halign: "center", fontStyle: "bold" },
            5: { halign: "center" },
        },
        theme: "grid",
        styles: {
            lineColor: [229, 231, 235],
            lineWidth: 0.3,
        },
        didParseCell: (data) => {
            // Status Column Custom Badge Colors
            if (data.section === "body" && data.column.index === 5) {
                const statusVal = String(data.cell.raw)
                if (statusVal === "Low Stock Alert" || statusVal === "Out of Stock") {
                    data.cell.styles.fillColor = [254, 226, 226] // Soft Red
                    data.cell.styles.textColor = [153, 27, 27] // Dark Red
                    data.cell.styles.fontStyle = "bold"
                } else {
                    data.cell.styles.fillColor = [209, 250, 229] // Soft Green
                    data.cell.styles.textColor = [4, 120, 87] // Emerald
                    data.cell.styles.fontStyle = "bold"
                }
            }

            // Highlight Available Qty text for low stock items
            if (data.section === "body" && data.column.index === 4) {
                const rowData = rows[data.row.index]
                if (rowData && rowData.availableQty <= rowData.reorderLevel) {
                    data.cell.styles.textColor = [185, 28, 28]
                }
            }
        },
    })

    // Apply Dynamic Footer & Watermark
    applyPDFDecorations(doc)

    doc.save(`Stock Tracker - Stock Summary-${dateStr()}.pdf`)
}