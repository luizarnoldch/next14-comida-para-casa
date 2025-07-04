"use client"
import * as React from "react"
import type { ChartConfig } from "@/components/ui/chart"
import { Pie, PieChart, Label } from "recharts"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type CircularDashProps<T> = {
  data: T[]
  field: keyof T
  title: string
  description?: string
  footerComponent?: React.ReactNode
  sortOrder?: 'asc' | 'desc'
  limit?: number
}

export default function CircularDash<T extends Record<string, any>>({
  data,
  field,
  title,
  description,
  footerComponent,
  sortOrder = 'desc',
  limit,
}: CircularDashProps<T>) {
  const colors = [
    "#4c6ef5",
    "#15aabf",
    "#fcc419",
    "#ff6b6b",
    "#12b886",
    "#e64980",
    "#7950f2",
  ]

  // Agrupar y contar
  const groupedData = React.useMemo(() => {
    const counts: Record<string, number> = {}
    data.forEach((item) => {
      const key = String(item[field]) || "Indeterminado"
      counts[key] = (counts[key] || 0) + 1
    })
    let entries = Object.entries(counts).map(([key, count], idx) => ({
      name: key,
      value: count,
      fill: colors[idx % colors.length],
    }))

    // Ordenar
    entries = entries.sort((a, b) =>
      sortOrder === "asc" ? a.value - b.value : b.value - a.value
    )

    // Limitar
    if (limit !== undefined) {
      entries = entries.slice(0, limit)
    }

    return entries
  }, [data, field, sortOrder, limit])

  // construir chartConfig...
  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {}
    groupedData.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      }
    })
    return config
  }, [groupedData])

  // Total para el label central
  const total = groupedData.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <Card className="flex flex-col">
      {/* Header del card */}
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      {/* Contenido gráfico */}
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={groupedData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              paddingAngle={2}
            >
              <Label
                content={({ viewBox }) =>
                  viewBox && "cx" in viewBox && "cy" in viewBox ? (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {total.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Comentarios
                      </tspan>
                    </text>
                  ) : null
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      {/* Footer del card con contenido dinámico */}
      <CardFooter className="flex-col gap-2 text-sm">
        {footerComponent}
      </CardFooter>
    </Card>
  )
}