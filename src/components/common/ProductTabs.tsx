import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ProductTabs() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="overflow-x-auto">
        <TabsList className="flex w-max min-w-full mb-4">
          <TabsTrigger className="w-full" value="all">All</TabsTrigger>
          <TabsTrigger className="w-full" value="tools">Tools</TabsTrigger>
          <TabsTrigger className="w-full" value="construction">Construction</TabsTrigger>
          <TabsTrigger className="w-full" value="plumbing">Plumbing</TabsTrigger>
          <TabsTrigger className="w-full" value="electrical">Electrical</TabsTrigger>
          <TabsTrigger className="w-full" value="fixtures">Fixtures</TabsTrigger>
          <TabsTrigger className="w-full" value="others">Others</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all">
        <div className="grid gap-4 grid-cols-1 @[409px]:grid-cols-2 @[574px]:grid-cols-3 md:@[202px]:grid-cols-1 md:@[294px]:grid-cols-2 @lg:grid-cols-2 xl:@[538px]:grid-cols-3 xl:@[630px]:grid-cols-4">
          {/* Product Cards here */}
          <Card>
            <CardHeader>
              <div className="flex justify-center items-center aspect-square">
                <img src="/hammer.webp" alt="Hammer" className="p-1 max-w-full max-h-full object-contain aspect-square" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-sm">Hammer</p>
              <p className="font-bold text-base">₱250.00</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <div className="flex justify-center items-center aspect-square">
                <img src="/hammer.webp" alt="Hammer" className="p-1 max-w-full max-h-full object-contain aspect-square" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-sm">Hammer</p>
              <p className="font-bold text-base">₱250.00</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="tools">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Drinks only */}
        </div>
      </TabsContent>

      <TabsContent value="construction">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Snacks only */}
        </div>
      </TabsContent>
    </Tabs>
  )
}
