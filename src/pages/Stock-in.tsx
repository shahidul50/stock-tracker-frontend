import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useForm, useSelector } from "@tanstack/react-form"
import {
  Info,
  Loader2,
  Minus,
  Plus,
  Save,
  Search,
} from "lucide-react"

import MyPageSelect from "@/components/shared/MyPageSelect"
import { MyPagination } from "@/components/shared/MyPagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDebounce } from "@/hooks/use-debounce"
import { updateQueryParams } from "@/utils/updateQueryParams"

// Custom TanStack Query Hooks
import { useCategorySelect } from "@/hooks/use-categories"
import { useCompanySelect } from "@/hooks/use-companies"
import { useItem, useItemSelect } from "@/hooks/use-items"
import { useCreateStockIn, useStockInHistory } from "@/hooks/use-stock-in"

// Schemas & Types
import type { StockInHistory } from "@/types"
import { stockInSchema } from "@/schemas/stock-in.schema"

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === "string") return message
  }
  return "This field is invalid."
}

export default function StockIn() {
  // SearchParams state
  const [searchParams, setSearchParams] = useSearchParams()

  // Read URL Params
  const pageParam = Number(searchParams.get("page")) || 1
  const limitParam = searchParams.get("limit") || "10"
  const searchParam = searchParams.get("searchTerm") || ""
  const companyParam = searchParams.get("companyId") || "ALL"
  const categoryParam = searchParams.get("categoryId") || "ALL"

  // Local State for History Filters
  const [pageSize, setPageSize] = useState<string>(limitParam)
  const [searchTerm, setSearchTerm] = useState<string>(searchParam)
  const [selectedCompany, setSelectedCompany] = useState<string>(companyParam)
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam)

  // Local State for Stock-In Form Cascade Filters
  const [formCategory, setFormCategory] = useState<string>("")
  const [formCompany, setFormCompany] = useState<string>("")

  // Debouncing Search Input (500ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Page Size Options
  const pageSizeOptions = [10, 25, 50]

  // Filter Dropdown Options fetching
  const { data: companySelectData } = useCompanySelect()
  const { data: categorySelectData } = useCategorySelect()

  const companyOptions = companySelectData?.data?.data || []
  const categoryOptions = categorySelectData?.data?.data || []

  // Item Select Dropdown status check
  const isItemDropdownEnabled = Boolean(formCategory && formCompany)

  // Fetch items based on categoryId and companyId
  const { data: itemSelectRes, isLoading: isItemsLoading } = useItemSelect(
    formCategory,
    formCompany
  )
  const availableItems = Array.isArray(itemSelectRes?.data?.data)
    ? itemSelectRes.data.data
    : Array.isArray(itemSelectRes?.data)
      ? itemSelectRes.data
      : []

  // Sync Search Input to URL Params
  useEffect(() => {
    if (debouncedSearchTerm !== searchParam) {
      updateQueryParams(
        {
          searchTerm: debouncedSearchTerm,
          page: 1,
        },
        setSearchParams
      )
    }
  }, [debouncedSearchTerm])

  // Fetch Stock-In History Query
  const { data: historyRes, isLoading: isHistoryLoading, isError } = useStockInHistory({
    page: pageParam,
    limit: Number(limitParam),
    searchTerm: searchParam || undefined,
    companyId: selectedCompany !== "ALL" ? selectedCompany : undefined,
    categoryId: selectedCategory !== "ALL" ? selectedCategory : undefined,
  })

  // Mutations
  const { mutateAsync: createStockIn, isPending: isCreating } = useCreateStockIn()

  // API Data Fallbacks
  const historyList: StockInHistory[] = historyRes?.data?.data || []
  const totalEntries = historyRes?.data?.meta?.total || 0
  const totalPages = historyRes?.data?.meta?.totalPages || 1

  // Form Setup
  const form = useForm({
    defaultValues: {
      itemId: "",
      quantity: 1,
    },
    validators: {
      onSubmit: stockInSchema,
    },
    onSubmit: async ({ value }) => {
      await createStockIn({
        itemId: value.itemId,
        quantity: value.quantity,
      })
      form.reset({ itemId: "", quantity: 1 })
      setFormCategory("")
      setFormCompany("")
    },
  })

  // Selected Item Id & Fetch Item Details via useItem Hook
  const selectedItemId = useSelector(form.store, (state) => state.values.itemId)
  const { data: itemDetailRes, isLoading: isItemDetailLoading } = useItem(selectedItemId)
  const selectedItemDetails = itemDetailRes?.data

  // Handlers for History Table
  const handlePageSizeChange = (value: string | null) => {
    if (value === null) return
    setPageSize(value)
    updateQueryParams({ limit: value, page: 1 }, setSearchParams)
  }

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage }, setSearchParams)
  }

  const handleCompanyFilterChange = (value: string | null) => {
    if (value === null) return
    setSelectedCompany(value)
    updateQueryParams(
      { companyId: value !== "ALL" ? value : null, page: 1 },
      setSearchParams
    )
  }

  const handleCategoryFilterChange = (value: string | null) => {
    if (value === null) return
    setSelectedCategory(value)
    updateQueryParams(
      { categoryId: value !== "ALL" ? value : null, page: 1 },
      setSearchParams
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <Card className="border border-border bg-card shadow-sm dark:bg-gray-900">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl md:text-3xl">
            Stock In
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Receive new stock items into the warehouse and update stock quantities.
          </p>
        </CardHeader>
      </Card>

      {/* Entry Form and Preview Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left Side: Stock Entry Form */}
        <Card className="border border-border bg-card shadow-sm dark:bg-gray-900 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Stock Entry Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-5"
            >
              {/* Category & Company Grid */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Category
                  </label>
                  <Select
                    value={formCategory}
                    onValueChange={(val) => {
                      setFormCategory(val ?? "")
                      form.setFieldValue("itemId", "")
                    }}
                  >
                    <SelectTrigger className="h-10 py-5 w-full border-border bg-background">
                      <SelectValue placeholder="Select Category">
                        {categoryOptions.find((cat: any) => cat.value === formCategory)
                          ?.label || "Select Category"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((cat: any) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Company
                  </label>
                  <Select
                    value={formCompany}
                    onValueChange={(val) => {
                      setFormCompany(val ?? "")
                      form.setFieldValue("itemId", "")
                    }}
                  >
                    <SelectTrigger className="h-10 py-5 w-full border-border bg-background">
                      <SelectValue placeholder="Select Company">
                        {companyOptions.find((comp: any) => comp.value === formCompany)
                          ?.label || "Select Company"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {companyOptions.map((comp: any) => (
                        <SelectItem key={comp.value} value={comp.value}>
                          {comp.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Item and Quantity Fields */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_13rem] md:items-start">
                <form.Field
                name="itemId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  const selectedItemName = availableItems.find(
                    (item: any) => (item.id || item.value || item._id) === field.state.value
                  )?.name || availableItems.find(
                    (item: any) => (item.id || item.value || item._id) === field.state.value
                  )?.label

                  return (
                    <div className="w-full space-y-1.5">
                      <label
                        htmlFor={field.name}
                        className="text-xs sm:text-sm font-medium text-foreground"
                      >
                        Item <span className="text-rose-500">*</span>
                      </label>
                      <Select
                        disabled={!isItemDropdownEnabled || isItemsLoading}
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val ?? "")}
                      >
                        <SelectTrigger id={field.name} className="h-10 py-5 w-full border-border bg-background">
                          <SelectValue placeholder="Select Item">
                            {isItemsLoading
                              ? "Loading items..."
                              : selectedItemName || "Select Item"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {availableItems.length === 0 ? (
                            <div className="p-2 text-xs text-center text-muted-foreground">
                              No items found
                            </div>
                          ) : (
                            availableItems.map((item: any) => {
                              const itemId = item.id || item.value || item._id
                              const itemName = item.name || item.label
                              return (
                                <SelectItem key={itemId} value={itemId}>
                                  {itemName}
                                </SelectItem>
                              )
                            })
                          )}
                        </SelectContent>
                      </Select>
                      {!isItemDropdownEnabled && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Please select Category and Company first to enable Item selection.
                        </p>
                      )}
                      {isInvalid && (
                        <p className="mt-1 text-xs text-destructive" role="alert">
                          {field.state.meta.errors.map(getErrorMessage).join(", ")}
                        </p>
                      )}
                    </div>
                  )
                }}
                />

                <form.Field
                name="quantity"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                  <div className="space-y-1.5 md:min-w-52">
                    <label className="text-xs sm:text-sm font-medium text-foreground">
                      Stock In Quantity <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 sm:not-first:max-w-50">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-10 shrink-0 border-border bg-background"
                        onClick={() =>
                          field.handleChange(Math.max(1, field.state.value - 1))
                        }
                      >
                        <Minus className="size-4" />
                      </Button>
                      <Input
                        type="text"
                        min="1"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        className="h-10 text-center font-medium border-border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-10 shrink-0 border-border bg-background"
                        onClick={() => field.handleChange(field.state.value + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    {isInvalid && (
                      <p className="mt-1 text-xs text-destructive" role="alert">
                        {field.state.meta.errors.map(getErrorMessage).join(", ")}
                      </p>
                    )}
                  </div>
                )}}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isCreating}
                className="w-full sm:w-60 h-10 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium shadow-sm transition-colors gap-2 px-5 mt-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save Stock In Transaction
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Side: Current Item Info Card */}
        <Card className="border border-border bg-muted/40 dark:bg-gray-900 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Info className="size-6" />
              <span className="text-lg">CURRENT ITEM INFO</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {isItemDetailLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                <span className="text-sm">Fetching item details...</span>
              </div>
            ) : (
              <>
                {/* Available Stock Box */}
                <div className="rounded-lg border border-border bg-background p-4 shadow-2xs">
                  <span className="text-xs uppercase font-medium text-muted-foreground tracking-wider">
                    CURRENT AVAILABLE STOCK
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                    {selectedItemDetails ? `${selectedItemDetails.availableQuantity ?? 0} Units` : "--"}
                  </div>
                </div>

                {/* Threshold & Status */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reorder Threshold</span>
                    <span className="font-semibold bg-muted px-2.5 py-1 rounded text-xs border border-border">
                      {selectedItemDetails ? `${selectedItemDetails.reorderLevel ?? 0} Units` : "--"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    {selectedItemDetails ? (
                      selectedItemDetails.availableQuantity <= selectedItemDetails.reorderLevel ? (
                        <Badge variant="outline" className="bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                          Sufficient Stock
                        </Badge>
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">No item selected</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filter Section for History */}
      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-card dark:bg-gray-900 p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 border-border bg-background pl-9 text-sm focus-visible:ring-1"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onValueChange={handleCategoryFilterChange}
          >
            <SelectTrigger className="h-10 py-5 w-full sm:w-44 border-border bg-background">
              <SelectValue placeholder="All Categories">
                {selectedCategory === "ALL" || !selectedCategory
                  ? "All Categories"
                  : categoryOptions.find((cat: any) => cat.value === selectedCategory)?.label || "Loading..."}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categoryOptions.map((cat: any) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Company Filter */}
          <Select
            value={selectedCompany}
            onValueChange={handleCompanyFilterChange}
          >
            <SelectTrigger className="h-10 py-5 w-full sm:w-44 border-border bg-background">
              <SelectValue placeholder="All Companies">
                {selectedCompany === "ALL" || !selectedCompany
                  ? "All Companies"
                  : companyOptions.find((comp: any) => comp.value === selectedCompany)?.label || "Loading..."}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Companies</SelectItem>
              {companyOptions.map((comp: any) => (
                <SelectItem key={comp.value} value={comp.value}>
                  {comp.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* --- TABLE WRAPPER --- */}
      <div className="w-full overflow-x-auto">
        <Card className="min-w-75 border border-border bg-card shadow-sm dark:bg-gray-900">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    DATE & TIME
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    ITEM NAME
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    CATEGORY
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    COMPANY
                  </TableHead>
                  <TableHead className="h-12 px-6 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    QUANTITY ADDED
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isHistoryLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="size-5 animate-spin" />
                        <span>Loading stock history...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-rose-500 font-medium"
                    >
                      Failed to load stock-in history. Please try again.
                    </TableCell>
                  </TableRow>
                ) : historyList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No stock-in history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  historyList.map((item) => (
                    <TableRow
                      key={item._id}
                      className="border-b border-border/60 transition-colors hover:bg-muted/30"
                    >
                      {/* Date & Time */}
                      <TableCell className="px-4 py-4 text-sm font-medium text-card-foreground whitespace-nowrap">
                        {item.createdDateTime}
                      </TableCell>

                      {/* Item Name */}
                      <TableCell className="px-6 py-4 font-semibold text-card-foreground whitespace-nowrap sm:whitespace-normal">
                        {item.itemName}
                      </TableCell>

                      {/* Category Badge */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="bg-green-200 text-gray-900 dark:bg-green-950/50 dark:text-green-300"
                        >
                          {item.categoryName}
                        </Badge>
                      </TableCell>

                      {/* Company Badge */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="bg-green-200 text-gray-900 dark:bg-green-950/50 dark:text-green-300"
                        >
                          {item.companyName}
                        </Badge>
                      </TableCell>

                      {/* Quantity Added */}
                      <TableCell className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        +{item.quantity}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dynamic Pagination Footer */}
        <section className="flex flex-col gap-4 items-center sm:flex-row justify-center sm:justify-between border-t border-border py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span>
              Showing {historyList.length > 0 ? (pageParam - 1) * Number(pageSize) + 1 : 0} to{" "}
              {Math.min(pageParam * Number(pageSize), totalEntries)} of {totalEntries} entries
            </span>
            <div className="w-50 flex items-center gap-2">
              <span>Show items</span>
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
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </div>
    </div>
  )
}