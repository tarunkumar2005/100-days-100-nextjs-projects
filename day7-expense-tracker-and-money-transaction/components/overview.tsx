"use client"

import { useExpense } from "@/contexts/ExpenseContext"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export function Overview() {
  const { transactions } = useExpense()

  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date)
    const month = date.toLocaleString('default', { month: 'short' })
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 }
    }
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount
    } else {
      acc[month].expenses += Math.abs(transaction.amount)
    }
    return acc
  }, {} as Record<string, { income: number; expenses: number }>)

  const data = Object.entries(monthlyData).map(([name, { income, expenses }]) => ({ name, income, expenses }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}