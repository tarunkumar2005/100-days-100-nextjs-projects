export interface User {
  id: string;
  username: string;
}

export interface Room {
  id: string;
  name: string;
  password?: string;
  users: User[];
  documentContent: string;
  messages: Message[];
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  recipant?: User;
  isPrivate: boolean;
}

export interface CursorPosition {
  id: string;
  user: User;
  position: {
    index: number;
    length: number;
  } | null;
}

export interface CursorData {
  userId: string;
  username: string;
  position: {
    index: number;
    length: number;
  } | null;
}