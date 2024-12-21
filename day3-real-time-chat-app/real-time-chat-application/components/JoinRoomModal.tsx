import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { joinRoom } from '@/lib/socketClient'

export default function JoinRoomModal({ isOpen, onClose, userName }: { isOpen: boolean; onClose: () => void; userName: string }) {
  const [roomId, setRoomId] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await joinRoom(roomId, userName, password)
    if (success) {
      localStorage.setItem('userName', userName)
      router.push(`/room/${roomId}`)
      onClose()
    } else {
      console.error("Failed to join room")
      // You might want to show an error message to the user here
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/80 backdrop-filter backdrop-blur-lg border border-white/50 shadow-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">Join a Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div>
            <Label htmlFor="roomId" className="text-blue-800">Room ID</Label>
            <Input
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              required
              className="bg-white/70 border-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-blue-800">Password (if required)</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter room password"
              className="bg-white/70 border-blue-200 focus:border-blue-400"
            />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-xl transition duration-300 ease-in-out transform hover:scale-105">
            Join Room
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}