import React from 'react';
import { FormField } from '@/types/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FieldCustomizerProps {
  field: FormField;
  onUpdate: (updatedField: FormField) => void;
  onDelete: () => void;
}

const FieldCustomizer: React.FC<FieldCustomizerProps> = ({ field, onUpdate, onDelete }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onUpdate({
      ...field,
      [name]: type === 'checkbox' ? checked : value,
      name: field.name, // Ensure the name property is always present
    });
  };

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
      <Input
        type="text"
        name="label"
        value={field.label}
        onChange={handleChange}
        placeholder="Field Label"
      />
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`required-${field.name}`}
          name="required"
          checked={field.required}
          onCheckedChange={(checked) => onUpdate({ ...field, required: checked as boolean })}
        />
        <Label htmlFor={`required-${field.name}`}>Required</Label>
      </div>
      {field.type === 'text' && (
        <Input
          type="text"
          name="placeholder"
          value={field.placeholder}
          onChange={handleChange}
          placeholder="Placeholder text"
        />
      )}
      <Button variant="destructive" onClick={onDelete}>Delete Field</Button>
    </div>
  );
};

export default FieldCustomizer;