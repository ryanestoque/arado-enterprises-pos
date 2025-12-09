"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface ChartAreaProps {
  payments: any[];
}

// 1. Move static config outside to prevent re-creation on every render
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ChartArea({ payments }: ChartAreaProps) {
  const isMobile = useIsMobile()
  
  // 2. Remove the useEffect. Initialize state lazily instead.
  // This prevents the "Mount -> Effect -> SetState -> Re-render" loop.
  const [timeRange, setTimeRange] = React.useState("90d")

  // Optional: Sync mobile preference without useEffect if strictly needed, 
  // but usually leaving user control is better. If you MUST force it:
  // const activeTimeRange = isMobile ? "7d" : timeRange

  // 3. Memoize the data processing. 
  // This is critical. Without useMemo, 'filteredData' is a new array every render,
  // causing Recharts to completely reset its internal state (including refs).
  const filteredData = React.useMemo(() => {
    const chartData = payments.map(payment => ({
      date: payment.date,
      desktop: payment.total_amount,
    }));

    const referenceDate = new Date();
    let daysToSubtract = 90;
    
    // Use timeRange directly here
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    
    return chartData.filter((item) => new Date(item.date) >= startDate);
  }, [payments, timeRange]); // Only recalculate if these change

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Sales Summary</CardTitle>
        <CardDescription>
          {/* 4. Switched to standard media queries (hidden sm:block) 
             Container queries (@[540px]) can cause layout thrashing loops 
             if the chart resize triggers the breakpoint repeatedly. */}
          <span className="hidden sm:block">
            Total for the last 3 months
          </span>
          <span className="sm:hidden">Last 3 months</span>
        </CardDescription>
        
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value)}
            variant="outline"
            className="hidden sm:flex" 
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-25 text-xs sm:text-sm sm:hidden"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg text-xs sm:text-sm">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg text-xs sm:text-sm">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg text-xs sm:text-sm">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            {/* 5. Simplified ChartTooltip. 
               Avoid defining complex inline JSX structures for 'content' if possible,
               as it can confuse Recharts' ref management. */}
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}