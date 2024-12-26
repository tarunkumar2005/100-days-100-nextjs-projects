'use client'

import React, { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@/context/UserContext"
import socketClient from "@/lib/socketClient"
import { Send, MessageSquare, AtSign } from 'lucide-react'
import { User, Message } from "@/types/app"
import { v4 as uuidv4 } from "uuid"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function ChatSection() {
  const { user, room, setRoom } = useUser()
  const [inputMessage, setInputMessage] = useState("")
  const [mentionedUser, setMentionedUser] = useState<User | undefined>(undefined)
  const [showMentions, setShowMentions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageHandledRef = useRef(new Set<string>())

  useEffect(() => {
    if (!user || !room) return

    const handleNewMessage = (newMessage: Message) => {
      if (messageHandledRef.current.has(newMessage.id)) {
        return
      }
      messageHandledRef.current.add(newMessage.id)

      setRoom(prevRoom => {
        if (!prevRoom) return null
        return {
          ...prevRoom,
          messages: [...prevRoom.messages, newMessage]
        }
      })
      scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handlePrivateMessage = (message: Message) => {
      if (messageHandledRef.current.has(message.id)) {
          return;
      }
      messageHandledRef.current.add(message.id);
  
      setRoom(prevRoom => {
          if (!prevRoom) return null;
          return {
              ...prevRoom,
              messages: [...prevRoom.messages, message]
          }
      });
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleUserJoinedRoom = (data: { message: string, users: User[] }) => {
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          users: data.users,
          messages: [
            ...prev.messages,
            {
              id: uuidv4(),
              sender: { id: 'system', username: 'System' },
              content: data.message,
              isPrivate: false
            }
          ]
        }
      })
    }

    const handleUserLeftRoom = (data: { message: string, users: User[] }) => {
      setRoom(prev => {
          if (!prev) return null;
          return {
              ...prev,
              users: data.users,
              messages: [
                  ...prev.messages,
                  {
                      id: uuidv4(),
                      sender: { id: 'system', username: 'System' },
                      content: data.message,
                      isPrivate: false
                  }
              ]
          }
      });
  };

    socketClient.onrecieveRoomMessage(handleNewMessage)
    socketClient.onReceivePrivateRoomMessage(handlePrivateMessage)
    socketClient.onUserJoinedRoom(handleUserJoinedRoom);
    socketClient.onUserLeftRoom(handleUserLeftRoom);

    return () => {
      socketClient.off('receive-room-message', handleNewMessage)
      socketClient.off('receive-private-room-message', handlePrivateMessage)
      socketClient.off('user-joined-room', handleUserJoinedRoom)
      socketClient.off('user-left-room', handleUserLeftRoom)
    }
  }, [user, room, setRoom])

  const cleanPrivateMessageContent = (content: string, username: string): string => {
    const pattern = new RegExp(`^@${username}\\b`);
    return content.replace(pattern, '').trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputMessage(value);

    const lastAtSymbol = value.lastIndexOf('@');
    if (lastAtSymbol !== -1) {
      const afterAtSymbol = value.slice(lastAtSymbol + 1);
      const mentionEnd = afterAtSymbol.indexOf(' ');
      if (mentionEnd === -1) {
        setShowMentions(true);
        setSearchQuery(afterAtSymbol);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
      setSearchQuery("");
    }
  };

  const handleMention = (selectedUser: User) => {
    setMentionedUser(selectedUser);
    setInputMessage((prev) => {
      const lastAtSymbol = prev.lastIndexOf('@');
      if (lastAtSymbol === -1) return prev;
      
      const beforeMention = prev.slice(0, lastAtSymbol);
      const afterMention = prev.slice(lastAtSymbol).split(' ').slice(1).join(' ');
      return `${beforeMention}@${selectedUser.username} ${afterMention}`;
    });
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const filteredUsers = room?.users.filter(u => 
    searchQuery ? 
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) : 
      true
  ) ?? [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !user || !room) return

    const messageId = uuidv4()
    let messageContent = inputMessage

    if (mentionedUser) {
      messageContent = cleanPrivateMessageContent(inputMessage, mentionedUser.username)
    }

    const newMessage: Message = {
      id: messageId,
      sender: user,
      content: messageContent,
      recipant: mentionedUser,
      isPrivate: !!mentionedUser
    }

    if (mentionedUser) {
      socketClient.sendPrivateRoomMessage(room.id, newMessage, (success) => {
        if (success) {
          messageHandledRef.current.add(messageId)
          setRoom(prevRoom => {
            if (!prevRoom) return null
            return {
              ...prevRoom,
              messages: [...prevRoom.messages, { ...newMessage, content: messageContent }]
            }
          })
        }
      })
    } else {
      messageHandledRef.current.add(messageId)
      socketClient.sendRoomMessage(room.id, newMessage)
      setRoom(prevRoom => {
        if (!prevRoom) return null
        return {
          ...prevRoom,
          messages: [...prevRoom.messages, newMessage]
        }
      })
    }

    setInputMessage("")
    setMentionedUser(undefined)
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (!user || !room) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <MessageSquare className="w-12 h-12 text-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground text-center">
          Join a room to start chatting
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Chat</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {room?.users.length || 0} users online
        </span>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {room?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender?.id === 'system' 
                  ? "justify-center" 
                  : message.sender?.id === user?.id 
                  ? "justify-end" 
                  : "justify-start"
              }`}
            >
              {message.sender?.id !== user?.id && message.sender?.id !== 'system' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10">
                    {message.sender?.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`space-y-1 ${
                message.sender?.id === 'system' 
                  ? 'w-full max-w-[80%]' 
                  : message.sender?.id === user?.id 
                  ? 'text-right' 
                  : ''
              }`}>
                {message.sender?.id !== 'system' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {message.sender?.id === user?.id ? 'You' : message.sender?.username}
                      {message.recipant && message.recipant.username !== user.username && 
                        <span> to {message.recipant.username}</span>
                      }
                    </span>
                    {message.isPrivate && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Private
                      </span>
                    )}
                  </div>
                )}
                <p className={`text-sm leading-normal inline-block p-2 rounded-lg ${
                  message.sender?.id === 'system'
                    ? message.content.includes('joined') 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-center w-full' 
                      : message.content.includes('left')
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-center w-full'
                      : 'bg-muted text-muted-foreground text-center w-full'
                    : message.sender?.id === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}>
                  {message.content}
                </p>
              </div>
            </div>          
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type a message... Use @ to mention"
              className="pr-8"
            />
            <Popover open={showMentions} onOpenChange={setShowMentions}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                >
                  <AtSign className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Command>
                  <CommandInput 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {filteredUsers.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => handleMention(user)}
                        >
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>
                              {user.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {user.username}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}