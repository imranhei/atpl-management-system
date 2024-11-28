import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const DefaultOrderForm = ({
  formData,
  daysOfWeek,
  filteredItems,
  handleDayChange,
  handleQuantityChange,
  handleVariantChange,
  handleSubmit,
  isEditing,
}) => (
  <form className="py-3 space-y-2 max-w-96" onSubmit={handleSubmit}>
    <h2 className="text-lg font-semibold">
      {isEditing ? "Update Default Order" : "Create Default Order"}
    </h2>
    <div className="flex items-center gap-2">
      <Label className="w-20 text-nowrap">Select Day:</Label>
      <Select value={formData.day || undefined} onValueChange={handleDayChange}>
        <SelectTrigger className="flex-1 border rounded px-3 py-2">
          <SelectValue placeholder="Select Day" />
        </SelectTrigger>
        <SelectContent>
          {daysOfWeek.map((day) => (
            <SelectItem key={day} value={day}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    {formData.day && filteredItems?.length > 0 && (
      <div className="space-y-2">
        {filteredItems.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2 ">
              <Label className="w-20 text-nowrap">
                {item?.itemId?.itemName || "—"}:
              </Label>
              {item?.itemId?.hasQuantity && item?.itemId?.maxQuantity > 1 && (
                <Input
                  type="number"
                  className="flex-1"
                  value={
                    formData.mealItems.find(
                      (selected) =>
                        selected?.itemName === item?.itemId?.itemName
                    )?.quantity || ""
                  }
                  onChange={(e) =>
                    handleQuantityChange(
                      item?.itemId?.itemName,
                      Number(e.target.value)
                    )
                  }
                />
              )}
            </div>
            {item.itemId?.hasVariant && (
              <div className="flex flex-wrap gap-4 py-1">
                {item.itemId.variants.map((variant) => (
                  <div key={variant} className="flex items-center gap-2">
                    <Checkbox
                      checked={
                        formData.mealItems.find(
                          (selected) =>
                            selected.itemName === item.itemId.itemName &&
                            selected.variant === variant
                        ) !== undefined
                      }
                      onCheckedChange={(isChecked) =>
                        handleVariantChange(
                          item.itemId.itemName,
                          variant,
                          isChecked
                        )
                      }
                    />
                    <Label className="font-normal">{variant}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
    <Button type="submit" className="mt-4">
      {isEditing ? "Update" : "Submit"}
    </Button>
  </form>
);

export default DefaultOrderForm;
