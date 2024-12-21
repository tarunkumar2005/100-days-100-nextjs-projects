import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { createRoom, joinRoom } from '@/lib/socketClient'

export default function CreateRoomModal({ isOpen, onClose, userName }: { isOpen: boolean; onClose: () => void; userName: string }) {
  const [roomName, setRoomName] = useState('')
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted'); // Add this line for debugging
    const roomId = Math.random().toString(36).substr(2, 9)
    const success = await createRoom(roomId, isPasswordProtected ? password : undefined)
    if (success) {
      const joinSuccess = await joinRoom(roomId, userName, isPasswordProtected ? password : undefined)
      if (joinSuccess) {
        localStorage.setItem('userName', userName)
        router.push(`/room/${roomId}`)
        onClose()
      } else {
        console.error("Failed to join the created room")
      }
    } else {
      console.error("Failed to create room")
    }
  }  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/80 backdrop-filter backdrop-blur-lg border border-white/50 shadow-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">Create a New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <Label htmlFor="roomName" className="text-blue-800">Room Name</Label>
            <Input
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              required
              className="bg-white/70 border-blue-200 focus:border-blue-400"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="passwordProtection"
              checked={isPasswordProtected}
              onCheckedChange={setIsPasswordProtected}
            />
            <Label htmlFor="passwordProtection" className="text-blue-800">Password Protection</Label>
          </div>
          {isPasswordProtected && (
            <div>
              <Label htmlFor="password" className="text-blue-800">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter room password"
                required
                className="bg-white/70 border-blue-200 focus:border-blue-400"
              />
            </div>
          )}
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-xl transition duration-300 ease-in-out transform hover:scale-105">
            Create Room
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}