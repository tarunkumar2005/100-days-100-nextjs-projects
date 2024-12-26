"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/context/UserContext"
import { User } from "@/types/app"

interface NameEntryProps {
  onNameSubmit: (user: User) => void;
}

export function NameEntry({ onNameSubmit }: NameEntryProps) {
  const { generateRandomUserId } = useUser()
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const userId = generateRandomUserId(name)
    if (userId != null && name != null) {
      onNameSubmit({
        id: userId,
        username: name,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to CollabEdit</CardTitle>
          <CardDescription>Enter your name to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}