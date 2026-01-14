"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ExpenseChartProps {
  expenses: {
    feed: number
    medicine: number
    labor: number
    infrastructure: number
  }
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const data = [
    { name: "Feed", value: expenses.feed },
    { name: "Medicine", value: expenses.medicine },
    { name: "Labor", value: expenses.labor },
    { name: "Infrastructure", value: expenses.infrastructure },
  ]

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`Rp ${value.toLocaleString("id-ID")}`, ""]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
