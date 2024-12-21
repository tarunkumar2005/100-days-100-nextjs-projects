"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

export type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: 'income' | 'expense'
  notes?: string
}

type ExpenseContextType = {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  editTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  totalIncome: number
  totalExpenses: number
  savings: number
  getTransactionsByMonth: (month: number, year: number) => Transaction[]
  getTransactionsByCategory: () => Record<string, number>
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export const useExpense = () => {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider')
  }
  return context
}

const dummyTransactions: Transaction[] = [
  { id: uuidv4(), date: '2023-05-01', description: 'Salary', amount: 5000, category: 'Income', type: 'income' },
  { id: uuidv4(), date: '2023-05-05', description: 'Rent', amount: -1500, category: 'Housing', type: 'expense' },
  { id: uuidv4(), date: '2023-05-10', description: 'Groceries', amount: -200, category: 'Food', type: 'expense' },
  { id: uuidv4(), date: '2023-05-15', description: 'Freelance Work', amount: 1000, category: 'Income', type: 'income' },
  { id: uuidv4(), date: '2023-05-20', description: 'Dining Out', amount: -100, category: 'Food', type: 'expense' },
  { id: uuidv4(), date: '2023-05-25', description: 'Utilities', amount: -150, category: 'Bills', type: 'expense' },
  { id: uuidv4(), date: '2023-06-01', description: 'Salary', amount: 5000, category: 'Income', type: 'income' },
  { id: uuidv4(), date: '2023-06-05', description: 'Rent', amount: -1500, category: 'Housing', type: 'expense' },
  { id: uuidv4(), date: '2023-06-10', description: 'Groceries', amount: -220, category: 'Food', type: 'expense' },
  { id: uuidv4(), date: '2023-06-15', description: 'Bonus', amount: 2000, category: 'Income', type: 'income' },
]

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions')
    if (storedTransactions) {
      setTransactions([...JSON.parse(storedTransactions), ...dummyTransactions])
    } else {
      setTransactions(dummyTransactions)
      localStorage.setItem('transactions', JSON.stringify(dummyTransactions))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: uuidv4() }
    setTransactions(prev => [...prev, newTransaction])
  }

  const editTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
    ))
  }

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id))
  }

  const totalIncome = transactions.reduce((sum, transaction) => 
    transaction.type === 'income' ? sum + transaction.amount : sum, 0)

  const totalExpenses = transactions.reduce((sum, transaction) => 
    transaction.type === 'expense' ? sum + Math.abs(transaction.amount) : sum, 0)

  const savings = totalIncome - totalExpenses

  const getTransactionsByMonth = (month: number, year: number) => {
    return transactions.filter(transaction => {
      const date = new Date(transaction.date)
      return date.getMonth() === month && date.getFullYear() === year
    })
  }

  const getTransactionsByCategory = () => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'expense') {
        acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount)
      }
      return acc
    }, {} as Record<string, number>)
  }

  return (
    <ExpenseContext.Provider value={{ 
      transactions, 
      addTransaction, 
      editTransaction,
      deleteTransaction,
      totalIncome, 
      totalExpenses, 
      savings,
      getTransactionsByMonth,
      getTransactionsByCategory
    }}>
      {children}
    </ExpenseContext.Provider>
  )
}