"use client"

import { useExpense } from "@/contexts/ExpenseContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentTransactions() {
  const { transactions } = useExpense()

  const recentTransactions = transactions.slice(-5).reverse()

  return (
    <div className="space-y-8">
      {recentTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{transaction.category[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">{transaction.category}</p>
          </div>
          <div className={`ml-auto font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
            {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}