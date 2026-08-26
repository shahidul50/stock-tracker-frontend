import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, TrendingUp, Loader2 } from "lucide-react";
import MyPageSelect from "@/components/shared/MyPageSelect";
import { MyPagination } from "@/components/shared/MyPagination";
import type { SalesReportRow } from "@/types";

interface SalesSummaryProps {
    fromDate: string;
    setFromDate: (value: string) => void;
    toDate: string;
    setToDate: (value: string) => void;
    handleGenerateSalesReport: () => void;
    totalSoldUnits: number;
    fromDateParam: string;
    toDateParam: string;
    isSalesLoading: boolean;
    isSalesError: boolean;
    salesRows: SalesReportRow[];
    pageParam: number;
    pageSize: string;
    salesTotalEntries: number;
    pageSizeOptions: number[];
    handlePageSizeChange: (value: string | null) => void;
    salesTotalPages: number;
    handlePageChange: (newPage: number) => void;
}

export const SalesSummary = ({
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    handleGenerateSalesReport,
    totalSoldUnits,
    fromDateParam,
    toDateParam,
    isSalesLoading,
    isSalesError,
    salesRows,
    pageParam,
    pageSize,
    salesTotalEntries,
    pageSizeOptions,
    handlePageSizeChange,
    salesTotalPages,
    handlePageChange,
}: SalesSummaryProps) => {
    return (
        <TabsContent value="sales" className="space-y-6 m-0">
            {/* Controls Header */}
            <section className="flex flex-wrap items-end gap-4 p-1 sm:p-0">
                <div className="space-y-1.5 min-w-50 flex-1 sm:flex-initial">
                    <label className="text-xs font-semibold text-foreground">From Date</label>
                    <div className="relative">
                        <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground dark:text-gray-300" />
                        <Input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="h-10 pl-9 border-border bg-background text-sm dark:scheme-dark"
                        />
                    </div>
                </div>

                <div className="space-y-1.5 min-w-50 flex-1 sm:flex-initial">
                    <label className="text-xs font-semibold text-foreground">To Date</label>
                    <div className="relative">
                        <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground dark:text-gray-300" />
                        <Input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="h-10 pl-9 border-border bg-background text-sm dark:text-white dark:scheme-dark"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleGenerateSalesReport}
                    className="h-10 bg-emerald-700 font-medium text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 px-6"
                >
                    Generate Report
                </Button>
            </section>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-border bg-card shadow-sm dark:bg-gray-900">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                TOTAL ITEMS SOLD
                            </p>
                            <div className="text-3xl font-extrabold text-foreground mt-1">
                                {totalSoldUnits}{" "}
                                <span className="text-sm font-normal text-muted-foreground">Units</span>
                            </div>
                        </div>
                        <div className="size-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                            <TrendingUp className="size-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-border bg-card shadow-sm dark:bg-gray-900">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                ACTIVE DATE RANGE
                            </p>
                            <div className="text-base sm:text-lg font-bold text-foreground mt-1">
                                {fromDateParam}{" "}
                                <span className="font-normal text-muted-foreground">to</span>{" "}
                                {toDateParam}
                            </div>
                        </div>
                        <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <CalendarIcon className="size-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sales Table Wrapper */}
            <div className="w-full overflow-x-auto">
                <Card className="min-w-75 border border-border bg-card shadow-sm dark:bg-gray-900">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow className="border-b border-border hover:bg-transparent">
                                    <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                        ITEM NAME
                                    </TableHead>
                                    <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                        CATEGORY
                                    </TableHead>
                                    <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                        COMPANY
                                    </TableHead>
                                    <TableHead className="h-12 px-6 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                        TOTAL SOLD QTY
                                    </TableHead>
                                    <TableHead className="h-12 px-6 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                        SOLD DATE
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isSalesLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center">
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                <Loader2 className="size-5 animate-spin" />
                                                <span>Loading sales report...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : isSalesError ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-rose-500 font-medium">
                                            Failed to load sales report data.
                                        </TableCell>
                                    </TableRow>
                                ) : salesRows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            No sales report records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    salesRows.map((row, idx) => (
                                        <TableRow
                                            key={idx}
                                            className="border-b border-border/60 transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="px-6 py-4 font-semibold text-card-foreground whitespace-nowrap">
                                                {row.itemName}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                    variant="outline"
                                                    className="bg-green-200 text-gray-900 dark:bg-green-950/50  dark:text-green-300"
                                                >
                                                    {row.categoryName}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                                                <Badge
                                                    variant="outline"
                                                    className="bg-green-200 text-gray-900 dark:bg-green-950/50  dark:text-green-300"
                                                >
                                                    {row.companyName}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-center font-bold text-card-foreground whitespace-nowrap">
                                                {row.totalSoldQty}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right text-sm text-muted-foreground whitespace-nowrap">
                                                {row.soldDate}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                <section className="flex flex-col gap-4 items-center sm:flex-row justify-center sm:justify-between border-t border-border py-4 sm:py-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                            Showing {salesRows.length > 0 ? (pageParam - 1) * Number(pageSize) + 1 : 0} to{" "}
                            {Math.min(pageParam * Number(pageSize), salesTotalEntries)} of {salesTotalEntries} entries
                        </span>
                        <div className="w-50 flex items-center gap-2">
                            <span>Show Items</span>
                            <MyPageSelect
                                pageSizeOptions={pageSizeOptions}
                                pageSize={pageSize}
                                onChange={handlePageSizeChange}
                            />
                        </div>
                    </div>
                    <div>
                        <MyPagination
                            currentPage={pageParam}
                            totalPages={salesTotalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </section>
            </div>
        </TabsContent>
    );
};

export default SalesSummary;
