"use client"

import { useState } from "react"
import { useExpense } from "@/contexts/ExpenseContext"
import { MainNav } from "@/components/main-nav"
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
import { useToast } from "@/hooks/use-toast"

export default function DummyTransactionPage() {
  const { addTransaction } = useExpense()
  const [transactionId, setTransactionId] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTransaction = {
      date: new Date().toISOString().split('T')[0],
      description: `Dummy Transaction ${transactionId}`,
      amount: parseFloat(amount) * (type === "expense" ? -1 : 1),
      category: category,
      type: type,
    }
    addTransaction(newTransaction)
    toast({
      title: "Transaction Submitted",
      description: `Transaction ID: ${transactionId}, Amount: $${amount}, Category: ${category}, Type: ${type}`,
    })
    // Reset form
    setTransactionId("")
    setAmount("")
    setCategory("")
    setType("expense")
  }

  return (
    <div className="flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav />
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dummy Transaction</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="transactionId">Transaction ID (QR Code)</Label>
            <Input
              type="text"
              id="transactionId"
              placeholder="Enter transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} required>
              <SelectTrigger className="w-full">
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
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="type">Type</Label>
            <Select onValueChange={(value: "income" | "expense") => setType(value)} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Submit Transaction</Button>
        </form>
      </div>
    </div>
  )
}