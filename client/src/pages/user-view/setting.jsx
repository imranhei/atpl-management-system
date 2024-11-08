import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMenu,
  addMenu,
  updateMenu,
  deleteMenu,
} from "@/store/admin/menu-slice";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Save, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EmployeeSetting = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    variantsList: [],
    price: "",
  });
  const [variant, setVariant] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const dispatch = useDispatch();
  const { toast } = useToast();
  const { menu } = useSelector((state) => state.menu);

  const handleAddVariant = () => {
    if (variant) {
      setFormData({
        ...formData,
        variantsList: [...formData.variantsList, variant.trim()],
      });
      setVariant(""); // Clear variant input
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mealData = {
      itemName: formData.itemName,
      ...(formData.quantity ? { quantity: parseInt(formData.quantity, 10) } : {}),
      ...(formData.variantsList.length > 0 ? { variant: formData.variantsList } : {}),
      ...(formData.price ? { price: parseFloat(formData.price) } : {}),
    };

    if (editMode) {
      dispatch(updateMenu({ id: editingId, ...mealData })).then((data) => {
        dispatch(fetchMenu());
        toast({
          title: data?.payload?.success
            ? "Menu Item Updated Successfully"
            : data?.payload?.message,
        });
        clearForm();
      });
    } else {
      dispatch(addMenu(mealData)).then((data) => {
        dispatch(fetchMenu());
        toast({
          title: data?.payload?.success
            ? "Menu Item Added Successfully"
            : data?.payload?.message,
        });
        clearForm();
      });
    }
  };

  const handleEdit = (itemId, itemData) => {
    setFormData({
      itemName: itemId,
      quantity: itemData.quantity || "",
      variantsList: itemData.variant || [],
      price: itemData.price || "",
    });
    setEditingId(itemId);
    setEditMode(true);
  };

  const handleDelete = (itemName) => {
    dispatch(deleteMenu(itemName)).then((data) => {
        dispatch(fetchMenu());
      toast({
        title: data?.payload?.success
          ? "Menu Item Deleted Successfully"
          : data?.payload?.message,
      });
    });
  };

  const clearForm = () => {
    setFormData({ itemName: "", quantity: "", variantsList: [], price: "" });
    setEditMode(false);
    setEditingId(null);
  };

  useEffect(() => {
    dispatch(fetchMenu()).then((data) => {});
  }, [dispatch]);

  return (
    <div>
      Setting Page
      <div>
        <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>
      </div>
      {Object.keys(menu).length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="bg-background rounded">
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-40 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(menu).map(([itemName, itemData]) => (
                <TableRow key={itemData._id}>
                  <TableCell>{itemName}</TableCell>
                  <TableCell>{itemData.quantity ?? "-"}</TableCell>
                  <TableCell>{itemData.variant?.join(", ") ?? "-"}</TableCell>
                  <TableCell>{itemData.price ?? "-"}</TableCell>
                  <TableCell className="text-center w-40 flex items-center gap-3 justify-center">
                    <Pencil
                      size={20}
                      className="text-green-500 cursor-pointer"
                      onClick={() => handleEdit(itemName, itemData)}
                    />
                    <Trash2
                      size={20}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(itemName)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
      <h2 className="text-2xl font-semibold mb-4">
        {editMode ? "Edit Meal Item" : "Add Meal Item"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Max Quantity (Optional)
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Add Variants (Optional)
          </label>
          <div className="flex">
            <input
              type="text"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              placeholder="e.g., poached, omelet"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddVariant}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add
            </button>
          </div>
          <div className="mt-2">
            {formData.variantsList.map((variant, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2"
              >
                {variant}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      variantsList: formData.variantsList.filter(
                        (_, i) => i !== index
                      ),
                    });
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-800"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Unit Price (Optional)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          {editMode ? "Update Meal Item" : "Add Meal Item"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeSetting;
