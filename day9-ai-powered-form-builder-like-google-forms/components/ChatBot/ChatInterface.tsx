'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIResponse } from '@/types/form';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import TemplateSelector from './TemplateSelector';
import { templates } from './templates';
import { Loader2 } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { text: input, isUser: true }]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await axios.post<{ actions: APIResponse[] }>('/api/form-builder', { prompt: input });
      setMessages(prevMessages => [...prevMessages, { 
        text: 'Processing your request...', 
        isUser: false 
      }]);

      // Send the form actions to the FormBuilder component
      window.postMessage({ type: 'FORM_ACTION', action: response.data }, '*');
      
      setMessages(prevMessages => [...prevMessages, { 
        text: 'Done! Your form has been updated.', 
        isUser: false 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [...prevMessages, { 
        text: 'An error occurred while processing your request.', 
        isUser: false 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTemplateSelection = (templateName: string) => {
    setShowTemplateSelector(false);
    
    if (templateName === 'scratch') {
      setMessages(prevMessages => [...prevMessages, { 
        text: "Starting from scratch. What kind of form would you like to create?", 
        isUser: false 
      }]);
      return;
    }

    const selectedTemplate = templates.find(t => t.name === templateName);
    if (selectedTemplate) {
      // Create actions for template application
      const actions: APIResponse[] = [
        {
          action: 'createForm',
          formName: templateName,
          fields: selectedTemplate.fields
        }
      ];

      // Send the actions to the FormBuilder
      window.postMessage({ type: 'FORM_ACTION', action: { actions } }, '*');

      setMessages(prevMessages => [
        ...prevMessages,
        { 
          text: `Creating a ${templateName} form...`, 
          isUser: false 
        },
        { 
          text: 'Template applied! You can now customize the form or add more fields.', 
          isUser: false 
        }
      ]);
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ 
        text: "Welcome! Would you like to start with a template or create a form from scratch?", 
        isUser: false 
      }]);
    }
  }, [messages.length]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          AI Form Builder Assistant
          {isProcessing && <Loader2 className="animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${
                message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}>
                {message.text}
              </span>
            </div>
          ))}
        </ScrollArea>
        {showTemplateSelector && <TemplateSelector onSelect={handleTemplateSelection} />}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full flex space-x-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={isProcessing}
          />
          <Button type="submit" disabled={isProcessing}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;