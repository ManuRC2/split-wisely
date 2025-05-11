"use client"

import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type Person = {
  id: string
  name: string
  spent: number
}

interface PieChartProps {
  data: Person[]
  totalSpent: number
}

export function PieChart({ data, totalSpent }: PieChartProps) {
  // Skip rendering if no data or total spent is 0
  if (!Array.isArray(data) || data.length === 0 || totalSpent === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-gray-500">No spending data to display</p>
      </Card>
    )
  }

  // Transform data for the chart with defensive checks
  const chartData = data
    .filter((person) => person && (person.spent || 0) > 0) // Only include people who spent something
    .map((person) => ({
      name: person?.name || "Unknown",
      value: person?.spent || 0,
      percentage: (((person?.spent || 0) / totalSpent) * 100).toFixed(1),
    }))

  // If no chart data after filtering, show a message
  if (chartData.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-gray-500">No spending data to display</p>
      </Card>
    )
  }

  // Colors for the pie chart
  const COLORS = ["#ec4899", "#14b8a6", "#8b5cf6", "#f97316", "#06b6d4", "#84cc16", "#f43f5e", "#0ea5e9"]

  return (
    <Card className="h-full">
      <ChartContainer className="p-4 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltip>
                      <ChartTooltipContent
                        content={
                          <div>
                            <p className="text-sm font-medium">{payload[0].payload.name}</p>
                            <p className="text-sm font-bold">${Number(payload[0].value).toFixed(2)}</p>
                            <p className="text-xs text-gray-500">{payload[0].payload.percentage}% of total</p>
                          </div>
                        }
                      />
                    </ChartTooltip>
                  )
                }
                return null
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}
