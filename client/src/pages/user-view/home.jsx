import React, { Fragment, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { menus } from "@/components/config";

const Home = () => {
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(),
  });

  return (
    <div className="flex flex-col space-y-6 flex-1">
      <div className="flex flex-wrap gap-6 p-6">
        <div className="bg-background rounded-lg shadow-md p-4 space-y-2">
          <h1 className="font-bold text-lg">Menus</h1>
          {/* <Separator /> */}
          {menus.map((menu) => (
            <Fragment key={menu.day}>
              <Separator />
              <div className="flex items-center">
                <div className="w-28 font-semibold">{menu.day} :</div>
                <div>
                  <div>{menu.items.join(", ")}</div>
                  <div>{menu.time}</div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
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
        <Button onClick={() => console.log(date)}>Submit</Button>
      </div>
    </div>
  );
};

export default Home;
