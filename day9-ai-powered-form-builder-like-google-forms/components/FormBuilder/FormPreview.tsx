'use client';

import React, { useState } from 'react';
import { FormField } from '@/types/form';
import FormFieldComponent from './FormField';
import FieldCustomizer from './FieldCustomizer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { categorizeField } from '@/lib/fieldOrganizer';
import { motion, AnimatePresence } from 'framer-motion';

interface FormPreviewProps {
  fields: FormField[];
  onUpdateField: (index: number, updatedField: FormField) => void;
  onDeleteField: (index: number) => void;
  isEditing: boolean;
}

const FormPreview: React.FC<FormPreviewProps> = ({ fields, onUpdateField, onDeleteField, isEditing }) => {
  const [formData, setFormData] = useState<Record<string, string | number | boolean | Date | FileList | null>>({});
  const { toast } = useToast();

  const handleFieldChange = (name: string, value: string | number | boolean | Date | FileList | null) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const shouldShowField = (field: FormField): boolean => {
    if (!field.conditionalLogic) return true;
    const { dependsOn, showIf } = field.conditionalLogic;
    return formData[dependsOn] === showIf;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    toast({
      title: "Form Submitted",
      description: "Your response has been recorded.",
    });
    setFormData({});
  };

  // Group fields by category
  const groupedFields = fields.reduce((acc, field) => {
    const category = categorizeField(field);
    if (!acc[category]) acc[category] = [];
    acc[category].push(field);
    return acc;
  }, {} as Record<string, FormField[]>);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Droppable droppableId="form-fields">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <AnimatePresence>
              {Object.entries(groupedFields).map(([category, categoryFields]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-4 mb-6">
                    <h3 className="text-lg font-semibold capitalize mb-4">{category}</h3>
                    <div className="space-y-4">
                      {categoryFields.map((field, index) => (
                        shouldShowField(field) && (
                          <Draggable
                            key={field.name}
                            draggableId={field.name}
                            index={index}
                            isDragDisabled={!isEditing}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <motion.div
                                  layout
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <FormFieldComponent
                                    {...field}
                                    onChange={(value) => handleFieldChange(field.name, value)}
                                    value={formData[field.name]}
                                    disabled={!isEditing && field.disabled}
                                  />
                                  {isEditing && (
                                    <FieldCustomizer
                                      field={field}
                                      onUpdate={(updatedField) => onUpdateField(index, updatedField)}
                                      onDelete={() => onDeleteField(index)}
                                    />
                                  )}
                                </motion.div>
                              </div>
                            )}
                          </Draggable>
                        )
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      {fields.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Your form is empty. Use the chatbot to add fields.
        </div>
      )}
      
      {!isEditing && fields.length > 0 && (
        <Button type="submit" className="w-full">Submit</Button>
      )}
    </form>
  );
};

export default FormPreview;