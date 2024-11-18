import React, { Fragment } from 'react'
import { Separator } from '../ui/separator'
import { menus } from "@/components/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EmployeeMenu = () => {
  return (
    <div className="bg-background rounded-lg shadow-md p-4 space-y-2">
          <h1 className="font-bold text-lg">Menus</h1>
          <Table className="bg-background rounded">
        <TableHeader className="text-nowrap">
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Meal Type</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>Max Quantity</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weeklyMeals?.map((meal, pIndex) =>
            meal.availableItems.map((item, index) => {
              const isFirstRow = index === 0; // Display merged cells only for the first row
              return (
                <TableRow key={item._id} className={`${!(pIndex%2) ? "bg-slate-50" : ""}`}>
                  {isFirstRow && (
                    <>
                      <TableCell rowSpan={meal.availableItems.length}>
                        {meal.day}
                      </TableCell>
                      <TableCell
                        rowSpan={meal.availableItems.length}
                        className="border-r"
                      >
                        {meal.mealType}
                      </TableCell>
                    </>
                  )}
                  <TableCell>{item.itemId.itemName}</TableCell>
                  <TableCell>
                    {item.itemId.hasVariant
                      ? item.itemId.variants.join(", ")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {item.itemId.hasQuantity ? item.itemId.maxQuantity : "—"}
                  </TableCell>
                  {isFirstRow && (
                    <TableCell
                      className="text-center border-l"
                      rowSpan={meal.availableItems.length}
                    >
                      <div className="flex items-center gap-3 justify-center">
                        <Pencil
                          size={20}
                          className="text-green-500 cursor-pointer"
                          onClick={() => handleEdit(meal)}
                        />
                        <Trash2
                          size={20}
                          className="text-red-500 cursor-pointer"
                          // Add your delete functionality here
                        />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
        </div>
  )
}

export default EmployeeMenu
