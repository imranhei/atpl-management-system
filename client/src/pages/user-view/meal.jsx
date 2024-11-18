import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import EmployeeMenu from "@/components/user-view/menus"
import EmployeeOrder from "@/components/user-view/order"
import EmployeeOrderHistory from "@/components/user-view/order-history"

const Meal = () => {
  return (
    <Tabs defaultValue="menus" className="w-full">
      <TabsList className="grid w-80 grid-cols-3 bg-transparent border">
        <TabsTrigger value="menus">Menus</TabsTrigger>
        <TabsTrigger value="order">Order</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="menus">
        <EmployeeMenu />
      </TabsContent>
      {/* <TabsContent value="order">
        <EmployeeOrder />
      </TabsContent>
      <TabsContent value="history">
        <EmployeeOrderHistory />
      </TabsContent> */}
    </Tabs>
  )
}

export default Meal
