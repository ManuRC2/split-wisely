// "use client"

// import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
// import { Card } from "@/components/ui/card"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// type Person = {
//   id: string
//   name: string
//   spent: number
// }

// interface BarChartProps {
//   data: Person[]
// }

// export function BarChart({ data }: BarChartProps) {
//   // Ensure data is an array before mapping
//   console.log(data)
//   const chartData = Array.isArray(data)
//     ? data.map((person) => ({
//       name: person?.name || "Unknown",
//       spent: person?.spent || 0,
//     }))
//     : []

//   // If no data, show a message
//   if (!Array.isArray(data) || data.length === 0) {
//     return (
//       <Card className="h-full flex items-center justify-center">
//         <p className="text-gray-500">No spending data to display</p>
//       </Card>
//     )
//   }

//   return (
//     <Card className="h-full">
//       <ChartContainer className="p-4 h-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <RechartsBarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
//             <CartesianGrid strokeDasharray="3 3" vertical={false} />
//             <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
//             <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
//             <Tooltip
//               content={({ active, payload }) => {
//                 if (active && payload && payload.length) {
//                   return (
//                     <ChartTooltip>
//                       <ChartTooltipContent
//                         content={
//                           <div>
//                             <p className="text-sm font-medium">{payload[0].payload.name}</p>
//                             <p className="text-sm font-bold">${Number(payload[0].value).toFixed(2)}</p>
//                           </div>
//                         }
//                       />
//                     </ChartTooltip>
//                   )
//                 }
//                 return null
//               }}
//             />
//             <Bar dataKey="spent" fill="#ec4899" radius={[4, 4, 0, 0]} maxBarSize={60} />
//           </RechartsBarChart>
//         </ResponsiveContainer>
//       </ChartContainer>
//     </Card>
//   )
// }
