"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import socketClient from "@/lib/socketClient";
import { v4 as uuidv4 } from "uuid";
import { User, Room, Message } from "@/types/app";
import { useToast } from "@/hooks/use-toast";
import { Delta } from 'quill';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  room: Room | null;
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  createRoom: (roomName: string, password?: string) => Promise<Room | null>;
  joinRoom: (roomId: string, password?: string) => Promise<Room | null>;
  leaveRoom: (roomId: string, userId: string, username: string) => void;
  generateRandomUserId: (username: string) => string;
  sendDocumentChanges: (delta: Delta) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const { toast } = useToast();

  const createRoom = useCallback((roomName: string, password?: string): Promise<Room | null> => {
    return new Promise((resolve) => {
      if (!user) {
        resolve(null);
        return;
      }
      
      const roomId = uuidv4();
  
      socketClient.createRoom(roomName, roomId, user.id, user.username, (success: boolean, message?: string, users?: User[]) => {
  
        if (success) {
          const newRoom: Room = {
            id: roomId,
            name: roomName,
            password,
            users: users || [],
            documentContent: '',
            messages: [],
          }
          setRoom(newRoom);
          resolve(newRoom);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: message || "An error occurred while creating the room",
          });
          resolve(null);
        }
      }, password);
    });
  }, [user]);  

  const joinRoom = useCallback(async (roomId: string, password?: string): Promise<Room | null> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User is not authenticated.",
      });
      return null;
    }
  
    try {
      // Step 1: Join the room
      await new Promise<void>((resolve, reject) => {
        socketClient.joinRoom(roomId, user.id, user.username, (success: boolean, message?: string) => {
          if (success) {
            resolve();
          } else {
            reject(message || "An error occurred while joining the room.");
          }
        });
      });
  
      // Step 2: Fetch users in the room
      const users = await new Promise<User[]>((resolve, reject) => {
        socketClient.getRoomUsers(roomId, user.id, (success: boolean, message?: string, users?: User[]) => {
          if (success) {
            resolve(users || []);
          } else {
            reject(message || "An error occurred while retrieving users.");
          }
        });
      });
  
      // Step 3: Fetch document content
      const documentContent = await new Promise<string>((resolve, reject) => {
        socketClient.requestDocumentContent(roomId, user.id, (success: boolean, message?: string, content?: Delta) => {
          if (success) {
            resolve(content ? JSON.stringify(content) : '');
          } else {
            reject(message || "An error occurred while retrieving document content.");
          }
        });
      });
  
      // Step 4: Fetch messages
      const messages = await new Promise<Message[]>((resolve, reject) => {
        socketClient.getRoomMessages(roomId, user.id, (success: boolean, message?: string, messages?: Message[]) => {
          if (success) {
            resolve(messages || []);
          } else {
            reject(message || "An error occurred while retrieving messages.");
          }
        });
      });
  
      // Step 5: Update room state
      const roomData: Room = {
        id: roomId,
        name: '', // Assume room name is not available in this context
        password,
        users,
        documentContent,
        messages,
      };
      setRoom(roomData);
  
      return roomData; // Return the room data
  
    } catch (error) {
      // Handle errors and show a toast notification
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : String(error),
      });
  
      return null;
    }
  }, [user]); 

  const generateRandomUserId = (username: string): string => {
    if (username === '' || username === null) return '';

    const userId = uuidv4();
    socketClient.validateUserId(userId, (success: boolean, message: string) => {
      if (!success) {
        toast({
          variant: 'destructive',
          title: "Error",
          description: message || 'Error in generating the user id',
        })
      }
    });
    return userId;
  }

  const sendDocumentChanges = (delta: Delta) => {
    if (!room || !user) return;

    socketClient.updateDocumentContent(room.id, user.id, delta, (success: boolean, message: string) => {
      if (!success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message || 'An error occurred while updating the document content',
        });
      }
    })
  }

  const leaveRoom = (roomId: string, userId: string, username: string) => {
    socketClient.leaveRoom(roomId, userId, username);

    setRoom(null);
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        room,
        setRoom,
        createRoom,
        joinRoom,
        generateRandomUserId,
        sendDocumentChanges,
        leaveRoom,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}