import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

type SortOption = "A-Z" | "Z-A" | "price-asc" | "price-desc"| "stock-asc" | "stock-desc"

interface POSLeftHeaderProps {
  sortBy: SortOption
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>
  searchQuery: string
  setSearchQuery: (v: string) => void
}

export default function POSLeftHeader({ sortBy, setSortBy, searchQuery, setSearchQuery }: POSLeftHeaderProps) {
  return(
    <>
      <div className="relative flex-1 min-w-36">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          type="search" 
          placeholder="Search products" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-sm sm:text-base"/>
      </div>
      <div className="flex-2 pb-1 min-w-0">
        <Select 
          value={sortBy}
          onValueChange={(v) => setSortBy(v as SortOption)}
          >
          <SelectTrigger>
            <SelectValue/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by</SelectLabel>
              <SelectItem value="A-Z">Name (A-Z)</SelectItem>
              <SelectItem value="Z-A">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="stock-asc">Stock (Low to High)</SelectItem>
              <SelectItem value="stock-desc">Stock (High to Low)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}