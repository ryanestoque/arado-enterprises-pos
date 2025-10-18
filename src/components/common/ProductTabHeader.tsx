import { TabsList, TabsTrigger } from "../ui/tabs";

export default function ProductTabHeader() {
  return(
    <TabsList className="flex flex-wrap gap-2 flex-1">
      <TabsTrigger className="flex-1" value="all">All</TabsTrigger>
      <TabsTrigger className="flex-1" value="tools">Tools</TabsTrigger>
      <TabsTrigger className="flex-1" value="construction">Construction</TabsTrigger>
      <TabsTrigger className="flex-1" value="plumbing">Plumbing</TabsTrigger>
      <TabsTrigger className="flex-1" value="electrical">Electrical</TabsTrigger>
      <TabsTrigger className="flex-1" value="others">Others</TabsTrigger>
    </TabsList>
  )
}