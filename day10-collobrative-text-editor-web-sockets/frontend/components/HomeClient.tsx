"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NameEntry } from "@/components/name-entry";
import { CreateRoomDialog } from "@/components/create-room-dialog";
import { JoinRoomDialog } from "@/components/join-room-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function HomeClient() {
  const { user, setUser, createRoom, joinRoom } = useUser();
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [joinRoomOpen, setJoinRoomOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  if (!user) {
    return <NameEntry onNameSubmit={setUser} />;
  }

  const handleCreateRoom = async (roomName: string, password?: string) => {
    const createdRoom = await createRoom(roomName, password);
    console.log("Created Room", createdRoom);
  
    if (createdRoom) {
      toast({
        variant: "default",
        title: "Room Created",
        description: `Room "${createdRoom.name}" created successfully! ID: ${createdRoom.id}`,
      });
      setCreateRoomOpen(false);
      router.push(`/room/${createdRoom.id}`);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while creating the room.",
      });
    }
  };

  const handleJoinRoom = async (roomId: string, password?: string) => {
    const newRoom = await joinRoom(roomId, password);
    if (newRoom) {
      toast({
        variant: "default",
        title: "Room Joined",
        description: `Successfully joined room: ${newRoom.id}`,
      });
      router.push(`/room/${newRoom.id}`);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to join the room.",
      });
    }
  };  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome, {user.username}!</h1>
        <p className="text-muted-foreground">
          Create a new room or join an existing one to start collaborating.
        </p>
      </div>
      <div className="flex gap-4">
        <Button size="lg" onClick={() => setCreateRoomOpen(true)}>
          Create Room
        </Button>
        <Button size="lg" variant="outline" onClick={() => setJoinRoomOpen(true)}>
          Join Room
        </Button>
      </div>

      <CreateRoomDialog
        open={createRoomOpen}
        onOpenChange={setCreateRoomOpen}
        onCreateRoom={handleCreateRoom}
      />

      <JoinRoomDialog
        open={joinRoomOpen}
        onOpenChange={setJoinRoomOpen}
        onJoinRoom={handleJoinRoom}
      />
    </div>
  );
}