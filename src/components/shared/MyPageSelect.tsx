import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ISelectProps {
    pageSize: string,
    onChange: (value: string | null) => void,
    pageSizeOptions: number[],
}
const MyPageSelect = ({ pageSize, onChange:handlePageSizeChange, pageSizeOptions }: ISelectProps) => {
    return (
        <Select value={pageSize} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-full max-w-24">
                <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent align="end">
                {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                        {size}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default MyPageSelect
