import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMeals,
  addMeal,
  updateMeal,
  deleteMeal,
} from "@/store/admin/menu-slice";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const initialFormState = {
  itemName: "",
  price: "",
  hasVariant: false,
  variants: [],
  hasQuantity: false,
  maxQuantity: 0,
};

const MealEntry = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [variant, setVariant] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editMealId, setEditMealId] = useState(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const dispatch = useDispatch();
  const { toast } = useToast();
  const { meals, isLoading } = useSelector((state) => state.meals);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVariantChange = () => {
    const updatedVariants = [...formData.variants, variant];
    setFormData({ ...formData, variants: updatedVariants });
    setVariant("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      dispatch(updateMeal({ formData, _id: editMealId })).then((data) => {
        if (data.payload?.success) {
          toast({
            title: "Meal Item Updated Successfully",
          });
        } else {
          toast({
            title: data.payload?.message || "Failed to update meal item",
            type: "destructive",
          });
        }
      });
    } else {
      dispatch(addMeal(formData)).then((data) => {
        if (data.payload.success) {
          toast({
            title: "Meal Item Added Successfully",
          });
        } else {
          toast({
            title: data.payload.message || "Failed to add meal item",
            type: "destructive",
          });
        }
      });
    }
    setEditMode(false);
    setEditMealId(null);
    setFormData(initialFormState);
  };

  const handleEdit = (meal) => {
    setEditMode(true);
    setEditMealId(meal._id);
    setFormData({
      itemName: meal.itemName,
      price: meal.price,
      hasVariant: meal.hasVariant,
      variants: meal.variants || [],
      hasQuantity: meal.hasQuantity,
      maxQuantity: meal.maxQuantity || 0,
    });
  };

  const handleDelete = () => {
    dispatch(deleteMeal(editMealId)).then((data) => {
      if (data.payload.success) {
        toast({
          title: "Meal Item Deleted Successfully",
        });
      } else {
        toast({
          title: data.payload.message || "Failed to delete meal item",
          type: "destructive",
        });
      }
      setEditMealId(null);
    });
  };

  useEffect(() => {
    dispatch(fetchMeals());
  }, [dispatch]);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">Meals List</h2>
      <Table className="bg-background rounded">
        <TableHeader className="text-nowrap">
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>Max. Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meals?.map((meal) => (
            <TableRow key={meal._id} className="text-nowrap">
              <TableCell>{meal.itemName}</TableCell>
              <TableCell>{meal.variants.join(", ")}</TableCell>
              <TableCell>{meal.maxQuantity || ""}</TableCell>
              <TableCell>{meal.price}</TableCell>
              <TableCell className="text-center flex items-center gap-3 justify-center">
                <Pencil
                  size={20}
                  className="text-green-500 cursor-pointer"
                  onClick={() => handleEdit(meal)}
                />
                <Trash2
                  size={20}
                  className="text-red-500 cursor-pointer"
                  onClick={() => {setDeleteAlertOpen(true); setEditMealId(meal._id)}}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="h-6"></div>
      <Separator />
      <h1 className="text-lg font-semibold pb-2">Meal Manager</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-nowrap w-24 font-normal">Item Name</Label>
          <Input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleInputChange}
            required
            className="flex-1 bg-background"
            placeholder="Enter item name"
          />
        </div>
        <div className="flex items-center pb-2 gap-2">
          <Label className="text-nowrap w-24 font-normal">Price</Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="flex-1 bg-background"
            placeholder="Enter price"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.hasVariant}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, hasVariant: checked, variants: [] })
            }
          />
          <Label>Has Variants</Label>
        </div>
        {formData.hasVariant && (
          <div>
            <div className="flex items-center gap-2">
            <Label className="text-nowrap w-24 font-normal">Max Quantity</Label>
              <Input
                type="text"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="Add Variant: e.g., Poch"
                className="bg-background flex-1"
              />
              <Button type="button" onClick={handleVariantChange}>
                Add Variant
              </Button>
            </div>
            <div className="py-2">
              {formData?.variants?.map((variant, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-gray-200 text-gray-800 px-2 py-0.5 rounded mr-2 border border-gray-400"
                >
                  {variant}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        variants: formData.variants.filter(
                          (_, i) => i !== index
                        ),
                      });
                    }}
                    className="ml-2 text-red-400 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.hasQuantity}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                hasQuantity: checked,
                maxQuantity: 0,
              })
            }
          />
          <Label>Has Quantity</Label>
        </div>
        {formData.hasQuantity && (
          <div className="flex items-center gap-2">
            <Label className="text-nowrap w-24 font-normal">Max Quantity</Label>
            <Input
              type="number"
              name="maxQuantity"
              value={formData.maxQuantity}
              onChange={handleInputChange}
              className="flex-1 bg-background"
            />
          </div>
        )}
        <div className="flex gap-4">
          <Button type="submit">{editMode ? "Update Meal" : "Add Meal"}</Button>
          {editMode && (
            <Button
              type="button"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                setFormData(initialFormState);
                setEditMode(false);
                setEditMealId(null);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEditMealId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MealEntry;
