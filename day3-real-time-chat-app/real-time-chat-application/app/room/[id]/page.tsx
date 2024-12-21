'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, ArrowLeft } from 'lucide-react'
import { initSocket, getSocket, joinRoom, leaveRoom, sendMessage } from '@/lib/socketClient'

interface Message {
  id: number;
  type: 'chat' | 'notification';
  sender?: string;
  content: string;
}

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [userName, setUserName] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null)
  const hasJoinedRoom = useRef(false)

  const joinRoomCallback = useCallback(async () => {
    const storedName = localStorage.getItem('userName')
    if (storedName && !hasJoinedRoom.current) {
      setUserName(storedName)
      try {
        await joinRoom(params.id as string, storedName)
        hasJoinedRoom.current = true
        console.log(`${storedName} joined room ${params.id}`)
      } catch (error) {
        console.error('Failed to join room:', error)
        router.push('/')
      }
    } else if (!storedName) {
      router.push('/')
    }
  }, [params.id, router])

  useEffect(() => {
    if (!socketRef.current) {
      initSocket(); // Initialize socket only once
      socketRef.current = getSocket(); // Assign to socketRef
    }
    joinRoomCallback();
  
    return () => {
      if (userName && hasJoinedRoom.current) {
        leaveRoom(params.id as string, userName);
        hasJoinedRoom.current = false;
      }
    };
  }, [params.id, userName, joinRoomCallback]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
  
    const onUserJoined = (data: { username: string; message: string }) => {
      setMessages(prev => [...prev, { id: Date.now(), type: 'notification', content: data.message }]);
    };
  
    const onUserLeft = (data: { username: string; message: string }) => {
      setMessages(prev => [...prev, { id: Date.now(), type: 'notification', content: data.message }]);
    };
  
    const onNewMessage = (message: { sender: string; content: string }) => {
      setMessages(prev => [...prev, { id: Date.now(), type: 'chat', sender: message.sender, content: message.content }]);
    };
  
    socket.on('user-joined', onUserJoined);
    socket.on('user-left', onUserLeft);
    socket.on('new-message', onNewMessage);
  
    return () => {
      socket.off('user-joined', onUserJoined);
      socket.off('user-left', onUserLeft);
      socket.off('new-message', onNewMessage);
    };
  }, []);  

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      sendMessage(params.id as string, { sender: userName, content: message })
      setMessage('')
    }
  }

  const handleLeaveRoom = () => {
    if (hasJoinedRoom.current) {
      leaveRoom(params.id as string, userName)
      hasJoinedRoom.current = false
    }
    localStorage.removeItem('userName')
    router.push('/')
  }

  return (
    <div className="flex flex-col h-screen p-4 md:p-8">
      <div className="bg-white/40 backdrop-filter backdrop-blur-lg border border-white/50 shadow-xl rounded-2xl overflow-hidden flex flex-col h-full">
        <header className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white flex items-center">
          <Button variant="ghost" onClick={handleLeaveRoom} className="mr-2 text-white hover:text-blue-200">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold flex-grow">Room: {params.id}</h1>
          <Avatar className="w-8 h-8">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${userName}`} alt={userName} />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
        </header>
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`mb-4 ${msg.type === 'chat' ? (msg.sender === userName ? 'text-right' : 'text-left') : 'text-center'}`}>
              {msg.type === 'chat' ? (
                <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  msg.sender === userName 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                    : 'bg-white/70 text-blue-800'
                } shadow-md`}>
                  <p className="font-semibold mb-1">{msg.sender}</p>
                  <p>{msg.content}</p>
                </div>
              ) : (
                <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                  {msg.content}
                </span>
              )}
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="p-4 bg-white/60 backdrop-filter backdrop-blur-sm border-t border-white/50">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow bg-white/70 backdrop-filter backdrop-blur-sm border-blue-200 focus:border-blue-400 rounded-xl"
            />
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-4 transition duration-300 ease-in-out transform hover:scale-105">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}