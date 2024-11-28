import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";

const OrderTable = ({ defaultOrder, handleEdit }) => (
  <Table className="bg-background rounded">
    <TableHeader>
      <TableRow>
        <TableHead>Day</TableHead>
        <TableHead>Meal Type</TableHead>
        <TableHead>Item Name</TableHead>
        <TableHead>Variants</TableHead>
        <TableHead>Quantity</TableHead>
        <TableHead className="text-center">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {defaultOrder?.map((order) =>
        order.mealItems?.map((item, index) => {
          const isFirstRow = index === 0;
          return (
            <TableRow key={`${order.day}-${item.itemName}-${index}`}>
              {isFirstRow && (
                <>
                  <TableCell rowSpan={order.mealItems.length}>{order.day}</TableCell>
                  <TableCell rowSpan={order.mealItems.length} className="border-r">{order.mealType}</TableCell>
                </>
              )}
              <TableCell>{item.itemName}</TableCell>
              <TableCell>{item.variant || "—"}</TableCell>
              <TableCell>{item.quantity > 0 ? item.quantity : "—"}</TableCell>
              {isFirstRow && (
                <TableCell rowSpan={order.mealItems.length} className="text-center border-l">
                  <Pencil
                    size={20}
                    className="text-green-500 cursor-pointer mx-auto"
                    onClick={() => handleEdit(order)}
                  />
                </TableCell>
              )}
            </TableRow>
          );
        })
      )}
    </TableBody>
  </Table>
);

export default OrderTable;