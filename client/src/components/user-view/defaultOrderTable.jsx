import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { Separator } from "../ui/separator";

const DefaultOrderTable = ({ defaultMeal, openEditDialog }) => (
  <div>
    {Object.keys(defaultMeal).length > 0 ? (
      <Table className="bg-background rounded">
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Variant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(defaultMeal).map(([itemName, itemData]) => (
            <TableRow key={itemName}>
              <TableCell>{itemName}</TableCell>
              <TableCell>{itemData.quantity || "-"}</TableCell>
              <TableCell>{itemData.variant || "-"}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              <Button
                onClick={openEditDialog}
                variant="ghost"
                className="text-green-500"
              >
                <Pencil size={20} /> <Separator orientation="vertical" /> Edit
                Default Order
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ) : (
      <div className="space-y-2">
        <p>Currently your default order is Empty. Click below to create your default order.</p>
        <Button onClick={openEditDialog}>Create Default Order</Button>
      </div>
    )}
  </div>
);

export default DefaultOrderTable;
