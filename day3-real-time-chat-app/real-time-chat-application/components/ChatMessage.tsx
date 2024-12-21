interface Message {
  id: number;
  sender: string;
  content: string;
}

export default function ChatMessage({ message }: { message: Message }) {
  const isCurrentUser = message.sender === 'You'

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
      }`}>
        <p className="font-bold">{message.sender}</p>
        <p>{message.content}</p>
      </div>
    </div>
  )
}