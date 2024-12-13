import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Button } from "../ui/button";

const MealOffDialog = ({
  mealOffDates,
  handleMealOff,
  handleDayDelete,
  date,
  setDate,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Meal Off</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Meal Off Date</DialogTitle>
          <DialogDescription>
            Update your meal off date to skip meals for a specific day/days.
          </DialogDescription>
        </DialogHeader>
        <div>
          <h1 className="mb-2">Selected meal off days</h1>
          <ScrollArea className="h-40 w-full rounded-md border">
            <div className="p-4">
              <h4 className="mb-2 text-sm font-medium leading-none">Day off</h4>
              {mealOffDates.length ? (
                mealOffDates.map((date) => (
                  <div key={date}>
                    <Separator className="" />
                    <div className="text-sm flex justify-between p-1 hover:bg-gray-100">
                      <p>{format(new Date(date), "MMM dd, yyyy")}</p>
                      <X
                        size={16}
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDayDelete(date)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xl text-gray-300 font-bold">
                  No meal off days Found
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator className="my-4" />
          <p>Set a day off</p>
          <div className="mt-2">
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleMealOff}>
            Update Date
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MealOffDialog;
