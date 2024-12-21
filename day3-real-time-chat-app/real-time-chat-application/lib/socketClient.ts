"use client";

import { io, Socket } from "socket.io-client";

// The socket instance will be initialized only once
let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    // Specify the URL for the Node.js WebSocket server running on port 5000
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";  // Default to Node.js WebSocket server
    socket = io(socketUrl);  // No need to specify a path here unless it's different from the default ("/")
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initSocket first.");
  }
  return socket;
};

// Room handling functions
export const createRoom = (roomId: string, password?: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = getSocket();
    socket.emit("create-room", roomId, password, (success: boolean) => {
      resolve(success);
    });
  });
};

export const joinRoom = (roomId: string, username: string, password?: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = getSocket();
    socket.emit("join-room", roomId, username, password, (success: boolean) => {
      resolve(success);
    });
  });
};

export const leaveRoom = (roomId: string, username: string) => {
  const socket = getSocket();
  socket.emit("leave-room", roomId, username);
};

export const sendMessage = (roomId: string, message: { sender: string; content: string }) => {
  const socket = getSocket();
  socket.emit("send-message", roomId, message);
};