"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface CreateRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateRoom: (roomName: string, password?: string) => void
}

export function CreateRoomDialog({ open, onOpenChange, onCreateRoom }: CreateRoomDialogProps) {
  const [roomName, setRoomName] = useState("")
  const [usePassword, setUsePassword] = useState(false)
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomName.trim()) {
      onCreateRoom(roomName.trim(), usePassword ? password : undefined)
      setRoomName("")
      setPassword("")
      setUsePassword(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Room</DialogTitle>
            <DialogDescription>
              Create a new room for collaborative editing. You can optionally protect it with a password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="password-protection"
                checked={usePassword}
                onCheckedChange={setUsePassword}
              />
              <Label htmlFor="password-protection">Password protect this room</Label>
            </div>
            {usePassword && (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter room password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Create Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}