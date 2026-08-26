import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCategorySelect } from "@/hooks/use-categories";
import { useCompanySelect } from "@/hooks/use-companies";
import {
  useSalesReport,
  useSalesReportExport,
  useStockSummary,
  useStockSummaryExport,
} from "@/hooks/use-reports";
import { updateQueryParams } from "@/utils/updateQueryParams";
import { SalesSummary } from "@/components/report/SalesSummary";
import { StockSummary } from "@/components/report/StockSummary";
import type { SalesReportRow, StockSummaryRow } from "@/types";
import {
  exportSalesReportCSV,
  exportSalesReportPDF,
  exportStockSummaryCSV,
  exportStockSummaryPDF,
} from "@/utils/exportReport";

const Report = () => {
  // SearchParams state
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Params values
  const currentTab = searchParams.get("tab") || "sales";
  const pageParam = Number(searchParams.get("page")) || 1;
  const limitParam = searchParams.get("limit") || "10";
  const fromDateParam = searchParams.get("fromDate") || "2026-08-01";
  const toDateParam = searchParams.get("toDate") || "2026-08-15";
  const categoryParam = searchParams.get("categoryId") || "All";
  const companyParam = searchParams.get("companyId") || "All";

  // Local States
  const [activeTab, setActiveTab] = useState<string>(currentTab);
  const [pageSize, setPageSize] = useState<string>(limitParam);
  const pageSizeOptions = [10, 25, 50];

  // Sales Filter Local State
  const [fromDate, setFromDate] = useState<string>(fromDateParam);
  const [toDate, setToDate] = useState<string>(toDateParam);

  // Stock Filter Local State
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedCompany, setSelectedCompany] = useState<string>(companyParam);

  // Export States
  const [triggerSalesExport, setTriggerSalesExport] = useState(false);
  const [triggerStockExport, setTriggerStockExport] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv">("csv");

  // Dropdown Master Options
  const { data: categoryData } = useCategorySelect();
  const { data: companyData } = useCompanySelect();
  const categoryOptions = categoryData?.data?.data || [];
  const companyOptions = companyData?.data?.data || [];

  // Sync URL Params state change
  useEffect(() => {
    setActiveTab(currentTab);
    setPageSize(limitParam);
  }, [currentTab, limitParam]);

  // Queries
  const { data: salesReportData, isLoading: isSalesLoading, isError: isSalesError } =
    useSalesReport(
      {
        fromDate: fromDateParam,
        toDate: toDateParam,
        page: pageParam,
        limit: Number(limitParam),
      },
      activeTab === "sales"
    );

  const { data: stockSummaryData, isLoading: isStockLoading, isError: isStockError } =
    useStockSummary(
      {
        companyId: companyParam === "All" ? undefined : companyParam,
        categoryId: categoryParam === "All" ? undefined : categoryParam,
        page: pageParam,
        limit: Number(limitParam),
      }
    );

  // Export Hooks
  const { data: salesExportData, isSuccess: isSalesExportSuccess } = useSalesReportExport(
    { fromDate: fromDateParam, toDate: toDateParam },
    triggerSalesExport
  );

  const { data: stockExportData, isSuccess: isStockExportSuccess } = useStockSummaryExport(
    {
      companyId: companyParam === "All" ? undefined : companyParam,
      categoryId: categoryParam === "All" ? undefined : categoryParam,
    },
    triggerStockExport
  );

  // Auto-download when export data arrives
  useEffect(() => {
    if (!isSalesExportSuccess || !triggerSalesExport) return;
    const rows: SalesReportRow[] = salesExportData?.data?.data || [];
    if (rows.length === 0) return;
    if (exportFormat === "csv") exportSalesReportCSV(rows);
    else exportSalesReportPDF(rows);
    setTriggerSalesExport(false);
  }, [isSalesExportSuccess, salesExportData]);

  useEffect(() => {
    if (!isStockExportSuccess || !triggerStockExport) return;
    const rows: StockSummaryRow[] = stockExportData?.data?.data || [];
    if (rows.length === 0) return;
    if (exportFormat === "csv") exportStockSummaryCSV(rows);
    else exportStockSummaryPDF(rows);
    setTriggerStockExport(false);
  }, [isStockExportSuccess, stockExportData]);

  // Data Extraction
  const salesRows: SalesReportRow[] = salesReportData?.data?.data || [];
  const salesTotalEntries = salesReportData?.data?.meta?.total || 0;
  const salesTotalPages = salesReportData?.data?.meta?.totalPages || 1;
  const totalSoldUnits = salesRows.reduce(
    (acc, curr) => acc + (curr.totalSoldQty || 0),
    0
  );

  const stockRows: StockSummaryRow[] = stockSummaryData?.data?.data || [];
  const stockTotalEntries = stockSummaryData?.data?.meta?.total || 0;
  const stockTotalPages = stockSummaryData?.data?.meta?.totalPages || 1;

  // Handlers
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Switching tabs will clear all other params, leaving only the tab param.
    setSearchParams(new URLSearchParams({ tab: value }));
  };

  const handlePageSizeChange = (value: string | null) => {
    if (value === null) return;
    setPageSize(value);
    updateQueryParams({ limit: value, page: 1 }, setSearchParams);
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage }, setSearchParams);
  };

  const handleGenerateSalesReport = () => {
    updateQueryParams(
      {
        fromDate,
        toDate,
        page: 1,
      },
      setSearchParams
    );
  };

  const handleFilterStockSummary = () => {
    updateQueryParams(
      {
        categoryId: selectedCategory === "All" ? undefined : selectedCategory,
        companyId: selectedCompany === "All" ? undefined : selectedCompany,
        page: 1,
      },
      setSearchParams
    );
  };

  const handleClearStockFilter = () => {
    setSelectedCategory("All");
    setSelectedCompany("All");
    updateQueryParams(
      {
        categoryId: undefined,
        companyId: undefined,
        page: 1,
      },
      setSearchParams
    );
  };

  const handleExport = (format: "pdf" | "csv") => {
    setExportFormat(format);
    if (activeTab === "sales") {
      setTriggerSalesExport(true);
    } else {
      setTriggerStockExport(true);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Card */}
      <Card className="border border-border bg-card shadow-sm dark:bg-gray-900">
        <CardHeader className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl md:text-3xl">
              Reports & Analytics
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Generate and review stock level summaries and date-wise sales performance
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button className="h-10 w-full px-5 gap-2 bg-emerald-700 font-medium text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 sm:w-auto">
                  <Download className="size-4" />
                  Export Report
                  <ChevronDown className="size-4 opacity-80" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => handleExport("pdf")}
                className="gap-2 cursor-pointer"
              >
                <FileText className="size-4 text-rose-500" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport("csv")}
                className="gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="size-4 text-emerald-600" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
      </Card>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
        <TabsList className="bg-transparent p-0 border-b border-border w-full justify-start rounded-none h-auto gap-8">
          <TabsTrigger
            value="sales"
            className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-medium text-muted-foreground data-[state=active]:border-emerald-700 data-[state=active]:text-emerald-700 dark:data-[state=active]:border-emerald-500 dark:data-[state=active]:text-emerald-400 bg-transparent shadow-none"
          >
            Date-Wise Sales Report
          </TabsTrigger>
          <TabsTrigger
            value="stock"
            className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-medium text-muted-foreground data-[state=active]:border-emerald-700 data-[state=active]:text-emerald-700 dark:data-[state=active]:border-emerald-500 dark:data-[state=active]:text-emerald-400 bg-transparent shadow-none"
          >
            Stock Level Summary
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: DATE-WISE SALES REPORT */}
        <SalesSummary
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          handleGenerateSalesReport={handleGenerateSalesReport}
          totalSoldUnits={totalSoldUnits}
          fromDateParam={fromDateParam}
          toDateParam={toDateParam}
          isSalesLoading={isSalesLoading}
          isSalesError={isSalesError}
          salesRows={salesRows}
          pageParam={pageParam}
          pageSize={pageSize}
          salesTotalEntries={salesTotalEntries}
          pageSizeOptions={pageSizeOptions}
          handlePageSizeChange={handlePageSizeChange}
          salesTotalPages={salesTotalPages}
          handlePageChange={handlePageChange}
        />

        {/* TAB 2: STOCK LEVEL SUMMARY */}
        <StockSummary
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categoryOptions={categoryOptions}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          companyOptions={companyOptions}
          handleFilterStockSummary={handleFilterStockSummary}
          handleClearStockFilter={handleClearStockFilter}
          isStockLoading={isStockLoading}
          isStockError={isStockError}
          stockRows={stockRows}
          pageParam={pageParam}
          pageSize={pageSize}
          stockTotalEntries={stockTotalEntries}
          pageSizeOptions={pageSizeOptions}
          handlePageSizeChange={handlePageSizeChange}
          stockTotalPages={stockTotalPages}
          handlePageChange={handlePageChange}
        />
      </Tabs>
    </div>
  );
};

export default Report;