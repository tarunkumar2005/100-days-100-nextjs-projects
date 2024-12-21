"use client"

import { useState, useEffect } from "react"
import { useExpense, Transaction } from "@/contexts/ExpenseContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface EditTransactionDialogProps {
  isOpen: boolean
  onClose: () => void
  transactionId: string | null
}

export function EditTransactionDialog({ isOpen, onClose, transactionId }: EditTransactionDialogProps) {
  const { transactions, editTransaction } = useExpense()
  const [transaction, setTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    if (transactionId) {
      const foundTransaction = transactions.find(t => t.id === transactionId)
      setTransaction(foundTransaction || null)
    }
  }, [transactionId, transactions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (transaction) {
      editTransaction(transaction.id, transaction)
      onClose()
    }
  }

  if (!transaction) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={transaction.date}
                onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={transaction.description}
                onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={Math.abs(transaction.amount)}
                onChange={(e) => setTransaction({ ...transaction, amount: Number(e.target.value) * (transaction.type === 'expense' ? -1 : 1) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={transaction.category}
                onValueChange={(value) => setTransaction({ ...transaction, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={transaction.type}
                onValueChange={(value: 'income' | 'expense') => setTransaction({ ...transaction, type: value, amount: Math.abs(transaction.amount) * (value === 'expense' ? -1 : 1) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}