import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react"

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
import {
  useCreateItem,
  useDeleteItem,
  useItems,
  useItem,
  useUpdateItem,
} from "@/hooks/use-items"
import { useCompanySelect } from "@/hooks/use-companies"
import { useCategorySelect } from "@/hooks/use-categories"

// Modals & Types
import { ItemAddOrEditModal } from "@/components/modals/ItemAddOrEditModal"
import { DeleteItemModal } from "@/components/modals/DeleteItemModal"
import type { CreateItemFormData } from "@/schemas/item.schema"
import type { Items } from "@/types"

export default function Items() {
  // SearchParams state
  const [searchParams, setSearchParams] = useSearchParams()

  // Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [deletingItem, setDeletingItem] = useState<Items | null>(null)

  // Read URL Params
  const pageParam = Number(searchParams.get("page")) || 1
  const limitParam = searchParams.get("limit") || "10"
  const searchParam = searchParams.get("searchTerm") || ""
  const companyParam = searchParams.get("companyId") || "ALL"
  const categoryParam = searchParams.get("categoryId") || "ALL"

  // Local State
  const [pageSize, setPageSize] = useState<string>(limitParam)
  const [searchTerm, setSearchTerm] = useState<string>(searchParam)
  const [selectedCompany, setSelectedCompany] = useState<string>(companyParam)
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam)

  // Debouncing Search Input (500ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Page Size Options
  const pageSizeOptions = [10, 25, 50]

  // Filter Dropdown Options fetching
  const { data: companySelectData } = useCompanySelect()
  const { data: categorySelectData } = useCategorySelect()

  const companyOptions = companySelectData?.data?.data || []
  const categoryOptions = categorySelectData?.data?.data || []

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

  // Fetch Items Query
  const { data, isLoading, isError } = useItems({
    page: pageParam,
    limit: Number(limitParam),
    searchTerm: searchParam || undefined,
    companyId: selectedCompany !== "ALL" ? selectedCompany : undefined,
    categoryId: selectedCategory !== "ALL" ? selectedCategory : undefined,
  })

  // Fetch the selected item query at the component level.
  const { data: itemDetails } = useItem(selectedItem?.id)

  // Mutations
  const { mutateAsync: createItem, isPending: isCreating } = useCreateItem()
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateItem()
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteItem()

  // API Data Fallbacks
  const items: Items[] = data?.data?.data || []
  const totalEntries = data?.data?.meta?.total || 0
  const totalPages = data?.data?.meta?.totalPages || 1

  // Handlers
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

  // Add / Edit Modal Handlers
  const handleOpenAddModal = () => {
    setSelectedItem(null)
    setIsItemModalOpen(true)
  }

  const handleOpenEditModal = (item: any) => {
    console.log("Selected Item", selectedItem)
    setSelectedItem(item)
    setIsItemModalOpen(true)
  }

  useEffect(() => {
    if (!itemDetails?.data || !selectedItem) return
    setSelectedItem(itemDetails.data)
  }, [itemDetails, selectedItem])

  const handleItemSubmit = async (values: CreateItemFormData) => {
    const itemId = selectedItem?.id

    if (itemId) {
      await updateItem({
        id: itemId,
        payload: values,
      })
    } else {
      await createItem(values)
    }
  }

  // Delete Modal Handlers
  const handleOpenDeleteModal = (item: Items) => {
    setDeletingItem(item)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    console.log("Selected Item", deletingItem)
    if (deletingItem?.id) {
      await deleteItem(deletingItem.id)
      setIsDeleteModalOpen(false)
      setDeletingItem(null)
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <Card className="border border-border bg-card shadow-sm dark:bg-gray-900">
        <CardHeader className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl md:text-3xl">
              Item Setup
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Create and manage inventory items, categories, suppliers, and reorder levels.
            </p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="h-10 w-full sm:w-auto px-5 gap-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium shadow-sm transition-colors"
          >
            <Plus className="size-4" /> Create New Item
          </Button>
        </CardHeader>
      </Card>

      {/* Filter and Search Section */}
      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-card dark:bg-gray-900 p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by item name..."
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
            <SelectTrigger className="h-10 w-full sm:w-44 border-border bg-background">
              <SelectValue placeholder="All Categories" >
                {/* If ALL is selected or the value is empty, 'All Categories' will be displayed. */}
                {selectedCategory === "ALL" || !selectedCategory
                  ? "All Categories"
                  : // Will find and display the label of the selected category from the array.
                  categoryOptions.find((cat: any) => cat.value === selectedCategory)?.label || "Loading..."}
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
            <SelectTrigger className="h-10 w-full sm:w-44 border-border bg-background">
              <SelectValue placeholder="All Companies">
                {/* If ALL is selected or the value is empty, 'All Companies' will be displayed. */}
                {selectedCompany === "ALL" || !selectedCompany
                  ? "All Companies"
                  : // Will find and display the label of the selected company from the array.
                  companyOptions.find((comp: any) => comp.value === selectedCompany)?.label || "Loading..."}
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
                  <TableHead className="h-12 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    ITEM NAME
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    CATEGORY
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    COMPANY
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    REORDER THRESHOLD
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    CURRENT STOCK
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    STATUS
                  </TableHead>
                  <TableHead className="h-12 px-6 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="size-5 animate-spin" />
                        <span>Loading items...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-rose-500 font-medium"
                    >
                      Failed to load items. Please try again.
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => {
                    const isLowStock =
                      item.status === "Low Stock" ||
                      item.availableQuantity <= item.reorderLevel

                    return (
                      <TableRow
                        key={item.id}
                        className="border-b border-border/60 transition-colors hover:bg-muted/30"
                      >
                        {/* Item Name */}
                        <TableCell className="px-3 py-4 font-semibold text-card-foreground whitespace-nowrap  sm:whitespace-normal">
                          {item.name}
                        </TableCell>

                        {/* Category Badge */}
                        <TableCell className="px-3 py-4 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className="bg-green-200 text-gray-900 dark:bg-green-950/50  dark:text-green-300"
                          >
                            {item.categoryName}
                          </Badge>
                        </TableCell>

                        {/* Company */}
                        <TableCell className="px-3 py-4 text-sm text-foreground whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className="bg-green-200 text-gray-900 dark:bg-green-950/50  dark:text-green-300"
                          >
                            {item.companyName}
                          </Badge>

                        </TableCell>

                        {/* Reorder Threshold */}
                        <TableCell className="px-2 py-4 text-sm text-muted-foreground whitespace-nowrap text-center">
                          {item.reorderLevel} units
                        </TableCell>

                        {/* Current Stock */}
                        <TableCell className="px-2 py-4 font-semibold text-foreground whitespace-nowrap text-center">
                          {item.availableQuantity} units
                        </TableCell>

                        {/* Status Badge */}
                        <TableCell className="px-2 py-4 whitespace-nowrap">
                          {isLowStock ? (
                            <span className="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                              In Stock
                            </span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2 text-muted-foreground">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              aria-label="Edit item"
                              className="rounded-md p-1.5 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-muted"
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(item)}
                              aria-label="Delete item"
                              className="rounded-md p-1.5 transition-colors hover:text-rose-600 dark:hover:text-rose-400 hover:bg-muted"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dynamic Pagination Footer */}
        <section className="flex flex-col gap-4 items-center sm:flex-row justify-center sm:justify-between border-t border-border py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span>
              Showing {items.length > 0 ? (pageParam - 1) * Number(pageSize) + 1 : 0} to{" "}
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

      {/* Add / Edit Item Modal */}
      <ItemAddOrEditModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSubmit={handleItemSubmit}
        initialValues={selectedItem}
        categoryOptions={categoryOptions}
        companyOptions={companyOptions}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Item Confirmation Modal */}
      <DeleteItemModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deletingItem?.name}
        isLoading={isDeleting}
      />
    </div>
  )
}