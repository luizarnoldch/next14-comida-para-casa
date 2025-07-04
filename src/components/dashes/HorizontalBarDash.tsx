"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type HorizontalBarDashProps<T> = {
  data: T[]
  groupByKey: keyof T         // campo para agrupar (atributo de cada objeto)
  title: string
  description?: string
  footerComponent?: React.ReactNode
  barColor?: string
  /**
   * Orden de los datos numéricos (eje X):
   * 'desc' = de mayor a menor, 'asc' = de menor a mayor
   */
  sortOrder?: 'asc' | 'desc'
  /**
   * Límite de grupos a mostrar tras ordenar
   */
  limit?: number
}

export default function HorizontalBarDash<T extends Record<string, any>>({
  data,
  groupByKey,
  title,
  description,
  footerComponent,
  barColor = "hsl(var(--chart-1))",
  sortOrder = 'desc',
  limit,
}: HorizontalBarDashProps<T>) {
  // Agrupar data por groupByKey y contar ocurrencias
  const groupedData = React.useMemo(() => {
    const counts: Record<string, number> = {}

    data.forEach(item => {
      const key = String(item[groupByKey]) || "Indeterminado"
      counts[key] = (counts[key] || 0) + 1
    })

    // Convertir a un array compatible con BAR chart
    const array = Object.entries(counts).map(([key, count]) => ({
      category: key,
      count,
    }))

    // Ordenar según sortOrder
    const sorted = array.sort((a, b) =>
      sortOrder === 'asc' ? a.count - b.count : b.count - a.count
    )

    // Aplicar límite si se especifica
    return typeof limit === 'number' ? sorted.slice(0, limit) : sorted
  }, [data, groupByKey, sortOrder, limit])

  // Crear chartConfig para ChartContainer: una key "count"
  const chartConfig: ChartConfig = React.useMemo(() => {
    return {
      count: {
        label: "Cantidad",
        color: barColor,
      },
    } satisfies ChartConfig
  }, [barColor])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={groupedData}
            layout="vertical"
            margin={{ left: 20 }}
          >
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                typeof value === "string" ? value.slice(0, 10) : value
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill={barColor} radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-center items-center flex-col gap-2 text-sm">
        {/* {footerComponent || (
          <>
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </>
        )} */}
      </CardFooter>
    </Card>
  )
}
