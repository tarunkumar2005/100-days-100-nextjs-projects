'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useUser } from "@/context/UserContext"
import TextEditor from "@/components/TextEditor"
import ChatSection from "@/components/ChatComponent"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LogOut, Users, Copy, Check } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function RoomPage() {
  const { user, room, joinRoom, leaveRoom } = useUser()
  const router = useRouter()
  const { id } = useParams()
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push('/')
    } else if (id && typeof id === 'string') {
      joinRoom(id)
    }
  }, [user, id, router, joinRoom])

  const handleLeaveRoom = () => {
    if (!user || !room) return
    leaveRoom(room.id, user.id, user.username)
    router.push('/')
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(room?.id || '')
      setIsCopied(true)
      toast({
        title: "Copied!",
        description: "Room ID has been copied to clipboard",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to copy room ID",
        variant: "destructive",
      })
    }
  }

  if (!user || !room) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-muted-foreground">Room ID: {room.id}</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6"
                onClick={copyRoomId}
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{room.users.length} online</span>
          </div>
          <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Leave Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Leave Room</DialogTitle>
                <DialogDescription>
                  Are you sure you want to leave this room? You will lose access to the document and chat.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleLeaveRoom}>Leave</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={75} minSize={30}>
          <div className={cn(
            "h-full transition-all ease-in-out duration-300",
            "border-r border-border shadow-sm"
          )}>
            <TextEditor />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <div className={cn(
            "h-full transition-all ease-in-out duration-300",
            "border-l border-border shadow-sm"
          )}>
            <ChatSection />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}