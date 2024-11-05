import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDefaultMeal,
  createDefaultMeal,
} from "@/store/employee/meal-slice";
import { fetchMenu } from "@/store/admin/menu-slice";
import { useToast } from "../../hooks/use-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const EmployeeOrder = () => {
  const [formData, setFormData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { menu } = useSelector((state) => state.menu);
  const { defaultMeal = {} } = useSelector((state) => state.meal);
  const { toast } = useToast();

  // Fetch menu and default meal data on component mount
  useEffect(() => {
    dispatch(fetchDefaultMeal(user.emp_code));
    dispatch(fetchMenu());
  }, [dispatch, user]);

  // Initialize formData based on menu or defaultMeal when opening the dialog
  useEffect(() => {
    if (isDialogOpen) {
      setFormData(
        Object.keys(menu).reduce((acc, item) => {
          acc[item] = defaultMeal[item] || { quantity: "", variant: "" };
          return acc;
        }, {})
      );
    }
  }, [menu, defaultMeal, isDialogOpen]);

  const handleChange = (e, itemName, field) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [itemName]: {
        ...prevData[itemName],
        [field]: field === "quantity" ? parseInt(value, 10) || "" : value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createDefaultMeal({
        name: user.name,
        emp_id: user.emp_code,
        meal: formData,
      })
    ).then((res) => {
      if (res.payload.success) {
        dispatch(fetchDefaultMeal(user.emp_code));
        toast({
          title: "Default order saved successfully",
        });
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Failed to save default order",
          variant: "destructive",
        });
      }
    });
  };

  const openEditDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="flex-1">
      <div className="space-y-4">
        <h1 className="font-semibold">Default Order</h1>
        {Object.keys(defaultMeal)?.length > 0 ? (
          <Table className="bg-background rounded">
            <TableHeader>
              <TableRow className="p-0 text-nowrap">
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead className="w-20 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(defaultMeal).map(([itemName, itemData]) => (
                <TableRow key={itemName}>
                  <TableCell>{itemName}</TableCell>
                  <TableCell>{itemData.quantity || "-"}</TableCell>
                  <TableCell>{itemData.variant || "-"}</TableCell>
                  <TableCell className="text-center min-w-28 flex items-center justify-center">
                    <Button
                      onClick={openEditDialog}
                      variant="ghost"
                      className="text-green-500"
                    >
                      <Pencil size={20} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Button
            className="underline-effect overflow-hidden hover:bg-white rounded-sm hover:text-violet-700 shadow-md shadow-violet-300 w-fit p-3 sm:p-4"
            onClick={openEditDialog}
          >
            Create Default Order
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="lg:max-w-[800px] sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-xl">
              {Object.keys(defaultMeal).length > 0 ? "Edit Default Order" : "Create Default Order"}
            </DialogTitle>
            <DialogDescription>
              Select quantities and variants for your meal items. Click save
              when you're done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            {Object.entries(menu).map(([itemName, itemData]) => (
              <div key={itemName} className="py-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-2">{itemName}</h3>

                {/* Quantity Field */}
                <div className="flex items-center gap-2 mb-2">
                  <Label className="mb-1">Quantity</Label>
                  <Input
                    type="number"
                    name={`${itemName}-quantity`}
                    placeholder="Enter Quantity"
                    value={formData[itemName]?.quantity || ""}
                    onChange={(e) => handleChange(e, itemName, "quantity")}
                  />
                </div>

                {/* Variant Field (if variants exist) */}
                {itemData.variant && Array.isArray(itemData.variant) && itemData.variant.length > 0 && (
                  <div className="grid w-full gap-1.5 mb-2">
                    <Label className="mb-1">Variant</Label>
                    <select
                      name={`${itemName}-variant`}
                      value={formData[itemName]?.variant || ""}
                      onChange={(e) => handleChange(e, itemName, "variant")}
                      className="p-2 border border-gray-300 rounded"
                    >
                      <option value="">Select Variant</option>
                      {itemData.variant.map((variantOption, idx) => (
                        <option key={idx} value={variantOption}>
                          {variantOption}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
            <Button
              type="submit"
              className="w-full mt-4 bg-green-500 text-white rounded py-2 hover:bg-green-600"
            >
              Save Default Order
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeOrder;