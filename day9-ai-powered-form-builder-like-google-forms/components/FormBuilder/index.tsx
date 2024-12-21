'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FormField, APIResponse } from '@/types/form';
import FormPreview from './FormPreview';
import { handleFormAction } from '@/lib/formActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { findInsertPosition } from '@/lib/fieldOrganizer';
import { Progress } from '@/components/ui/progress';

const FormBuilder: React.FC = () => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [formId, setFormId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionStatus, setActionStatus] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setFormId(generateFormId());
  }, []);

  const handleFieldUpdate = (index: number, updatedField: FormField) => {
    const newFields = [...formFields];
    newFields[index] = updatedField;
    setFormFields(newFields);
  };

  const handleFieldDelete = (index: number) => {
    const newFields = formFields.filter((_, i) => i !== index);
    setFormFields(newFields);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(formFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormFields(items);
  };

  const handleAction = useCallback(async (actions: APIResponse[]) => {
    setIsProcessing(true);
    let updatedFields = [...formFields]; // Create a copy to preserve existing fields

    const totalActions = actions.length;
    let completedActions = 0;

    for (const action of actions) {
      setActionStatus(`Processing: ${action.action}`);
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate processing time

      switch (action.action) {
        case 'changeFormName':
          setFormTitle(action.formName || 'Untitled Form');
          break;
        case 'createForm':
          if (action.fields && action.fields.length > 0) {
            updatedFields = action.fields;
          }
          setFormTitle(action.formName || 'New Form');
          break;
        case 'addField':
          if (action.field) {
            const insertIndex = findInsertPosition(updatedFields, action.field);
            updatedFields.splice(insertIndex, 0, action.field);
          }
          break;
        case 'changeTheme':
          setTheme(action.themeChoice || 'light');
          break;
        default:
          updatedFields = handleFormAction(updatedFields, action);
      }

      completedActions++;
      setProgress((completedActions / totalActions) * 100);
    }

    setFormFields(updatedFields);
    setIsProcessing(false);
    setActionStatus('');
    setProgress(0);
    toast({
      title: "Actions Completed",
      description: `${actions.length} action(s) have been processed successfully.`,
    });
  }, [formFields, setFormFields, setFormTitle, setTheme, toast]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'FORM_ACTION') {
        handleAction(event.data.action.actions as APIResponse[]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [formFields, handleAction]);

  const generateFormId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const getShareableLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/form/${formId}`;
  };

  const handleShareForm = () => {
    const link = getShareableLink();
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "The shareable link has been copied to your clipboard.",
    });
  };

  return (
    <div className={`container mx-auto p-4 ${theme === 'dark' ? 'dark' : ''}`}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <Input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="text-3xl font-bold w-full outline-none border-none"
            />
          </CardTitle>
          <div className="flex items-center space-x-2">
            {isProcessing && (
              <div className="flex items-center space-x-2">
                <Loader2 className="animate-spin" />
                <div className="text-sm text-muted-foreground">{actionStatus}</div>
              </div>
            )}
            <Button onClick={handleShareForm}>Share Form</Button>
          </div>
        </CardHeader>
        {isProcessing && progress > 0 && (
          <Progress value={progress} className="w-full" />
        )}
        <DragDropContext onDragEnd={handleDragEnd}>
          <CardContent>
            <Tabs defaultValue="edit">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <FormPreview
                  fields={formFields}
                  onUpdateField={handleFieldUpdate}
                  onDeleteField={handleFieldDelete}
                  isEditing={true}
                />
              </TabsContent>
              <TabsContent value="preview">
                <FormPreview
                  fields={formFields}
                  onUpdateField={handleFieldUpdate}
                  onDeleteField={handleFieldDelete}
                  isEditing={false}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </DragDropContext>
      </Card>
    </div>
  );
};

export default FormBuilder;