import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isBefore, startOfDay, getDay } from "date-fns";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const PlaceOrderForm = ({
  newOrderFormData,
  newOrderFilteredItems,
  setNewOrderFormData,
  handleNewOrderSubmit,
  handleDateChange,
  handleNewOrderQuantityChange,
  handleNewOrderVariantChange,
}) => (
  <form className="py-3 space-y-2 flex-1 border rounded p-4" onSubmit={handleNewOrderSubmit}>
    <h1 className="text-lg font-semibold pb-2">Place an Order</h1>
    <div className="flex items-center gap-2">
      <Label className="w-20 text-nowrap">Select Date:</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "flex-1 justify-start text-left font-normal",
              !newOrderFormData?.date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {newOrderFormData?.date ? (
              format(newOrderFormData?.date, "EEEE, PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={newOrderFormData?.date || undefined}
            onSelect={handleDateChange} // Trigger `handleDateChange` on date selection
            disabled={(date) => {
              const isPastDate = isBefore(date, startOfDay(new Date()));
              const isWeekend = getDay(date) === 0 || getDay(date) === 6; // Disable weekends
              return isPastDate || isWeekend;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>

    {newOrderFormData.date && newOrderFilteredItems?.length > 0 && (
      <div className="space-y-2">
        {newOrderFilteredItems.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="w-20 text-nowrap">
                {item?.itemId?.itemName || "—"}:
              </Label>
              {item?.itemId?.hasQuantity && item?.itemId?.maxQuantity > 1 && (
                <Input
                  type="number"
                  className="flex-1 bg-background"
                  value={
                    newOrderFormData.mealItems.find(
                      (selected) =>
                        selected?.itemName === item?.itemId?.itemName
                    )?.quantity || ""
                  }
                  onChange={(e) =>
                    handleNewOrderQuantityChange(
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
                        newOrderFormData.mealItems.find(
                          (selected) =>
                            selected.itemName === item.itemId.itemName &&
                            selected.variant === variant
                        ) !== undefined
                      }
                      onCheckedChange={(isChecked) =>
                        handleNewOrderVariantChange(
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

    <div className="h-2"></div>
    <Button type="submit" className="w-full">
      Place Order
    </Button>
  </form>
);

export default PlaceOrderForm;
