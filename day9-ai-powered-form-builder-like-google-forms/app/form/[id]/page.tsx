'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FormPreview from '@/components/FormBuilder/FormPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormData } from '@/types/form';

const ViewForm: React.FC = () => {
  const params = useParams();
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the form data from an API
    // For this example, we'll use mock data
    const mockFormData: FormData = {
      title: 'Sample Form',
      fields: [
        { type: 'text', label: 'Name', name: 'name', required: true },
        { type: 'text', label: 'Email', name: 'email', required: true },
        { type: 'text', label: 'Comments', name: 'comments', required: false },
      ],
    };
    setFormData(mockFormData);
  }, [params.id]);

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{formData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormPreview
            fields={formData.fields}
            onUpdateField={() => {}}
            onDeleteField={() => {}}
            isEditing={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewForm;