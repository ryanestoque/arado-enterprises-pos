import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ProductCards from "./ProductCards"
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Button } from "../ui/button";
import { useCategory } from "@/hooks/useMockAPI";

interface ProductTabsProps {
  sortBy: "A-Z" | "Z-A" | "price-asc" | "price-desc"| "stock-asc" | "stock-desc"
  searchQuery: string
}

export function ProductTabs({ sortBy, searchQuery }: ProductTabsProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setOpen(true);
      else setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {data : categories = [], error, isLoading } = useCategory()

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col" defaultValue="all" activationMode="manual">
      <Collapsible open={open} onOpenChange={setOpen} className="sticky top-0 z-10 bg-white -mx-[2px]">
        <div className="sm:hidden mb-2 justify-self-end">
          <CollapsibleTrigger>
            <Button
              variant="outline"
              className="flex justify-between items-center"
            >
              {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent
          className="flex flex-col overflow-hidden   
          data-[state=open]:animate-collapsible-down"
        >
          <TabsList 
            className="
              flex flex-wrap gap-2 flex-1
              rounded-none bg-white -mx-[2px] pb-4 text-muted-foreground/75
            "
          >
            <TabsTrigger className="flex-1" value="all">
              All
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger
                key={category.category_id}
                value={category.category_id}
                className="flex-1"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </CollapsibleContent>
      </Collapsible>
      <TabsContent value={activeTab} className="grid gap-4 grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 mt-4">
        {activeTab === "all"
          ? <ProductCards sortBy={sortBy} searchQuery={searchQuery} />
          : <ProductCards categoryId={activeTab} sortBy={sortBy} searchQuery={searchQuery} />}
      </TabsContent>
    </Tabs>
  )
}
