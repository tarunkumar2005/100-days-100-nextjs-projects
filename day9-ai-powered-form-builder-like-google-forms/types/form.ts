export interface FormField {
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'dropdown' | 'file' | 'date' | 'time' | 'number' | 'range' | 'section';
  label: string;
  name: string;
  required: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    acceptedFiles?: string;
    [key: string]: any;
  };
  min?: number;
  max?: number;
  conditionalLogic?: {
    dependsOn: string;
    showIf: string;
  };
  disabled?: boolean;
}

export interface FormData {
  title: string;
  fields: FormField[];
}

export interface APIResponse {
  action: 'createForm' | 'addField' | 'editLabel' | 'addPlaceholder' | 'setValidation' | 'addOptions' |
    'reorderFields' | 'deleteField' | 'addSection' | 'enableField' | 'disableField' | 'setConditionalLogic' |
    'changeTheme' | 'customizeStyles' | 'changeFormName';
  formName?: string;
  field?: FormField;
  fieldName?: string;
  sectionTitle?: string;
  reorderInstructions?: string;
  themeChoice?: 'light' | 'dark';
  customStyles?: {
    [key: string]: string;
  };
  fields?: FormField[];
}