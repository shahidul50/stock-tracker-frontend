import { TabsContent } from "@/components/ui/tabs";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Filter, X, Loader2 } from "lucide-react";
import MyPageSelect from "@/components/shared/MyPageSelect";
import { MyPagination } from "@/components/shared/MyPagination";
import type { StockSummaryRow } from "@/types";

interface StockSummaryProps {
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    categoryOptions: any[];
    selectedCompany: string;
    setSelectedCompany: (value: string) => void;
    companyOptions: any[];
    handleFilterStockSummary: () => void;
    handleClearStockFilter: () => void;
    isStockLoading: boolean;
    isStockError: boolean;
    stockRows: StockSummaryRow[];
    pageParam: number;
    pageSize: string;
    stockTotalEntries: number;
    pageSizeOptions: number[];
    handlePageSizeChange: (value: string | null) => void;
    stockTotalPages: number;
    handlePageChange: (newPage: number) => void;
}

export const StockSummary = ({
    selectedCategory,
    setSelectedCategory,
    categoryOptions,
    selectedCompany,
    setSelectedCompany,
    companyOptions,
    handleFilterStockSummary,
    handleClearStockFilter,
    isStockLoading,
    isStockError,
    stockRows,
    pageParam,
    pageSize,
    stockTotalEntries,
    pageSizeOptions,
    handlePageSizeChange,
    stockTotalPages,
    handlePageChange,
}: StockSummaryProps) => {
    return (
        <TabsContent value="stock" className="space-y-6 m-0">
            {/* Controls Header & Search */}
            <section className="flex flex-wrap items-center justify-between gap-4 p-1 sm:p-0">
                <div className="flex flex-wrap items-center gap-4 flex-1">
                    <div className="space-y-1.5 min-w-50 flex-1 sm:flex-initial">
                        <label className="text-xs font-semibold text-foreground">Select Category</label>
                        <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val || "")}>
                            <SelectTrigger className="h-10 border-border bg-background w-full py-5">
                                <SelectValue placeholder="All Categories">
                                    {/* If ALL is selected or the value is empty, 'All Categories' will be displayed. */}
                                    {selectedCategory === "All" || !selectedCategory
                                        ? "All Categories"
                                        : // Will find and display the label of the selected category from the array.
                                        categoryOptions.find((cat: any) => cat.value === selectedCategory)?.label || "Loading..."}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Categories</SelectItem>
                                {categoryOptions.map((cat: any) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5 min-w-50 flex-1 sm:flex-initial">
                        <label className="text-xs font-semibold text-foreground">Select Company</label>
                        <Select value={selectedCompany} onValueChange={(val) => setSelectedCompany(val || "")}>
                            <SelectTrigger className="h-10 border-border bg-background w-full py-5">
                                <SelectValue placeholder="All Companies">
                                    {/* If ALL is selected or the value is empty, 'All Companies' will be displayed. */}
                                    {selectedCompany === "All" || !selectedCompany
                                        ? "All Companies"
                                        : // Will find and display the label of the selected company from the array.
                                        companyOptions.find((comp: any) => comp.value === selectedCompany)?.label || "Loading..."}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Companies</SelectItem>
                                {companyOptions.map((comp: any) => (
                                    <SelectItem key={comp.value} value={comp.value}>
                                        {comp.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleFilterStockSummary}
                        variant="outline"
                        className="w-full sm:w-auto h-10 mt-0 sm:mt-3.5 border-emerald-700 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950/40 gap-2 cursor-pointer"
                    >
                        <Filter className="size-4" />
                        Filter Summary
                    </Button>

                    <Button
                        onClick={handleClearStockFilter}
                        variant="outline"
                        className="w-full sm:w-auto h-10 mt-0 sm:mt-3.5 text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
                    >
                        <X className="size-4" />
                        Clear Filter
                    </Button>
                </div>
            </section>

            {/* Stock Table Wrapper */}
            <div className="w-full overflow-x-auto">
                <Card className="min-w-75 border border-border bg-card shadow-sm dark:bg-gray-900">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow className="border-b border-border hover:bg-transparent">
                                    <TableHead className="h-12 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                        ITEM NAME
                                    </TableHead>
                                    <TableHead className="h-12 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                        CATEGORY
                                    </TableHead>
                                    <TableHead className="h-12 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                        COMPANY
                                    </TableHead>
                                    <TableHead className="h-12 px-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                        REORDER LEVEL
                                    </TableHead>
                                    <TableHead className="h-12 px-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                        AVAILABLE QUANTITY
                                    </TableHead>
                                    <TableHead className="h-12 px-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                        STOCK STATUS
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isStockLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center">
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                <Loader2 className="size-5 animate-spin" />
                                                <span>Loading stock summary...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : isStockError ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-rose-500 font-medium">
                                            Failed to load stock summary data.
                                        </TableCell>
                                    </TableRow>
                                ) : stockRows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                            No stock inventory records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    stockRows.map((row, idx) => {
                                        const isLowStock =
                                            row.status === "Low Stock" || row.status === "Out of Stock";
                                        return (
                                            <TableRow
                                                key={idx}
                                                className="border-b border-border/60 transition-colors hover:bg-muted/30"
                                            >
                                                <TableCell className="px-3 py-4 font-semibold text-card-foreground whitespace-nowrap sm:whitespace-normal">
                                                    {row.itemName}
                                                </TableCell>
                                                <TableCell className="px-3 py-4 whitespace-nowrap">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-green-200 text-gray-900 dark:bg-green-950/50  dark:text-green-300"
                                                    >
                                                        {row.categoryName}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-3 py-4 text-sm text-muted-foreground whitespace-nowrap">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-green-200 text-gray-900 dark:bg-green-950/50  dark:text-green-300"
                                                    >
                                                        {row.companyName}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-3 py-4 text-center text-sm text-muted-foreground whitespace-nowrap">
                                                    {row.reorderLevel} Units
                                                </TableCell>
                                                <TableCell className="px-3 py-4 text-center font-bold text-card-foreground whitespace-nowrap">
                                                    {row.availableQty} Units
                                                </TableCell>
                                                <TableCell className="px-3 py-4 text-right whitespace-nowrap">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            isLowStock
                                                                ? "rounded-full border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-400"
                                                                : "rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-400"
                                                        }
                                                    >
                                                        {row.status === "Low Stock" ? "Low Stock Alert" : row.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                <section className="flex flex-col gap-4 items-center sm:flex-row justify-center sm:justify-between border-t border-border py-4 sm:py-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                            Showing {stockRows.length > 0 ? (pageParam - 1) * Number(pageSize) + 1 : 0} to{" "}
                            {Math.min(pageParam * Number(pageSize), stockTotalEntries)} of {stockTotalEntries} entries
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
                            totalPages={stockTotalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </section>
            </div>
        </TabsContent>
    );
};

export default StockSummary;
