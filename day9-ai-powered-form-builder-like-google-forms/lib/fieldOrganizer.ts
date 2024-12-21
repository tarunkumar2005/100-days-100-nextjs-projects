import { FormField } from '@/types/form';

type FieldCategory = {
  name: string;
  patterns: string[];
  order: number;
};

const fieldCategories: FieldCategory[] = [
  {
    name: 'personal',
    patterns: ['name', 'age', 'birth', 'gender', 'photo', 'avatar'],
    order: 1
  },
  {
    name: 'contact',
    patterns: ['email', 'phone', 'address', 'mobile', 'telephone'],
    order: 2
  },
  {
    name: 'professional',
    patterns: ['experience', 'education', 'skill', 'qualification', 'resume', 'cv', 'position', 'job', 'work'],
    order: 3
  },
  {
    name: 'preferences',
    patterns: ['prefer', 'interest', 'hobby', 'language'],
    order: 4
  },
  {
    name: 'consent',
    patterns: ['agree', 'terms', 'consent', 'privacy', 'policy'],
    order: 5
  }
];

export function categorizeField(field: FormField): string {
  const fieldNameLower = field.name.toLowerCase();
  const fieldLabelLower = field.label.toLowerCase();

  for (const category of fieldCategories) {
    if (category.patterns.some(pattern => 
      fieldNameLower.includes(pattern) || fieldLabelLower.includes(pattern)
    )) {
      return category.name;
    }
  }

  return 'other';
}

export function findInsertPosition(fields: FormField[], newField: FormField): number {
  const newFieldCategory = categorizeField(newField);
  const categoryOrder = fieldCategories.find(c => c.name === newFieldCategory)?.order || 999;

  let insertIndex = fields.length;
  
  // Find the last field of the same or earlier category
  for (let i = fields.length - 1; i >= 0; i--) {
    const currentFieldCategory = categorizeField(fields[i]);
    const currentCategoryOrder = fieldCategories.find(c => c.name === currentFieldCategory)?.order || 999;
    
    if (currentCategoryOrder <= categoryOrder) {
      insertIndex = i + 1;
      break;
    }
    
    if (i === 0) {
      insertIndex = 0;
    }
  }

  return insertIndex;
}