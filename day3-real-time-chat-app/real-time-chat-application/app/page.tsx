'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CreateRoomModal from '@/components/CreateRoomModal'
import JoinRoomModal from '@/components/JoinRoomModal'
import { initSocket } from '@/lib/socketClient'

export default function Home() {
  const [modals, setModals] = useState({ create: false, join: false })
  const [userName, setUserName] = useState('')

  useEffect(() => {
    try {
      initSocket();
    } catch (err) {
      console.error("Error initializing socket:", err);
    }
  }, []);

  const openModal = (type: 'create' | 'join') => setModals({ ...modals, [type]: true });
  const closeModal = (type: 'create' | 'join') => setModals({ ...modals, [type]: false });

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-white/40 backdrop-filter backdrop-blur-lg border border-white/50 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-2 text-center">Glossy Chat</h1>
          <p className="text-blue-800 mb-6 text-center">Enter your name and create or join a room to start chatting</p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="userName" className="text-blue-800">Your Name</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                aria-label="Your Name"
                className="bg-white/70 border-blue-200 focus:border-blue-400"
              />
              {userName.trim() === '' && (
                <p className="text-red-600 text-sm mt-2">Please enter your name before proceeding.</p>
              )}
            </div>
            <Button 
              onClick={() => openModal('create')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              disabled={!userName}
              title={!userName ? "Enter your name to enable this button" : ""}
            >
              Create a Room
            </Button>
            <Button 
              onClick={() => openModal('join')}
              variant="outline" 
              className="w-full border-2 border-blue-400 text-blue-600 font-semibold py-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-50 shadow-md"
              disabled={!userName}
              title={!userName ? "Enter your name to enable this button" : ""}
            >
              Join a Room
            </Button>
          </div>
        </CardContent>
      </Card>
      <CreateRoomModal isOpen={modals.create} onClose={() => closeModal('create')} userName={userName} />
      <JoinRoomModal isOpen={modals.join} onClose={() => closeModal('join')} userName={userName} />
    </div>
  )
}