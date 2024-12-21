import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

interface Room {
  id: string;
  password?: string;
  users: Map<string, string>; // socketId -> username
}

const rooms: Map<string, Room> = new Map();

function createRoom(roomId: string, password?: string): Room {
  const room: Room = { id: roomId, password, users: new Map() };
  rooms.set(roomId, room);
  return room;
}

function deleteRoom(roomId: string) {
  rooms.delete(roomId);
}

function addUserToRoom(roomId: string, socketId: string, username: string) {
  const room = rooms.get(roomId);
  if (room) {
    room.users.set(socketId, username);
  }
}

function removeUserFromRoom(roomId: string, socketId: string) {
  const room = rooms.get(roomId);
  if (room) {
    const username = room.users.get(socketId);
    room.users.delete(socketId);
    if (room.users.size === 0) {
      deleteRoom(roomId);
    }
    return username;
  }
  return null;
}

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
// Enable CORS for Next.js frontend
const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
  res.send("Welcome to the real-time chat application!");
});

io.on("connection", (socket: Socket) => {
  console.log("User connected", socket.id);

  socket.on("create-room", (roomId: string, password: string | undefined, callback: (success: boolean) => void) => {
    if (!rooms.has(roomId)) {
      createRoom(roomId, password);
      callback(true);
    } else {
      callback(false);
    }
  });

  socket.on("join-room", (roomId: string, username: string, password: string | undefined, callback: (success: boolean) => void) => {
    const room = rooms.get(roomId);
    if (room) {
      if (room.password && room.password !== password) {
        callback(false); // Password mismatch
        return;
      }
      if (!room.users.has(socket.id)) {
        socket.join(roomId);
        addUserToRoom(roomId, socket.id, username);
        console.log(`${username} joined room ${roomId}`);
        socket.to(roomId).emit("user-joined", { username, message: `${username} joined the room` });
        callback(true); // Success
      } else {
        callback(true); // User already in room
      }
    } else {
      callback(false); // Room doesn't exist
    }
  });

  socket.on("leave-room", (roomId: string, username: string) => {
    const removedUsername = removeUserFromRoom(roomId, socket.id);
    if (removedUsername) {
      socket.leave(roomId);
      console.log(`${removedUsername} left room ${roomId}`);
      socket.to(roomId).emit("user-left", { username: removedUsername, message: `${removedUsername} left the room` });
    }
  });

  socket.on("send-message", (roomId: string, message: { sender: string; content: string }) => {
    io.to(roomId).emit("new-message", message); // Broadcast message to all users in the room
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});