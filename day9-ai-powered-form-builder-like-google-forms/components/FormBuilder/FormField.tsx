'use client';
import React from 'react';
import { FormField as FormFieldType } from '@/types/form';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldProps extends FormFieldType {
  onChange: (value: string | number | boolean | Date | FileList | null) => void;
  value: string | number | boolean | Date | FileList | null;
}

const FormField: React.FC<FormFieldProps> = ({ type, label, name, required, placeholder, options, min, max, onChange, value, disabled }) => {
  const renderField = () => {
    switch (type) {
      case 'text':
        return <Input type="text" id={name} name={name} required={required} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} value={value as string || ''} disabled={disabled} />;
      case 'textarea':
        return <Textarea id={name} name={name} required={required} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} value={value as string || ''} disabled={disabled} />;
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={name} name={name} required={required} onCheckedChange={onChange} checked={value as boolean} disabled={disabled} />
            <Label htmlFor={name}>{label}</Label>
          </div>
        );
      case 'radio':
        return (
          <RadioGroup name={name} required={required} onValueChange={onChange} value={value as string} disabled={disabled}>
            {options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${name}-${index}`} />
                <Label htmlFor={`${name}-${index}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'dropdown':
        return (
          <Select name={name} required={required} onValueChange={onChange} value={value as string} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option, index) => (
                <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'file':
        return <Input type="file" id={name} name={name} required={required} onChange={(e) => onChange(e.target.files as FileList)} disabled={disabled} />;
      case 'date':
        return <Calendar selected={value as Date} onSelect={onChange as (date: Date | undefined) => void} disabled={disabled} />;
      case 'time':
        return <Input type="time" id={name} name={name} required={required} onChange={(e) => onChange(e.target.value)} value={value as string || ''} disabled={disabled} />;
      case 'number':
        return <Input type="number" id={name} name={name} required={required} min={min} max={max} onChange={(e) => onChange(Number(e.target.value))} value={value as number || ''} disabled={disabled} />;
      case 'range':
        return <Slider min={min} max={max} step={1} value={[value as number || 0]} onValueChange={([val]) => onChange(val)} disabled={disabled} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};

export default FormField;