import FormBuilder from '@/components/FormBuilder';
import ChatBot from '@/components/ChatBot';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <FormBuilder />
      <ChatBot />
    </main>
  );
}