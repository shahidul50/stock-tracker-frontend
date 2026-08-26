import { useState } from "react"
import {
  Archive,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Minus,
  Plus,
  PlusCircle,
  Trash2,
  XCircle,
} from "lucide-react"

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

// Custom TanStack Query Hooks
import { useCategorySelect } from "@/hooks/use-categories"
import { useCompanySelect } from "@/hooks/use-companies"
import { useItem, useItemSelect } from "@/hooks/use-items"
import {
  useRecordStockOut,
  useTodayStockOutCount,
} from "@/hooks/use-stock-out"
import { ScrollArea } from "@/components/ui/scroll-area"

type StockOutType = "Sell" | "Damage" | "Lost"

interface QueueItem {
  itemId: string
  name: string
  companyName: string
  categoryName: string
  quantity: number
  availableQuantity: number
}

export default function StockOut() {
  // Local state for Item Selection Cascading Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [selectedItemId, setSelectedItemId] = useState<string>("")
  const [dispatchQuantity, setDispatchQuantity] = useState<number>(1)

  // Local state for Cart / Queue
  const [queue, setQueue] = useState<QueueItem[]>([])

  // Fetch Category & Company Dropdowns
  const { data: categorySelectData } = useCategorySelect()
  const { data: companySelectData } = useCompanySelect()

  const categoryOptions = categorySelectData?.data?.data || []
  const companyOptions = companySelectData?.data?.data || []

  // Check if Item dropdown should be enabled
  const isItemDropdownEnabled = Boolean(selectedCategory && selectedCompany)

  // Fetch Items based on selected Category & Company
  const { data: itemSelectRes, isLoading: isItemsLoading } = useItemSelect(
    selectedCategory,
    selectedCompany
  )
  const availableItems = Array.isArray(itemSelectRes?.data?.data)
    ? itemSelectRes.data.data
    : Array.isArray(itemSelectRes?.data)
      ? itemSelectRes.data
      : []

  // Fetch Single Item Detail for Available Stock Count
  const { data: itemDetailRes, isLoading: isItemDetailLoading } = useItem(selectedItemId)
  const selectedItemDetails = itemDetailRes?.data

  // Stock Out Mutation & Today's Count Query
  const { mutateAsync: recordStockOut, isPending: isSubmitting } = useRecordStockOut()
  const { data: todayCountRes, isLoading: isTodayCountLoading } = useTodayStockOutCount()

  const todayCount = todayCountRes?.data?.count ?? 0

  // Total Summary Calculations for Queue
  const totalItemsCount = queue.length
  const totalUnitsCount = queue.reduce((acc, curr) => acc + curr.quantity, 0)

  // Add Item to Queue
  const handleAddToQueue = () => {
    if (!selectedItemId || !selectedItemDetails) return

    const availableStock = selectedItemDetails.availableQuantity ?? 0
    const categoryName = categoryOptions.find((c: any) => c.value === selectedCategory)?.label || ""
    const companyName = companyOptions.find((c: any) => c.value === selectedCompany)?.label || ""
    const itemName = selectedItemDetails.name || "Unknown Item"

    setQueue((prev) => {
      const existingIndex = prev.findIndex((i) => i.itemId === selectedItemId)

      // If item is already in the queue, update its quantity
      if (existingIndex > -1) {

        const existingItem = prev[existingIndex]
        const newQty = existingItem.quantity + dispatchQuantity
        const cappedQty = Math.min(newQty, availableStock)
        //copy array and update
        const updated = [...prev]
        //Immutably creates a new copy of the specified object and updates it.
        updated[existingIndex] = {
          ...existingItem,
          quantity: cappedQty,
        }
        return updated
      }

      return [
        ...prev,
        {
          itemId: selectedItemId,
          name: itemName,
          categoryName,
          companyName,
          quantity: Math.min(dispatchQuantity, availableStock),
          availableQuantity: availableStock,
        },
      ]
    })

    // Reset Form Fields
    setSelectedItemId("")
    setDispatchQuantity(1)
  }

  // Remove Item from Queue
  const handleRemoveFromQueue = (itemId: string) => {
    setQueue((prev) => prev.filter((item) => item.itemId !== itemId))
  }

  // Submit Bulk Stock Out Transaction
  const handleProcessStockOut = async (type: StockOutType) => {
    if (queue.length === 0) return

    const payload = {
      items: queue.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
        type,
      })),
    }

    try {
      await recordStockOut(payload)
      setQueue([]) // Clear Queue after successful dispatch
    } catch (error) {
      console.error("Failed to process stock out:", error)
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Stock Out Processing
        </h1>
        <p className="text-sm text-muted-foreground">
          Process product sales, damage entries, and inventory dispatch items
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">

        {/* LEFT COLUMN: Item Selection & Counter (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Item Selection Card */}
          <Card className="border border-border bg-card shadow-xs dark:bg-gray-900">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-card-foreground">
                Item Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Category Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Category</label>
                <Select
                  value={selectedCategory}
                  onValueChange={(val) => {
                    setSelectedCategory(val ?? "")
                    setSelectedItemId("")
                  }}
                >
                  <SelectTrigger className="w-full py-5 h-10 border-border bg-background">
                    <SelectValue placeholder="Select Category">
                      {categoryOptions.find((cat: any) => cat.value === selectedCategory)?.label || "Select Category"}
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

              {/* Company / Vendor Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Company / Vendor</label>
                <Select
                  value={selectedCompany}
                  onValueChange={(val) => {
                    setSelectedCompany(val ?? "")
                    setSelectedItemId("")
                  }}
                >
                  <SelectTrigger className="w-full py-5 h-10 border-border bg-background">
                    <SelectValue placeholder="Select Company">
                      {companyOptions.find((comp: any) => comp.value === selectedCompany)?.label || "Select Company"}
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

              {/* Item Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Item</label>
                <Select
                  disabled={!isItemDropdownEnabled || isItemsLoading}
                  value={selectedItemId}
                  onValueChange={(val) => setSelectedItemId(val ?? "")}
                >
                  <SelectTrigger className="w-full py-5 h-10 border-border bg-background">
                    <SelectValue placeholder="Select Item">
                      {isItemsLoading
                        ? "Loading items..."
                        : availableItems.find(
                          (item: any) => (item.id || item.value || item._id) === selectedItemId
                        )?.name ||
                        availableItems.find(
                          (item: any) => (item.id || item.value || item._id) === selectedItemId
                        )?.label || "Select Item"}
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
              </div>

              {/* Available Stock Display Box */}
              <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/30 p-3.5 flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
                <Archive className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold">
                  {isItemDetailLoading ? (
                    "Checking availability..."
                  ) : selectedItemDetails ? (
                    `Available: ${selectedItemDetails.availableQuantity ?? 0} Units`
                  ) : (
                    "Available: -- Units"
                  )}
                </span>
              </div>

              {/* Quantity to Dispatch */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Quantity to Dispatch</label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-10 shrink-0 border-border bg-background"
                    onClick={() => setDispatchQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <Input
                    type="text"
                    min="1"
                    max={selectedItemDetails?.availableQuantity || 9999}
                    value={dispatchQuantity}
                    onChange={(e) => setDispatchQuantity(Math.max(1, Number(e.target.value)))}
                    className="h-10 text-center font-medium border-border bg-background"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-10 shrink-0 border-border bg-background"
                    onClick={() =>
                      setDispatchQuantity((prev) =>
                        selectedItemDetails
                          ? Math.min(selectedItemDetails.availableQuantity ?? 9999, prev + 1)
                          : prev + 1
                      )
                    }
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Grid Button */}
              <Button
                type="button"
                variant="outline"
                disabled={!selectedItemId || (selectedItemDetails?.availableQuantity ?? 0) <= 0}
                onClick={handleAddToQueue}
                className="w-full h-10 border-border font-medium text-foreground hover:bg-muted transition-colors gap-2 mt-2"
              >
                <PlusCircle className="size-4" />
                Add to Sell Grid
              </Button>
            </CardContent>
          </Card>

          {/* Today's Stock Out Count Widget Card */}
          <Card className="relative overflow-hidden border border-border bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-35 text-center">
              <div className="text-4xl font-extrabold text-emerald-800 dark:text-emerald-300">
                {isTodayCountLoading ? <Loader2 className="size-8 animate-spin text-emerald-600" /> : todayCount}
              </div>
              <p className="text-xs font-semibold tracking-wider text-emerald-700/80 dark:text-emerald-400 uppercase mt-1">
                ITEMS SOLD TODAY
              </p>
            </CardContent>
            {/* Background Aesthetic Wave/Pattern */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-200/30 dark:bg-emerald-800/20 rounded-full blur-xl pointer-events-none" />
          </Card>
        </div>

        {/* RIGHT COLUMN: Sell Queue Table (8 cols on lg) */}
        <div className="lg:col-span-8">
          <Card className="border border-border bg-card shadow-xs dark:bg-gray-900 flex flex-col h-186 overflow-hidden">
            <CardHeader className="border-b border-border py-4 shrink-0">
              <CardTitle className="text-xl font-bold text-card-foreground">
                Sell Queue
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 min-h-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase">
                        Item Name
                      </TableHead>
                      <TableHead className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                        Qty
                      </TableHead>
                      <TableHead className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                        Available
                      </TableHead>
                      <TableHead className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queue.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-115 sm:h-125 text-center text-muted-foreground">
                          No items added to the queue yet. Select an item on the left to add.
                        </TableCell>
                      </TableRow>
                    ) : (
                      queue.map((item) => (
                        <TableRow key={item.itemId} className="border-b border-border/60 hover:bg-muted/30">
                          {/* Item Name & Details */}
                          <TableCell className="px-6 py-3.5">
                            <div className="font-semibold text-card-foreground text-sm">
                              {item.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.companyName} • {item.categoryName}
                            </div>
                          </TableCell>

                          {/* Dispatch Quantity */}
                          <TableCell className="px-6 py-3.5 text-center font-bold text-foreground text-sm">
                            {item.quantity}
                          </TableCell>

                          {/* Total Available */}
                          <TableCell className="px-6 py-3.5 text-center text-sm text-muted-foreground">
                            {item.availableQuantity}
                          </TableCell>

                          {/* Delete Action */}
                          <TableCell className="px-6 py-3.5 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveFromQueue(item.itemId)}
                              className="size-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </ScrollArea>

            {/* Bottom Queue Footer Controls */}
            <div className="border-t border-border p-4 bg-muted/20 dark:bg-gray-900/50 rounded-b-xl shrink-0 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Stats Counters */}
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground"># Items:</span>
                  <span>{totalItemsCount}</span>
                </div>
                <span className="text-border">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground"># Total Units:</span>
                  <span>{totalUnitsCount}</span>
                </div>
              </div>

              {/* Action Buttons Group */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                {/* Mark Lost */}
                <Button
                  type="button"
                  variant="outline"
                  disabled={queue.length === 0 || isSubmitting}
                  onClick={() => handleProcessStockOut("Lost")}
                  className="h-9 border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40 text-xs font-semibold gap-1.5"
                >
                  <XCircle className="size-3.5" />
                  Mark Lost
                </Button>

                {/* Mark Damaged */}
                <Button
                  type="button"
                  variant="outline"
                  disabled={queue.length === 0 || isSubmitting}
                  onClick={() => handleProcessStockOut("Damage")}
                  className="h-9 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900/60 dark:text-amber-400 dark:hover:bg-amber-950/40 text-xs font-semibold gap-1.5"
                >
                  <AlertTriangle className="size-3.5" />
                  Mark Damaged
                </Button>

                {/* Process Sale */}
                <Button
                  type="button"
                  disabled={queue.length === 0 || isSubmitting}
                  onClick={() => handleProcessStockOut("Sell")}
                  className="h-9 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs gap-1.5 px-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-3.5" />
                  )}
                  Process Sale
                </Button>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}