"use client"

import { useExpense } from "@/contexts/ExpenseContext"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function MonthlyComparison() {
  const { getTransactionsByMonth } = useExpense()
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const lastMonthData = getTransactionsByMonth(currentMonth - 1, currentYear)
  const currentMonthData = getTransactionsByMonth(currentMonth, currentYear)

  const calculateTotals = (transactions: ReturnType<typeof getTransactionsByMonth>) => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount
        } else {
          acc.expenses += Math.abs(transaction.amount)
        }
        return acc
      },
      { income: 0, expenses: 0 }
    )
  }

  const lastMonthTotals = calculateTotals(lastMonthData)
  const currentMonthTotals = calculateTotals(currentMonthData)

  const data = [
    { name: 'Last Month', Income: lastMonthTotals.income, Expenses: lastMonthTotals.expenses },
    { name: 'Current Month', Income: currentMonthTotals.income, Expenses: currentMonthTotals.expenses },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Income" fill="#8884d8" />
        <Bar dataKey="Expenses" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}