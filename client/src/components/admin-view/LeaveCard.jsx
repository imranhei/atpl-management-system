import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { ChevronsRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import avatar2 from "/avatar2.png";

const ENTITLEMENT = 21;
const fmt = (n) => {
  const num = Number(n || 0);
  return Number.isInteger(num) ? String(num) : num.toFixed(1);
};
const resolveImg = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const base = (import.meta.env?.VITE_API_URL || "").replace(/\/+$/, "");
  return base ? `${base}${url}` : url;
};

const LeaveCard = ({ user, active }) => {
  const chartData = (user?.monthly_breakdown || []).map((m) => ({
    month: m.month,
    leave: Number(m.leave || 0),
    informed_leave: Number(m.informed_leave || 0),
    uninformed_leave: Number(m.uninformed_leave || 0),
  }));

  const fullName =
    user?.first_name || user?.last_name
      ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
      : user?.username || "—";

  const img = resolveImg(user?.profile_img);
  const taken = Number(user?.total_leave || 0);
  const pct = Math.min(100, Math.max(0, (taken / ENTITLEMENT) * 100));

  return (
    <div className={cn("", { "sm:opacity-100 opacity-40": !active })}>
      <CardContent className="flex items-center justify-center select-none cursor-default">
        <div className="h-fit w-full p-4 bg-container rounded-lg shadow-spread border space-y-1 relative flex flex-col items-center justify-start overflow-hidden">
          <div className="absolute w-full h-20 top-0 left-0 bg-muted z-0" />
          <Avatar className="focus:outline-none ring-1 ring-white size-20 border-white">
            <AvatarImage
              src={img || ""}
              alt={fullName}
              className="object-cover scale-125 object-top w-full h-full"
            />
            <AvatarFallback>
              <img src={avatar2} alt="" />
            </AvatarFallback>
          </Avatar>

          <h2 className="text-lg text-center font-bold text-muted-foreground relative truncate z-10">
            {fullName}
          </h2>

          <div className="border-b w-full" />

          <div className="flex justify-between items-end w-full pt-2 text-sm">
            <div className="text-muted-foreground">Leave Taken</div>
            <div className="font-semibold">
              <span className="text-rose-400 text-3xl">{fmt(taken)}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-green-400">{ENTITLEMENT}</span>
            </div>
          </div>

          <div className="w-full h-1 bg-gray-200 relative z-10 rounded">
            <div
              className="absolute left-0 z-20 h-full bg-rose-400 rounded"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="w-full rounded mt-2">
            <ChartContainer
              config={{ leave: { label: "Day", color: "var(--chart-1)" } }}
              className="h-40 w-full"
            >
              <BarChart data={chartData} margin={{ top: 25, bottom: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickFormatter={(v) => String(v).slice(0, 3)}
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

          <Link
            className="mt-2 flex w-full items-center justify-between rounded-lg border bg-muted/20 hover:bg-muted px-3 py-2"
            to={`${user.id}`}
            aria-label="View details"
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm">View details</span>
            </div>
            <ChevronsRight className="size-4 mr-1 animate-bounce-x motion-reduce:animate-none" />
          </Link>
        </div>
      </CardContent>
    </div>
  );
};

export default LeaveCard;
