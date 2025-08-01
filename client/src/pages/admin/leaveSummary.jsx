import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import avatar2 from "/avatar2.png";

const chartData = [
  { month: "January", leave: 1 },
  { month: "February", leave: 0 },
  { month: "March", leave: 2 },
  { month: "April", leave: 3 },
  { month: "May", leave: 2 },
  { month: "June", leave: 2 },
  { month: "July", leave: 1 },
  { month: "August", leave: 0 },
  { month: "September", leave: 2 },
  { month: "October", leave: 2 },
  { month: "Novembar", leave: 1 },
  { month: "December", leave: 0 },
];

const chartConfig = {
  leave: {
    label: "Day",
    color: "var(--chart-1)",
  },
};

const LeaveSummary = () => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect); // cleanup
    };
  }, [api]);

  return (
    <div className="m-4 sm:space-y-4 space-y-3 flex-1">
      <div className="mx-auto w-[calc(100%-30px)]">
        <Carousel
          plugins={[plugin.current]}
          setApi={setApi}
          className="w-full mx-auto"
          opts={{ loop: true }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="2xl:basis-1/5 xl:basis-1/4 lg:basis-1/3 sm:basis-1/2 basis-4/5">
                <div
                  className={cn("", {
                    "sm:opacity-100 opacity-40": index !== current - 1,
                  })}
                >
                  <CardContent className="flex items-center justify-center select-none cursor-default">
                    <div className="h-fit w-full p-4 bg-container rounded-lg shadow-spread border space-y-1 relative flex flex-col items-center justify-start overflow-hidden">
                      <div className="absolute w-full h-20 top-0 left-0 bg-muted z-0"></div>

                      <Avatar className="focus:outline-none focus-visible:outline-none focus-visible:ring-0 ring-1 ring-white size-20 border-white">
                        <AvatarImage
                          src={`https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                          alt="Profile"
                          className="object-cover scale-125 object-top w-full h-full"
                        />
                        <AvatarFallback>
                          <img src={avatar2} alt="" />
                        </AvatarFallback>
                      </Avatar>

                      <h2 className="text-lg text-center font-bold text-muted-foreground relative truncate z-10">
                        Jhon Doe
                      </h2>
                      <div className="border-b w-full"></div>
                      <div className="flex justify-between items-end w-full pt-2 text-sm">
                        <div className="text-muted-foreground">Leave Taken</div>
                        <div className="font-semibold">
                          <span className="text-rose-400 text-3xl">10</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-green-400">21</span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-gray-200 relative z-10">
                        <div className="absolute left-0 z-20 h-full w-[calc((10/21)*100%)] bg-rose-400"></div>
                      </div>
                      <div className="w-full rounded mt-2">
                        <ChartContainer config={chartConfig}>
                          <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                              top: 25,
                              bottom: 8,
                            }}
                          >
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="month"
                              tickLine={false}
                              // axisLine={false}
                              tickFormatter={(value) => value.slice(0, 3)}
                              angle={-90}
                              textAnchor="end"
                              dx={-5}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="leave" fill="#fb7185" radius={4}>
                              <LabelList
                                position="top"
                                offset={6}
                                className="fill-foreground"
                                fontSize={12}
                              />
                            </Bar>
                          </BarChart>
                        </ChartContainer>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="top-[calc(100%+0.5rem)] translate-y-0 left-0" />
          <CarouselNext className="top-[calc(100%+0.5rem)] translate-y-0 right-8 translate-x-full" />
        </Carousel>
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn("h-3.5 w-3.5 rounded-full border-2", {
                "border-primary": current === index + 1,
              })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveSummary;
