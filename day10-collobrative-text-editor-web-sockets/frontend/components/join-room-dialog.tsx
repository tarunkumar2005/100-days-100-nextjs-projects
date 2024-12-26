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

interface JoinRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onJoinRoom: (roomId: string, password?: string) => void
}

export function JoinRoomDialog({ open, onOpenChange, onJoinRoom }: JoinRoomDialogProps) {
  const [roomId, setRoomId] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomId.trim()) {
      onJoinRoom(roomId.trim(), password || undefined)
      setRoomId("")
      setPassword("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Join Room</DialogTitle>
            <DialogDescription>
              Enter a room ID to join. If the room is password protected, you&apos;ll need to enter the password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="roomId">Room ID</Label>
              <Input
                id="roomId"
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password (if required)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter room password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Join Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}