import AddLeaveModal from "@/components/admin-view/AddLeaveModal";
import LeaveCard from "@/components/admin-view/LeaveCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { fetchLeaveSummary } from "@/store/leave/leave-slice";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const computeMaxVisible = () =>
  window.innerWidth < 640 ? 5 : window.innerWidth < 1024 ? 7 : 9;
function getWindowedPages(current, total, maxVisible = 9) {
  if (total <= maxVisible)
    return Array.from({ length: total }, (_, i) => i + 1);
  const edge = 2,
    middle = maxVisible - edge * 2 - 2;
  let start = Math.max(edge + 1, current - Math.floor(middle / 2));
  let end = Math.min(total - edge, start + middle - 1);
  start = Math.max(edge + 1, Math.min(start, total - edge - middle));
  return [
    1,
    2,
    ...(start > edge + 1 ? ["…"] : []),
    ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
    ...(end < total - edge ? ["…"] : []),
    total - 1,
    total,
  ];
}

function Pager({ api, current, count }) {
  const [maxVisible, setMaxVisible] = useState(9);
  useEffect(() => {
    const onResize = () => setMaxVisible(computeMaxVisible());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          onClick={() => api?.scrollPrev()}
          className="size-7 rounded-md border px-2 text-sm disabled:opacity-40"
          disabled={!api || current <= 1}
          aria-label="Previous"
        >
          <ChevronLeft />
        </Button>

        <div className="flex items-center gap-1">
          {getWindowedPages(current, count, maxVisible).map((p, i) =>
            p === "…" ? (
              <span
                key={`e-${i}`}
                className="px-2 text-muted-foreground select-none"
              >
                …
              </span>
            ) : (
              <Button
                variant="outline"
                key={p}
                onClick={() => api?.scrollTo(p - 1)}
                aria-current={current === p ? "page" : undefined}
                className={cn(
                  "size-7 rounded-md border px-2 text-sm duration-300 transition-all text-muted-foreground",
                  current === p
                    ? "text-primary font-semibold"
                    : "hover:bg-muted"
                )}
              >
                {p}
              </Button>
            )
          )}
        </div>

        <Button
          onClick={() => api?.scrollNext()}
          className="size-7 rounded-md border px-2 text-sm disabled:opacity-40"
          disabled={!api || current >= count}
          aria-label="Next"
        >
          <ChevronRight />
        </Button>
      </div>
    </>
  );
}

// ---------- main (short) ----------
const LeaveSummary = () => {
  const dispatch = useDispatch();
  const { leaveSummary } = useSelector((s) => s.leaveApplication);

  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  useEffect(() => {
    dispatch(fetchLeaveSummary());
  }, [dispatch]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    const handleSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", handleSelect);
    return () => api.off("select", handleSelect);
  }, [api]);

  // support either `leaveSummary.results` or array
  const results = Array.isArray(leaveSummary?.results)
    ? leaveSummary.results
    : Array.isArray(leaveSummary)
    ? leaveSummary
    : [];

  useEffect(() => {
    if (!api) return;
    api.reInit();
    const c = api.scrollSnapList().length;
    setCount(c);
    setCurrent(Math.min(api.selectedScrollSnap() + 1, Math.max(1, c)));
  }, [api, results.length]);

  return (
    <div className="m-4 sm:space-y-4 space-y-3 flex-1">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Employee Leave Summary</h1>
        <AddLeaveModal>
          <Button>Add Leave</Button>
        </AddLeaveModal>
      </div>
      <hr />
      <div className="mx-auto w-[calc(100%-10px)] pb-4">
        <Carousel
          plugins={[plugin.current]}
          setApi={setApi}
          className="w-full mx-auto"
          opts={{ loop: results.length > 1 }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {(results.length ? results : [{ id: "__empty__" }]).map(
              (user, idx) => (
                <CarouselItem
                  key={user.id ?? idx}
                  className="2xl:basis-1/5 xl:basis-1/4 lg:basis-1/3 sm:basis-1/2 basis-4/5"
                >
                  <LeaveCard user={user} active={idx === current - 1} />
                </CarouselItem>
              )
            )}
          </CarouselContent>
        </Carousel>

        <Pager api={api} current={current} count={count} />
      </div>
    </div>
  );
};

export default LeaveSummary;
