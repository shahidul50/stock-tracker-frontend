import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";

import MyPageSelect from "@/components/shared/MyPageSelect";
import { MyPagination } from "@/components/shared/MyPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-categories";
import {CategoryAddOrEditModal} from "@/components/modals/CategoryAddOrEditModal";
import { DeleteCategoryModal } from "@/components/modals/DeleteCategoryModal";
import type { CategoryFormValues } from "@/schemas/category.schema";
import { useDebounce } from "@/hooks/use-debounce";
import { updateQueryParams } from "@/utils/updateQueryParams";

const Categories = () => {
  // SearchParams state
  const [searchParams, setSearchParams] = useSearchParams();

  // Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletingCategory, setDeletingCategory] = useState<any | null>(null);

  // get data from URL Params
  const pageParam = Number(searchParams.get("page")) || 1;
  const limitParam = searchParams.get("limit") || "10";
  const searchParam = searchParams.get("searchTerm") || "";

  // Local State
  const [pageSize, setPageSize] = useState<string>(limitParam);
  const [searchTerm, setSearchTerm] = useState<string>(searchParam);

  // Debouncing Search Input (500ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // fetch data limit
  const pageSizeOptions = [10, 25, 50];

  // if change debounced search term then URL Sync and Page Reset
  useEffect(() => {
    if (debouncedSearchTerm !== searchParam) {
      updateQueryParams({
        searchTerm: debouncedSearchTerm,
        page: 1, // Will reset to page 1 during search.
      }, setSearchParams);
    }
  }, [debouncedSearchTerm]);

  // TanStack Query & Mutation Hooks
  const { data, isLoading, isError } = useCategories({
    page: pageParam,
    limit: Number(limitParam),
    searchTerm: searchParam || undefined,
  });

  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  // API Data Fallbacks
  const categories = data?.data?.data || [];
  const totalEntries = data?.data?.meta?.total || 0;
  const totalPages = data?.data?.meta?.totalPages || 1;

  // Handlers
  const handlePageSizeChange = (value: string | null) => {
    if (value === null) return;
    setPageSize(value);
    updateQueryParams({ limit: value, page: 1 }, setSearchParams);
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage }, setSearchParams);
  };

  // Add/Edit Category Handlers
  const handleOpenAddModal = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditModal = (category: any) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (values: CategoryFormValues) => {
    const categoryId = selectedCategory?._id || selectedCategory?.id;

    if (categoryId) {
      await updateCategory({
        id: categoryId,
        payload: values,
      });
    } else {
      await createCategory(values);
    }
  };

  // Delete Category Handlers
  const handleOpenDeleteModal = (category: any) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const categoryId = deletingCategory?._id || deletingCategory?.id;
    if (categoryId) {
      await deleteCategory(categoryId);
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Category Header Card */}
      <Card className="border border-border bg-card shadow-sm dark:bg-gray-900">
        <CardHeader className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl md:text-3xl">
              Categories
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Manage and organize product categories
            </p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="h-10 w-full px-6 gap-2 bg-emerald-700 font-medium text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 sm:w-auto"
          >
            <Plus className="size-4" /> Add Category
          </Button>
        </CardHeader>
      </Card>

      {/* Search Header */}
      <section className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between p-1 sm:p-0">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search category name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 border-border bg-background pl-9 text-sm focus-visible:ring-1"
          />
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
          <span className="size-2 rounded-full bg-emerald-600" />
          Total Categories: {totalEntries}
        </div>
      </section>

      {/* --- TABLE WRAPPER --- */}
      <div className="w-full overflow-x-auto">
        <Card className="min-w-75 border border-border bg-card shadow-sm dark:bg-gray-900">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    CATEGORY NAME
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    CREATED DATE
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    TOTAL ITEMS LINKED
                  </TableHead>
                  <TableHead className="h-12 px-6 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="size-5 animate-spin" />
                        <span>Loading categories...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-rose-500 font-medium">
                      Failed to load categories. Please try again.
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category: any) => (
                    <TableRow
                      key={category._id || category.id}
                      className="border-b border-border/60 transition-colors hover:bg-muted/30"
                    >
                      <TableCell className="px-6 py-4 font-semibold text-card-foreground whitespace-nowrap">
                        {category.name || category.categoryName}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {category.createdDate}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        >
                          {category.totalItemLinked || 0} Items
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3 text-muted-foreground">
                          <button
                            onClick={() => handleOpenEditModal(category)}
                            aria-label="Edit category"
                            className="rounded-md p-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(category)}
                            aria-label="Delete category"
                            className="rounded-md p-1 hover:text-rose-600 dark:hover:text-rose-400"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
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
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Showing {categories.length > 0 ? (pageParam - 1) * Number(pageSize) + 1 : 0} to{" "}
              {Math.min(pageParam * Number(pageSize), totalEntries)} of {totalEntries} entries
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
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </div>

      {/* Add / Edit Category Modal */}
      <CategoryAddOrEditModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        initialValues={selectedCategory}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Category Confirmation Modal */}
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        categoryName={deletingCategory?.name || deletingCategory?.categoryName}
        totalItemsLinked={deletingCategory?.totalItemLinked || 0}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Categories;