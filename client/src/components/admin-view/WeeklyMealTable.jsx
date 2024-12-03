import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const WeeklyMealTable = ({ weeklyMeals, onEdit }) => {
  return (
    <Table className="bg-background rounded">
      <TableHeader>
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
          meal?.availableItems?.map((item, index) => {
            const isFirstRow = index === 0;
            return (
              <TableRow key={item._id} className={`${!(pIndex % 2) ? "bg-slate-50" : ""}`}>
                {isFirstRow && (
                  <>
                    <TableCell rowSpan={meal.availableItems.length}>
                      {meal.day}
                    </TableCell>
                    <TableCell className="border-r" rowSpan={meal.availableItems.length}>
                      {meal.mealType}
                    </TableCell>
                  </>
                )}
                <TableCell>{item?.itemId?.itemName}</TableCell>
                <TableCell>
                  {item?.itemId?.hasVariant
                    ? item.itemId.variants.join(", ")
                    : "—"}
                </TableCell>
                <TableCell>
                  {item?.itemId?.hasQuantity ? item?.itemId?.maxQuantity : "—"}
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
                        onClick={() => onEdit(meal)}
                      />
                      <Trash2 size={20} className="text-red-500 cursor-pointer" />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default WeeklyMealTable;