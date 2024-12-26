import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';

interface User {
  id: string;
  username: string;
}

interface Room {
  id: string;
  name: string;
  password?: string;
  users: Map<string, User>;
  documentContent: string;
  messages: Message[];
}

interface Message {
  id: string;
  sender: User;
  content: string;
  recipant?: User;
  isPrivate: boolean;
}

interface CursorPosition {
  id: string;
  user: User;
  position: {
    index: number;
    length: number;
  } | null;
}

const rooms: Map<string, Room> = new Map();

const activeUsers: Map<string, string> = new Map();

const app = express();
app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true,
  }
));

const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

io.on('connection', (socket: Socket) => {
  console.log('Connected to client', socket.id);

  socket.on('validate-user-id', (data: { userId: string }, callback) => {
    if (activeUsers.has(data.userId)) {
      callback({ success: false, message: 'User ID already in use, please choose a different one' });
      return;
    }

    callback({ success: true, message: 'User ID is available' });
  })

  // Create a new room
  socket.on('create-room', (data: { roomName: string, roomId: string, userId: string, username: string, password?: string }, callback) => {
    try {
      if (activeUsers.has(data.userId)) {
        callback({ success: false, message: 'User ID already in use, Please try again' });
        return;
      }

      if (rooms.has(data.roomId)) {
        callback({ success: false, message: 'Room already exists' });
        return;
      }

      const room: Room = {
        id: data.roomId,
        name: data.roomName,
        password: data.password,
        users: new Map(),
        documentContent: '',
        messages: [],
      }
      rooms.set(data.roomId, room);
      socket.join(data.roomId);

      room.users.set(socket.id, {
        id: data.userId,
        username: data.username
      });

      callback({
        success: true,
        message: `Room ${data.roomName} created successfully`,
        users: Array.from(room.users.values()),
      });
    } catch (error) {
      console.error("Error creating room:", error);
      callback({ success: false, message: 'Internal server error' });
    }
  })

  // Join a existing room
  socket.on('join-room', async (data: { roomId: string, userId: string, username: string, password?: string }, callback) => {
    try {
      if (activeUsers.has(data.userId)) {
        callback({ success: false, message: 'User ID already in use, please choose a different one' });
        return;
      }
  
      const room = rooms.get(data.roomId);
      if (!room) {
        callback({
          success: false,
          message: `Room ${data.roomId} does not exist`,
        });
        return;
      }
  
      if (room.password && room.password !== data.password) {
        callback({
          success: false,
          message: 'Incorrect password',
        });
        return;
      }
  
      await socket.join(data.roomId);
      room.users.set(socket.id, {
        id: data.userId,
        username: data.username
      });
  
      activeUsers.set(data.userId, socket.id);
  
      // Broadcast to other users in the room
      socket.to(data.roomId).emit('user-joined-room', {
        message: `${data.username} joined the room`,
        users: Array.from(room.users.values()),
      });
  
      // Send success response to joining user without broadcasting the join message
      callback({
        success: true,
        message: `Successfully joined room ${room.name}`,
        users: Array.from(room.users.values()),
      });
    } catch (error) {
      console.error('Error joining room:', error);
      callback({
        success: false,
        message: 'Failed to join room',
      });
    }
  });

  // Send a public room message to everyone in the room
  socket.on('send-room-message', (data: { roomId: string, message: Message }) => {
    const room = rooms.get(data.roomId);
    if (!room) {
      return;
    }

    socket.to(data.roomId).emit('receive-room-message', data.message);

    // Save the message in the room
    room.messages.push(data.message);
  })

  // Send a private message to a specific user in the room
  socket.on('send-private-room-message', (data: { roomId: string, message: Message }, callback) => {
    const room = rooms.get(data.roomId);
    if (!room) {
      callback({
        success: false,
        message: `Room ${data.roomId} does not exist`,
      })
      return;
    }

    const recipientSocketId = Array.from(room.users.entries())
        .find(([_, user]) => user.id === data.message.recipant?.id)?.[0];

    if (!recipientSocketId) {
      callback({
        success: false,
        message: `Recipient ${data.message.recipant?.username} is not available`,
      })
      return;
    }

    // Remove '@username ' pattern from the message content
    const recipientUsername = data.message.recipant?.username || '';
    const pattern = new RegExp(`^@${recipientUsername}\\b`);
    const cleanedContent = data.message.content.replace(pattern, '').trim();

    const privateMessage = {
      id: data.message.id,
      sender: data.message.sender,
      content: cleanedContent,
      recipant: data.message.recipant,
      isPrivate: true
    };

    // Send to recipient
    io.to(recipientSocketId).emit('receive-private-room-message', privateMessage);

    // Save in room history
    room.messages.push(privateMessage);

    callback({
      success: true,
      message: 'Private message sent successfully',
    })
  })

  // Request the list of messages in the room
  socket.on('get-room-messages', (data: { roomId: string, userId: string }, callback) => {
    const room = rooms.get(data.roomId);
    if (!room) {
      callback({
        success: false,
        message: `Room ${data.roomId} does not exist`,
      })
      return;
    }
    
    const isUserInRoom = Array.from(room.users.values()).some(user => user.id === data.userId);

    if (!isUserInRoom) {
      callback({
        success: false,
        message: 'User is not in the room',
      })
      return;
    }

    callback({
      success: true,
      message: 'Room messages retrieved successfully',
      messages: room.messages,
    })
  })

  // Update the content of the document in the room
  socket.on('update-document-content', (data: { roomId: string, userId: string, delta: any }, callback) => {
    try {
      const room = rooms.get(data.roomId);
      if (!room) {
        callback({
          success: false,
          message: `Room ${data.roomId} does not exist`,
        })
        return;
      }

      const isUserInRoom = Array.from(room.users.values()).some(user => user.id === data.userId);

      if (!isUserInRoom) {
        callback({
          success: false,
          message: 'User is not in the room',
        })
        return;
      }

      // Initialize document content if empty
      if (!room.documentContent) {
        room.documentContent = JSON.stringify(data.delta);
      } else {
        // Merge the incoming delta with existing content
        const currentContent = JSON.parse(room.documentContent);
        const newDelta = typeof data.delta === 'string' ? JSON.parse(data.delta) : data.delta;
        room.documentContent = JSON.stringify({
          ...currentContent,
          ops: [...(currentContent.ops || []), ...(newDelta.ops || [])]
        });
      }

      // Broadcast the updated document content to everyone in the room
      socket.to(data.roomId).emit('receive-document-content', data.delta);

      callback({
        success: true,
        message: 'Document content updated successfully',
      })
    } catch (error) {
      console.error('Error updating document content:', error);
      callback({
        success: false,
        message: 'Failed to update document content',
      })
    }
  })

  // Request the current document content in the room
  socket.on('request-document-content', (data: { roomId: string, userId: string }, callback) => {
    const room = rooms.get(data.roomId);
    if (!room) {
      callback({
        success: false,
        message: `Room ${data.roomId} does not exist`,
      })
      return;
    }

    const isUserInRoom = Array.from(room.users.values()).some(user => user.id === data.userId);

    if (!isUserInRoom) {
      callback({
        success: false,
        message: 'User is not in the room',
      })
      return;
    }

    callback({
      success: true,
      message: 'Document content retrieved successfully',
      content: room.documentContent,
    })
  })

  // Get the list of users in the room
  socket.on('get-room-users', (data: { roomId: string, userId: string }, callback) => {
    const room = rooms.get(data.roomId);
    if (!room) {
      callback({
        success: false,
        message: `Room ${data.roomId} does not exist`,
      })
      return;
    }

    const isUserInRoom = Array.from(room.users.values()).some(user => user.id === data.userId);

    if (!isUserInRoom) {
      callback({
        success: false,
        message: 'User is not in the room',
      })
      return;
    }

    callback({
      success: true,
      message: 'Room users retrieved successfully',
      users: Array.from(room.users.values()),
    })
  })

  // Get cursor position of a user in the room when they are typing
  socket.on('send-cursor-position', (data: { roomId: string, userId: string, cursor: CursorPosition }) => {
    const room = rooms.get(data.roomId);
    if (!room) {
      return;
    }

    socket.to(data.roomId).emit('receive-cursor-position', {
      userId: data.userId,
      username: data.cursor.user.username,
      position: data.cursor.position
    });
  })

  // User typing indicator in the room
  socket.on('user-typing', (data: { roomId: string, userId: string, username: string, isTyping: boolean }) => {
    const room = rooms.get(data.roomId);
    if (!room) {
      return;
    }

    socket.to(data.roomId).emit('receive-user-typing', {
      id: data.userId,
      username: data.username,
      isTyping: data.isTyping,
    });
  })

  // Handle user disconnection
  socket.on('leave-room', (data: { roomId: string, userId: string, username: string }) => {
    const room = rooms.get(data.roomId);
    if (!room) {
      return;
    }

    room.users.delete(socket.id);
    activeUsers.delete(data.userId);

    socket.to(data.roomId).emit('user-left-room', {
      message: `${data.username} left the room`,
      users: Array.from(room.users.values()),
    })

    if (room.users.size === 0) {
      rooms.delete(data.roomId);
    }

    socket.leave(data.roomId);
  })

  // Disconnect 
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);

    // Find the user by their socket ID and remove from activeUsers
    for (const [roomId, room] of rooms.entries()) {
      const userToRemove = Array.from(room.users.entries())
          .find(([socketId, _]) => socketId === socket.id);

      if (userToRemove) {
          const [_, user] = userToRemove;
          room.users.delete(socket.id);
          activeUsers.delete(user.id);

          socket.to(roomId).emit('user-left-room', {
              message: `${user.username} left the room`,
              users: Array.from(room.users.values())
          });

          if (room.users.size === 0) {
              rooms.delete(roomId);
          }
      }
    }
  })
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});