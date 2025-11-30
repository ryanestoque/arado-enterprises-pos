import AdminAuthCard from "@/components/authentication/AdminAuthCard";
import CashierAuthCard from "@/components/authentication/CashierAuthCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";

export default function Authentication() {
  return(
    <>
      <Toaster />
      <div 
        className="flex flex-col justify-center items-center h-screen ">
        <Tabs defaultValue="cashier">
          <TabsList className="w-full bg-neutral-100">
            <TabsTrigger className="w-full" value="cashier">Cashier</TabsTrigger>
            <TabsTrigger className="w-full" value="admin">Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="cashier">
            <CashierAuthCard />
          </TabsContent>
          <TabsContent value="admin">
            <AdminAuthCard />
          </TabsContent>
        </Tabs>
      </div>
    </>
    
  )
}