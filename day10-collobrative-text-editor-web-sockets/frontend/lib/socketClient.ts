import { io, Socket } from 'socket.io-client';
import { CursorPosition, Message, User, CursorData } from '@/types/app';
import { Delta } from 'quill';

const ServerURl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

interface UserJoinedResponse {
  message: string;
  users: Array<User>;
}

interface UserLeftResponse {
  message: string;
  users: Array<User>;
}

export type SocketCallback<T> = (data: T) => void;

class SocketClient {
  private socket: Socket | null = null;

  constructor() {
    this.connect();
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(ServerURl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    })
  }

  emit(event: string, ...args: unknown[]) {
    if (!this.socket) return;
    this.socket.emit(event, ...args);
  }

  off<T>(event: string, callback: SocketCallback<T>) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  validateUserId(userId: string, callback: (success: boolean, message: string) => void): void {
    if (!this.socket?.connected) {
      callback(false, 'Not connected to server');
      return;
    }

    this.socket.emit('validate-user-id', { userId }, (response: { success: boolean, message: string }) => {
      callback(response.success, response.message);
    });
  }

  createRoom(roomName: string, roomId: string, userId: string, username: string, callback: (success: boolean, message?: string, users?: Array<User>) => void, password?: string) {
    if (!this.socket?.connected) {
      callback(false, 'Not connected to server', []);
      return;
    }

    this.socket.emit('create-room', { roomName, roomId, userId, username, password }, (response: { success: boolean, message: string, users: Array<User> }) => {
      callback(response.success, response.message, response.users);
    });
  }

  joinRoom(roomId: string, userId: string, username: string, callback: (success: boolean, message?: string) => void, password?: string) {
    if (!this.socket?.connected) {
      callback(false, 'Not connected to server')
      return;
    }

    this.socket.emit('join-room', { roomId, userId, username, password }, (response: { success: boolean, message: string }) => {
      callback(response.success, response.message);
    });
  }

  onUserJoinedRoom(callback: (response: UserJoinedResponse) => void) {
    if (!this.socket) return;

    this.socket.on('user-joined-room', callback);
  }

  onUserLeftRoom(callback: (response: UserLeftResponse) => void) {
    if (!this.socket) return;

    this.socket.on('user-left-room', callback);
  }

  sendRoomMessage(roomId: string, message: Message) {
    if (!this.socket?.connected) return;

    this.socket.emit('send-room-message', { roomId, message });
  }

  onrecieveRoomMessage(callback: (message: Message) => void) {
    if (!this.socket) return;

    this.socket.on('receive-room-message', callback);
  }

  sendPrivateRoomMessage(roomId: string, message: Message, callback: (success: boolean, message: Message) => void) {
    if (!this.socket?.connected) {
      callback(false, message);
      return;
    }

    this.socket.emit('send-private-room-message', { roomId, message }, (response: { success: boolean, message: Message }) => {
      callback(response.success, response.message);
    });
  }

  onReceivePrivateRoomMessage(callback: (message: Message) => void) {
    if (!this.socket) return;

    this.socket.on('receive-private-room-message', callback);
  }

  getRoomMessages(roomId: string, userId: string, callback: (success: boolean, message: string, messages: Array<Message>) => void) {
    if (!this.socket?.connected) {
      callback(false, 'Not connected to server', []);
      return;
    }

    this.socket.emit('get-room-messages', { roomId, userId }, (response: { success: boolean, message: string, messages: Array<Message> }) => {
      callback(response.success, response.message, response.messages);
    });
  }

  updateDocumentContent(roomId: string, userId: string, delta: Delta, callback: (success: boolean, message: string) => void) {
    if (!this.socket?.connected) {
      callback(false, 'Not connected to server');
      return;
    }

    this.socket.emit('update-document-content', { roomId, userId, delta }, (response: { success: boolean, message: string }) => {
      callback(response.success, response.message);
    });
  } 

  onReceiveDocumentContent(callback: (delta: Delta) => void) {
    if (!this.socket) return;

    this.socket.on('receive-document-content', callback);
  }

  requestDocumentContent(roomId: string, userId: string, callback: (success: boolean, message: string, content?: Delta) => void) {
    if (!this.socket?.connected) {
      callback(false, 'Not connected to server', undefined);
      return;
    }

    this.socket.emit('request-document-content', { roomId, userId }, (response: { success: boolean, message: string, content?: Delta }) => {
      callback(response.success, response.message, response.content);
    });
  }

  getRoomUsers(roomId: string, userId: string, callback: (success: boolean, message: string, users?: Array<User>) => void) {
    if (!this.socket?.connected) {
      callback(false, 'Not connected to server', []);
      return;
    }

    this.socket.emit('get-room-users', { roomId, userId }, (response: { success: boolean, message: string, users: Array<User> }) => {
      callback(response.success, response.message, response.users);
    });
  }

  sendCursorPosition(roomId: string, userId: string, cursor: CursorPosition) {
    if (!this.socket?.connected) return;
    this.socket.emit('send-cursor-position', { roomId, userId, cursor });
  }

  onReceiveCursorPosition(callback: (data: CursorData) => void) {
    if (!this.socket) return;
    this.socket.on('receive-cursor-position', callback);
  }

  userTyping(roomId: string, userId: string, username: string, isTyping: boolean) {
    if (!this.socket?.connected) return;

    this.socket.emit('user-typing', { roomId, userId, username, isTyping });
  }

  onReceiveUserTyping(callback: (userId: string, username: string, isTyping: boolean) => void) {
    if (!this.socket) return;

    this.socket.on('receive-user-typing', callback);
  }

  leaveRoom(roomId: string, userId: string, username: string) {
    if (!this.socket?.connected) return;

    this.socket.emit('leave-room', { roomId, userId, username });
  }

  disconnect() {
    if (!this.socket) return;

    this.socket.disconnect();
  }
}

const socketClient = new SocketClient();
export default socketClient;