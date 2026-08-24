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
import type { CompanyFormValues } from "@/schemas/company.schema";
import { useDebounce } from "@/hooks/use-debounce";
import { updateQueryParams } from "@/utils/updateQueryParams";
import { useCompanies, useCreateCompany, useDeleteCompany, useUpdateCompany } from "@/hooks/use-companies";
import { CompanyAddOrEditModal } from "@/components/modals/CompanyAddOrEditModal";
import { DeleteCompanyModal } from "@/components/modals/DeleteCompanyModal";

const Companies = () => {
  // SearchParams state
  const [searchParams, setSearchParams] = useSearchParams();

  // Modal States
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletingCompany, setDeletingCompany] = useState<any | null>(null);

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
  const { data, isLoading, isError } = useCompanies({
    page: pageParam,
    limit: Number(limitParam),
    searchTerm: searchParam || undefined,
  });

  const { mutateAsync: createCompany, isPending: isCreating } = useCreateCompany();
  const { mutateAsync: updateCompany, isPending: isUpdating } = useUpdateCompany();
  const { mutateAsync: deleteCompany, isPending: isDeleting } = useDeleteCompany();

  // API Data Fallbacks
  const companies = data?.data?.data || [];
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

  // Add/Edit Company Handlers
  const handleOpenAddModal = () => {
    setSelectedCompany(null);
    setIsCompanyModalOpen(true);
  };

  const handleOpenEditModal = (company: any) => {
    setSelectedCompany(company);
    setIsCompanyModalOpen(true);
  };

  const handleCompanySubmit = async (values: CompanyFormValues) => {
    const companyId = selectedCompany?._id || selectedCompany?.id;

    if (companyId) {
      await updateCompany({
        id: companyId,
        payload: values,
      });
    } else {
      await createCompany(values);
    }
  };

  // Delete Company Handlers
  const handleOpenDeleteModal = (company: any) => {
    setDeletingCompany(company);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const companyId = deletingCompany?._id || deletingCompany?.id;
    if (companyId) {
      await deleteCompany(companyId);
      setIsDeleteModalOpen(false);
      setDeletingCompany(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Company Header Card */}
      <Card className="border border-border bg-card shadow-sm dark:bg-gray-900">
        <CardHeader className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl md:text-3xl">
              Company
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Manage manufacturing companies and suppliers for inventory items 
            </p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="h-10 w-full px-6 gap-2 bg-emerald-700 font-medium text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 sm:w-auto"
          >
            <Plus className="size-4" /> Add Company
          </Button>
        </CardHeader>
      </Card>

      {/* Search Header */}
      <section className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between p-1 sm:p-0">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 border-border bg-background pl-9 text-sm focus-visible:ring-1"
          />
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
          <span className="size-2 rounded-full bg-emerald-600" />
          Total Companies: {totalEntries}
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
                    COMPANY NAME
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    CREATED DATE
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    ITEMS ASSOCIATED
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
                        <span>Loading companies...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-rose-500 font-medium">
                      Failed to load companies. Please try again.
                    </TableCell>
                  </TableRow>
                ) : companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      No companies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company: any) => (
                    <TableRow
                      key={company._id || company.id}
                      className="border-b border-border/60 transition-colors hover:bg-muted/30"
                    >
                      <TableCell className="px-6 py-4 font-semibold text-card-foreground whitespace-nowrap">
                        {company.name || company.companyName}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {company.createdDate}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        >
                          {company.totalItemLinked || 0} Items
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3 text-muted-foreground">
                          <button
                            onClick={() => handleOpenEditModal(company)}
                            aria-label="Edit company"
                            className="rounded-md p-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(company)}
                            aria-label="Delete company"
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
              Showing {companies.length > 0 ? (pageParam - 1) * Number(pageSize) + 1 : 0} to{" "}
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

      {/* Add / Edit Company Modal */}
      <CompanyAddOrEditModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSubmit={handleCompanySubmit}
        initialValues={selectedCompany}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Company Confirmation Modal */}
      <DeleteCompanyModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        companyName={deletingCompany?.name || deletingCompany?.companyName}
        linkedItemsCount={deletingCompany?.totalItemLinked || 0}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Companies;