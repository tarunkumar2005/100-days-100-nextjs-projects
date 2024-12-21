'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { templates } from './templates';
import { Card, CardContent } from '@/components/ui/card';

interface TemplateSelectorProps {
  onSelect: (template: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose a template:</h3>
      <div className="grid gap-4">
        {templates.map((template, index) => (
          <Card key={index} className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-4">
              <Button
                onClick={() => onSelect(template.name)}
                variant="ghost"
                className="w-full justify-start text-left h-auto p-0"
              >
                <div className="space-y-2">
                  <div className="font-semibold">{template.name}</div>
                  <div className="text-sm text-muted-foreground">{template.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {template.fields.length} fields included
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        ))}
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="p-4">
            <Button
              onClick={() => onSelect('scratch')}
              variant="ghost"
              className="w-full justify-start text-left h-auto p-0"
            >
              <div className="space-y-2">
                <div className="font-semibold">Start from scratch</div>
                <div className="text-sm text-muted-foreground">
                  Create a custom form from the ground up.
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TemplateSelector;