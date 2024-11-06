import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { Separator } from "../ui/separator";

const TodayOrderTable = ({ order, openNewOrderDialog }) => {
  return (
    <div className="space-y-4">
      {order && order.meal && Object.keys(order.meal).length > 0 ? (
        <div className="space-y-2">
          <p className="font-semibold">Today's Order</p>
          <Table className="bg-background rounded">
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(order.meal).map(([itemName, itemData], index) => (
                <TableRow key={itemName}>
                  <TableCell>{itemName}</TableCell>
                  <TableCell>{itemData.quantity || "-"}</TableCell>
                  <TableCell>{itemData.variant || "-"}</TableCell>
                  {index === 0 && (
                    <TableCell className="border-l" rowSpan={Object.keys(order.meal).length}>
                      {order.date.split("T")[0] || "-"}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <Button
                    onClick={openNewOrderDialog}
                    variant="ghost"
                    className="text-green-500"
                  >
                    <Pencil size={20} /> <Separator orientation="vertical" /> Update Today Order
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="">
            Your order is set to default for today as no order was placed.
          </p>
          <Button onClick={openNewOrderDialog}>Place New Order</Button>
        </div>
      )}
    </div>
  );
};

export default TodayOrderTable;
