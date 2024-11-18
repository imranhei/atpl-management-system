import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeeklyMeals } from "@/store/admin/day-wise-meal-slice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EmployeeMenu = () => {
  const dispatch = useDispatch();
  const { weeklyMeals, isLoading } = useSelector((state) => state.weeklyMeals);

  useEffect(() => {
    dispatch(fetchWeeklyMeals());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-background rounded-lg shadow-md p-4 space-y-2">
      <h1 className="font-bold text-xl text-center py-2">Menus</h1>
      <Table className="bg-background rounded">
        <TableHeader className="text-nowrap">
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Meal Type</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>Max Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weeklyMeals?.map((meal, pIndex) =>
            meal.availableItems.map((item, index) => {
              const isFirstRow = index === 0;
              return (
                <TableRow
                  key={item._id}
                  className={`${!(pIndex % 2) ? "bg-slate-50" : ""}`}
                >
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
                  <TableCell>{item?.itemId?.itemName}</TableCell>
                  <TableCell>
                    {item?.itemId?.hasVariant
                      ? item?.itemId?.variants.join(", ")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {item?.itemId?.hasQuantity
                      ? item?.itemId?.maxQuantity
                      : "—"}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeMenu;
